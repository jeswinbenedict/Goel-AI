from flask import Flask
from flask_cors import CORS
from api.routes import api
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

CORS(app, origins=[
    "http://localhost:5173",
    "https://goel.vercel.app"
])

app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def home():
    return {
        'message': '🚨 GOEL Backend is Online!',
        'version': '1.0',
        'status': 'running'
    }

if __name__ == '__main__':
    print("🚨 GOEL Backend Starting...")
    print("📡 Running at http://localhost:5000")
    app.run(debug=True, port=5000)
