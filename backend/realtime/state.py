"""
Centralized server-side state for the GOEL real-time engine.
Thread-safe access via locks for all mutable collections.
"""

import threading
import time
import random

_lock = threading.Lock()

# ── Operation start time ──────────────────────────────────────────
# Simulates that the earthquake happened ~18 hours ago
_quake_time = time.time() - (18 * 3600)

# ── Survivors ─────────────────────────────────────────────────────
# Start with initial 5 detected survivors (matching original static data)
_survivors = [
    {
        'id': 1, 'pos': [35.694, 139.753], 'zone': 'CRITICAL',
        'confidence': 94.2, 'loc': 'Block A, Floor 2',
        'temp': 36.8, 'pulse': 72, 'status': 'detected',
        'detected_at': _quake_time + 18 * 60,  # 18 min after quake
    },
    {
        'id': 2, 'pos': [35.689, 139.700], 'zone': 'CRITICAL',
        'confidence': 88.1, 'loc': 'Block C, Floor 1',
        'temp': 35.4, 'pulse': 58, 'status': 'detected',
        'detected_at': _quake_time + 25 * 60,
    },
    {
        'id': 3, 'pos': [35.701, 139.730], 'zone': 'MODERATE',
        'confidence': 76.5, 'loc': 'Block B, Floor 3',
        'temp': 34.2, 'pulse': 64, 'status': 'detected',
        'detected_at': _quake_time + 41 * 60,
    },
    {
        'id': 4, 'pos': [35.710, 139.745], 'zone': 'MODERATE',
        'confidence': 81.3, 'loc': 'Block D, Floor 2',
        'temp': 35.9, 'pulse': 68, 'status': 'detected',
        'detected_at': _quake_time + 41 * 60,
    },
    {
        'id': 5, 'pos': [35.680, 139.715], 'zone': 'LOW',
        'confidence': 67.8, 'loc': 'Block E, Ground Floor',
        'temp': 33.1, 'pulse': 80, 'status': 'detected',
        'detected_at': _quake_time + 55 * 60,
    },
]

_next_survivor_id = 6

# ── Rescue Teams ──────────────────────────────────────────────────
_teams = [
    {
        'name': 'Alpha Team', 'members': 4,
        'pos': [35.690, 139.748],
        'target_survivor': 1, 'status': 'EN ROUTE',
        'color': '#ff3b30',
    },
    {
        'name': 'Bravo Team', 'members': 3,
        'pos': [35.698, 139.725],
        'target_survivor': 3, 'status': 'DEPLOYING',
        'color': '#ffd60a',
    },
    {
        'name': 'Charlie Team', 'members': 5,
        'pos': [35.705, 139.740],
        'target_survivor': 4, 'status': 'EN ROUTE',
        'color': '#0a84ff',
    },
]

# ── Earthquakes (known set, for dedup) ────────────────────────────
_earthquakes = []
_known_quake_ids = set()

# ── Timeline events ──────────────────────────────────────────────
_timeline = [
    {'time': '00:00', 'label': 'Earthquake Detected',      'desc': 'M7.2 event — USGS API triggered system activation',        'color': '#ff3b30', 'status': 'done'},
    {'time': '00:04', 'label': 'Thermal Drones Deployed',   'desc': '3 drones covering 4.2km² of affected zone',               'color': '#ff9500', 'status': 'done'},
    {'time': '00:18', 'label': 'Survivor #1 Detected',      'desc': 'CNN 94% confidence · Block A Floor 2 · Critical zone',    'color': '#ff3b30', 'status': 'done'},
    {'time': '00:25', 'label': 'Survivor #2 Detected',      'desc': 'CNN 88% confidence · Block C Floor 1 · Critical zone',    'color': '#ff3b30', 'status': 'done'},
    {'time': '00:41', 'label': 'Alpha Team Dispatched',     'desc': 'PSO optimal route → Block A · ETA 8 min',                 'color': '#30d158', 'status': 'done'},
    {'time': '00:41', 'label': 'Survivor #3 & #4 Detected', 'desc': 'Fuzzy Logic MODERATE zone · ANN void probability 78%',   'color': '#ffd60a', 'status': 'done'},
    {'time': '00:55', 'label': 'Survivor #5 Detected',      'desc': 'CNN 68% confidence · Block E Ground Floor · LOW zone',    'color': '#30d158', 'status': 'done'},
]

# ── Rescued count ─────────────────────────────────────────────────
_rescued_ids = set()


# ═══════════════════════════════════════════════════════════════════
# Public API (thread-safe)
# ═══════════════════════════════════════════════════════════════════

def get_quake_time():
    return _quake_time


def get_snapshot():
    """Return full state for initial hydration."""
    with _lock:
        return {
            'survivors':   list(_survivors),
            'teams':       list(_teams),
            'earthquakes': list(_earthquakes),
            'timeline':    list(_timeline),
            'stats':       _compute_stats(),
            'quake_time':  _quake_time,
            'epicenter':   {
                'pos': list(_epicenter),
                'place': _epicenter_place,
            },
        }


