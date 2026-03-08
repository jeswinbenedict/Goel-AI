from flask import Blueprint, request, jsonify
import requests as req
import random
from utils.fuzzy_engine import get_survival_zone
from utils.pso_optimizer import optimize_rescue_routes

api = Blueprint('api', __name__)

# ─── Health Check ─────────────────────────────────
@api.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': '✅ GOEL Backend Online',
        'version': '1.0',
        'models': {
            'fuzzy': 'Active',
            'pso':   'Active',
            'cnn':   'Simulated'
        }
    })

# ─── Fuzzy Logic Survival Score ───────────────────
@api.route('/fuzzy-score', methods=['POST'])
def fuzzy_score():
    try:
        data  = request.json
        heat  = float(data.get('heat',  50))
        void  = float(data.get('void',  50))
        hours = float(data.get('hours', 12))

        result = get_survival_zone(heat, void, hours)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ─── PSO Route Optimization ───────────────────────
@api.route('/optimize-routes', methods=['POST'])
def optimize_routes():
    try:
        data      = request.json
        survivors = data.get('survivors', [[35.681, 139.767]])
        teams     = data.get('teams',     [[35.675, 139.720]])

        result = optimize_rescue_routes(survivors, teams)
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ─── Live USGS Earthquake Feed ────────────────────
@api.route('/earthquake-live', methods=['GET'])
def earthquake_live():
    try:
        url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
        response = req.get(url, timeout=10)
        data     = response.json()

        quakes = []
        for f in data['features'][:10]:
            quakes.append({
                'magnitude': f['properties']['mag'],
                'place':     f['properties']['place'],
                'time':      f['properties']['time'],
                'lat':       f['geometry']['coordinates'][1],
                'lng':       f['geometry']['coordinates'][0],
                'depth':     f['geometry']['coordinates'][2],
            })

        return jsonify({
            'earthquakes': quakes,
            'count': len(quakes)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── CNN Thermal Image Analysis ───────────────────
@api.route('/analyze-thermal', methods=['POST'])
def analyze_thermal():
    try:
        confidence = round(random.uniform(75, 97), 1)
        heat       = round(random.uniform(33, 39), 1)
        zone_data  = get_survival_zone(heat * 2.5, 70, 12)

        return jsonify({
            'survivors_detected': random.randint(1, 4),
            'confidence':         confidence,
            'heat_signature':     heat,
            'void_probability':   round(random.uniform(60, 90), 1),
            'zone':               zone_data['zone'],
            'survival_score':     zone_data['survival_score'],
            'processing_time_ms': random.randint(200, 800),
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
