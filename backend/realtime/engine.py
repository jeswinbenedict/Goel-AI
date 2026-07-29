"""
GOEL Real-Time Engine
Background workers that drive the real-time data flow:
  1. USGS Monitor        — polls USGS every 30s, pushes new earthquakes
  2. Survivor Simulator  — simulates progressive drone-based detection
  3. PSO Auto-optimizer  — re-runs PSO when survivor list changes
  4. Seismic Streamer    — streams realistic waveform amplitudes
  5. Team Movement       — moves rescue teams toward assigned targets
"""

import time
import math
import random
import requests
from realtime import state
from utils.fuzzy_engine import get_survival_zone
from utils.pso_optimizer import optimize_rescue_routes


def fetch_usgs_feed():
    """Fetch live earthquake features from USGS real-time feeds with fallbacks."""
    urls = [
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
    ]
    for url in urls:
        try:
            resp = requests.get(url, timeout=8)
            if resp.status_code == 200:
                data = resp.json()
                features = data.get('features', [])
                if features:
                    return features
        except Exception as e:
            print(f"[USGS Fetch] Warning for {url}: {e}")
            continue
    return []


def start_all(socketio):
    """Start all background workers. Call once from app.py."""
    # Pre-seed state with live real-world USGS data immediately on launch
    try:
        features = fetch_usgs_feed()
        for f in features[:20]:
            props = f.get('properties', {})
            geom = f.get('geometry', {}).get('coordinates', [0, 0, 0])
            state.add_earthquake({
                'id': f.get('id'),
                'magnitude': props.get('mag', 0),
                'place': props.get('place', 'Unknown region'),
                'time': props.get('time'),
                'url': props.get('url'),
                'tsunami': props.get('tsunami', 0),
                'alert': props.get('alert'),
                'felt': props.get('felt'),
                'lat': geom[1],
                'lng': geom[0],
                'depth': geom[2],
            })
        quakes = state.get_earthquakes()
        if quakes:
            # Pick highest magnitude recent earthquake as active epicenter
            top_quake = max(quakes, key=lambda q: q.get('magnitude', 0))
            state.update_epicenter_from_quake(top_quake)
            print(f"  [OK] Initialized live earthquake epicenter: {top_quake['place']} (M{top_quake['magnitude']})")
    except Exception as e:
        print(f"  [WARNING] Initial USGS seed error: {e}")

    socketio.start_background_task(usgs_monitor, socketio)
    socketio.start_background_task(survivor_simulator, socketio)
    socketio.start_background_task(seismic_streamer, socketio)
    socketio.start_background_task(team_movement, socketio)
    print("  [OK] USGS earthquake monitor")
    print("  [OK] Survivor detection simulator")
    print("  [OK] Seismic waveform streamer")
    print("  [OK] Team movement simulator")


# ═══════════════════════════════════════════════════════════════════
# 1. USGS Earthquake Monitor
# ═══════════════════════════════════════════════════════════════════
def usgs_monitor(socketio):
    """Poll USGS every 30s, emit new earthquakes."""
    while True:
        try:
            features = fetch_usgs_feed()
            new_count = 0
            latest_quake = None

            for f in features[:20]:
                props = f.get('properties', {})
                geom = f.get('geometry', {}).get('coordinates', [0, 0, 0])
                quake = {
                    'id': f.get('id'),
                    'magnitude': props.get('mag', 0),
                    'place': props.get('place', 'Unknown region'),
                    'time': props.get('time'),
                    'url': props.get('url'),
                    'tsunami': props.get('tsunami', 0),
                    'alert': props.get('alert'),
                    'felt': props.get('felt'),
                    'lat': geom[1],
                    'lng': geom[0],
                    'depth': geom[2],
                }
                is_new = state.add_earthquake(quake)
                if is_new:
                    new_count += 1
                    if not latest_quake:
                        latest_quake = quake

            if latest_quake and new_count > 0:
                state.update_epicenter_from_quake(latest_quake)
                socketio.emit('earthquake:new', latest_quake)
                socketio.emit('epicenter:updated', state.get_epicenter_info())

                mag = latest_quake['magnitude']
                evt = state.add_timeline_event({
                    'time': time.strftime('%H:%M'),
                    'label': f'M{mag} Earthquake Detected',
                    'desc': f'{latest_quake["place"]} · Depth {latest_quake["depth"]:.1f}km · Operational map centered',
                    'color': '#ff3b30' if mag >= 6 else '#ff9500' if mag >= 4 else '#ffd60a',
                    'status': 'done',
                })
                socketio.emit('timeline:event', evt)

            # Emit updated full list to clients
            socketio.emit('earthquake:list', state.get_earthquakes())

        except Exception as e:
            print(f"[USGS Monitor] Error: {e}")

        socketio.sleep(30)


