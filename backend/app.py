from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from api.routes import api
from realtime import state, engine
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "https://goel.vercel.app",
    "https://jeswinbenedict.github.io",
])

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def home():
    return {
        'message': '🚨 GOEL Backend is Online!',
        'version': '2.0',
        'status': 'running',
        'realtime': True,
    }

# ── WebSocket Events ──────────────────────────────────────────────
_engine_started = False

@socketio.on('connect')
def handle_connect(auth=None):
    global _engine_started
    print("Client connected")
    # Send full state snapshot to new client
    emit('state:snapshot', state.get_snapshot())
    # Start engine on first connection
    if not _engine_started:
        _engine_started = True
        engine.start_all(socketio)

@socketio.on('disconnect')
def handle_disconnect(reason=None):
    print("Client disconnected")

# ── Allow manual triggers via WebSocket too ───────────────────────
@socketio.on('request:pso')
def handle_pso_request():
    """Client can request a manual PSO re-run."""
    engine._run_pso_update(socketio)

@socketio.on('request:fuzzy')
def handle_fuzzy_request(data):
    """Client can request a manual fuzzy score."""
    from utils.fuzzy_engine import get_survival_zone
    try:
        result = get_survival_zone(
            float(data.get('heat', 50)),
            float(data.get('void', 50)),
            float(data.get('hours', 12))
        )
        emit('fuzzy:result', result)
    except Exception as e:
        emit('fuzzy:result', {'error': str(e)})


if __name__ == '__main__':
    print("GOEL Backend Starting (Real-Time Mode)...")
    print("WebSocket server at http://localhost:5000")
    print("Background workers will start on first client connection")
    socketio.run(app, debug=True, port=5000, use_reloader=False)