def get_survivors():
    with _lock:
        return list(_survivors)


def get_teams():
    with _lock:
        return list(_teams)


def add_survivor(survivor):
    """Add a new detected survivor. Returns the survivor with assigned ID."""
    global _next_survivor_id
    with _lock:
        survivor['id'] = _next_survivor_id
        _next_survivor_id += 1
        survivor['detected_at'] = time.time()
        survivor['status'] = 'detected'
        _survivors.append(survivor)
        return dict(survivor)


def rescue_survivor(survivor_id, team_name):
    """Mark a survivor as rescued."""
    with _lock:
        for s in _survivors:
            if s['id'] == survivor_id:
                s['status'] = 'rescued'
                _rescued_ids.add(survivor_id)
                break


def update_team(team_name, **kwargs):
    """Update a team's position / status."""
    with _lock:
        for t in _teams:
            if t['name'] == team_name:
                t.update(kwargs)
                break


def add_earthquake(quake):
    """Add earthquake if not already known. Returns True if new."""
    with _lock:
        qid = f"{quake.get('lat', 0)}_{quake.get('lng', 0)}_{quake.get('time', 0)}"
        if qid in _known_quake_ids:
            return False
        _known_quake_ids.add(qid)
        _earthquakes.append(quake)
        # Keep at most 20
        if len(_earthquakes) > 20:
            _earthquakes.pop(0)
        return True


def get_earthquakes():
    with _lock:
        return list(_earthquakes)


def add_timeline_event(event):
    """Append a timeline event."""
    with _lock:
        _timeline.append(event)
        return dict(event)


def get_timeline():
    with _lock:
        return list(_timeline)


def get_stats():
    with _lock:
        return _compute_stats()


def _compute_stats():
    detected = len(_survivors)
    rescued = len(_rescued_ids)
    active_teams = sum(1 for t in _teams if t['status'] in ('EN ROUTE', 'DEPLOYING', 'RESCUING'))
    critical = sum(1 for s in _survivors if s['zone'] == 'CRITICAL' and s['status'] != 'rescued')
    hours = (time.time() - _quake_time) / 3600
    return {
        'survivors_detected': detected,
        'survivors_rescued':  rescued,
        'teams_active':       active_teams,
        'critical_zones':     critical,
        'hours_since_quake':  round(hours, 1),
        'hours_remaining':    round(max(0, 72 - hours), 1),
    }


# ── Location generation helpers ───────────────────────────────────
# Dynamic epicenter based on latest real-time USGS earthquake (defaults to Tokyo if no feeds yet)
_epicenter = [35.694, 139.735]
_epicenter_place = "Tokyo Metropolitan Area"
SPREAD = 0.045  # ~5km spread around earthquake zone

BLOCKS = ['Sector Alpha', 'Sector Bravo', 'Sector Charlie', 'Sector Delta', 'Sector Echo',
          'Block A', 'Block B', 'Block C', 'Block D', 'Floor 1', 'Floor 2', 'Ground Level']


def update_epicenter_from_quake(quake):
    """Update active operation epicenter when a significant earthquake is detected."""
    global _epicenter, _epicenter_place
    with _lock:
        lat = quake.get('lat')
        lng = quake.get('lng')
        place = quake.get('place', 'Earthquake Zone')
        if lat is not None and lng is not None:
            _epicenter = [float(lat), float(lng)]
            _epicenter_place = place
            # Reposition rescue teams to new epicenter perimeter
            for i, team in enumerate(_teams):
                team['pos'] = [
                    round(lat + (0.01 * (i + 1)), 6),
                    round(lng + (0.01 * (i + 1)), 6)
                ]
                team['status'] = 'EN ROUTE'


def get_epicenter_info():
    with _lock:
        return {
            'pos': list(_epicenter),
            'place': _epicenter_place
        }


def generate_random_survivor():
    """Generate a realistic randomized survivor near the active earthquake epicenter."""
    with _lock:
        ep_lat, ep_lng = _epicenter

    lat = ep_lat + random.uniform(-SPREAD, SPREAD)
    lng = ep_lng + random.uniform(-SPREAD, SPREAD)
    conf = round(random.uniform(62, 96), 1)
    temp = round(random.uniform(33.0, 38.5), 1)
    pulse = random.randint(45, 95)
    heat = temp * 2.5
    void_prob = round(random.uniform(40, 90), 1)

    if conf > 85:
        zone = 'CRITICAL'
    elif conf > 70:
        zone = 'MODERATE'
    else:
        zone = 'LOW'

    return {
        'pos': [round(lat, 6), round(lng, 6)],
        'zone': zone,
        'confidence': conf,
        'loc': f'{_epicenter_place} ({random.choice(BLOCKS)})',
        'temp': temp,
        'pulse': pulse,
        'heat': heat,
        'void_probability': void_prob,
    }