# ═══════════════════════════════════════════════════════════════════
# 2. Survivor Detection Simulator
# ═══════════════════════════════════════════════════════════════════
def survivor_simulator(socketio):
    """Simulates progressive discovery of survivors by CNN drones."""
    # Wait initial delay before first new detection
    socketio.sleep(20)

    max_total_survivors = 20  # Cap total survivors

    while True:
        current = state.get_survivors()
        if len(current) >= max_total_survivors:
            socketio.sleep(60)
            continue

        # Generate a new survivor
        surv_data = state.generate_random_survivor()

        # Run fuzzy scoring on the new survivor
        try:
            fuzzy_result = get_survival_zone(
                surv_data['heat'],
                surv_data['void_probability'],
                state.get_stats()['hours_since_quake']
            )
            surv_data['zone'] = fuzzy_result['zone']
            surv_data['survival_score'] = fuzzy_result['survival_score']
        except Exception:
            pass  # Keep the zone from generate_random_survivor

        # Add to state
        survivor = state.add_survivor(surv_data)

        # Emit to all clients
        socketio.emit('survivor:detected', survivor)

        # Add timeline event
        evt = state.add_timeline_event({
            'time': time.strftime('%H:%M'),
            'label': f'Survivor #{survivor["id"]} Detected',
            'desc': f'CNN {survivor["confidence"]}% confidence · {survivor["loc"]} · {survivor["zone"]} zone',
            'color': '#ff3b30' if survivor['zone'] == 'CRITICAL' else '#ffd60a' if survivor['zone'] == 'MODERATE' else '#30d158',
            'status': 'done',
        })
        socketio.emit('timeline:event', evt)

        # Emit updated stats
        socketio.emit('stats:update', state.get_stats())

        # Auto-run PSO with new survivor
        _run_pso_update(socketio)

        # Random interval: 20–60s between detections
        socketio.sleep(random.uniform(20, 60))


# ═══════════════════════════════════════════════════════════════════
# 3. PSO Auto-Optimizer (called by survivor_simulator and team_movement)
# ═══════════════════════════════════════════════════════════════════
def _run_pso_update(socketio):
    """Re-run PSO and emit updated routes."""
    try:
        survivors = state.get_survivors()
        teams = state.get_teams()

        # Only optimize for non-rescued survivors
        active_survs = [s for s in survivors if s.get('status') != 'rescued']
        if not active_survs or not teams:
            return

        surv_positions = [s['pos'] for s in active_survs]
        team_positions = [t['pos'] for t in teams]

        result = optimize_rescue_routes(surv_positions, team_positions)

        # Update team assignments based on PSO result
        for route in result.get('routes', []):
            team_name = route.get('team')
            # Find closest active survivor to the assigned position
            if route.get('surv_pos'):
                surv_pos = route['surv_pos']
                closest = min(active_survs, key=lambda s: _dist(s['pos'], surv_pos))
                state.update_team(team_name, target_survivor=closest['id'], status='EN ROUTE')

        socketio.emit('routes:updated', {
            'routes': result.get('routes', []),
            'total_cost': result.get('total_cost', 0),
            'iterations': result.get('iterations', 100),
            'particles': result.get('particles', 30),
            'teams': state.get_teams(),
        })

    except Exception as e:
        print(f"[PSO Update] Error: {e}")


# ═══════════════════════════════════════════════════════════════════
# 4. Seismic Data Streamer
# ═══════════════════════════════════════════════════════════════════
def seismic_streamer(socketio):
    """Stream realistic P/S-wave seismic amplitude data."""
    t = 0

    while True:
        # Simulate realistic seismic waveform
        # Base ambient noise
        noise = random.gauss(0, 0.15)

        # Occasional P-wave bursts
        p_wave = 0
        if random.random() < 0.008:  # ~every 25s
            p_wave = math.sin(t * 0.8) * random.uniform(2, 5)

        # Occasional S-wave bursts (larger, slower)
        s_wave = 0
        if random.random() < 0.005:  # ~every 40s
            s_wave = math.sin(t * 0.5) * random.uniform(4, 8)

        # Aftershock spikes
        aftershock = 0
        if random.random() < 0.002:  # ~every 100s
            aftershock = random.choice([-1, 1]) * random.uniform(6, 12)

        amplitude = round(noise + p_wave + s_wave + aftershock, 3)

        socketio.emit('seismic:data', {'t': t, 'amplitude': amplitude})
        t += 1

        socketio.sleep(0.2)  # 5 Hz sample rate


# ═══════════════════════════════════════════════════════════════════
# 5. Team Movement Simulator
# ═══════════════════════════════════════════════════════════════════
def team_movement(socketio):
    """Move rescue teams toward their assigned survivors."""
    SPEED = 0.0003  # ~33m per tick at 2s intervals

    while True:
        teams = state.get_teams()
        survivors = state.get_survivors()
        any_moved = False

        for team in teams:
            target_id = team.get('target_survivor')
            if not target_id or team.get('status') == 'STANDBY':
                continue

            # Find target survivor
            target = next((s for s in survivors if s['id'] == target_id), None)
            if not target:
                continue

            # If survivor already rescued, go standby
            if target.get('status') == 'rescued':
                state.update_team(team['name'], status='STANDBY')
                any_moved = True
                continue

            # Move toward target
            dx = target['pos'][0] - team['pos'][0]
            dy = target['pos'][1] - team['pos'][1]
            dist = math.sqrt(dx * dx + dy * dy)

            if dist < SPEED * 2:
                # Arrived — rescue the survivor
                state.update_team(team['name'],
                                  pos=list(target['pos']),
                                  status='RESCUING')

                # After "arriving", mark rescued after a short delay
                socketio.sleep(3)
                state.rescue_survivor(target_id, team['name'])
                state.update_team(team['name'], status='STANDBY')

                # Emit rescue event
                socketio.emit('survivor:rescued', {
                    'id': target_id,
                    'team': team['name'],
                })

                evt = state.add_timeline_event({
                    'time': time.strftime('%H:%M'),
                    'label': f'Survivor #{target_id} Rescued',
                    'desc': f'{team["name"]} confirmed rescue · {target.get("loc", "Unknown")}',
                    'color': '#30d158',
                    'status': 'done',
                })
                socketio.emit('timeline:event', evt)
                socketio.emit('stats:update', state.get_stats())

                # Re-run PSO to reassign idle team
                _run_pso_update(socketio)
                any_moved = True
            else:
                # Move one step toward target
                new_lat = team['pos'][0] + (dx / dist) * SPEED
                new_lng = team['pos'][1] + (dy / dist) * SPEED
                state.update_team(team['name'],
                                  pos=[round(new_lat, 6), round(new_lng, 6)],
                                  status='EN ROUTE')
                any_moved = True

        if any_moved:
            socketio.emit('teams:moved', state.get_teams())
            socketio.emit('stats:update', state.get_stats())

        socketio.sleep(2)


# ── Utility ───────────────────────────────────────────────────────
def _dist(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
