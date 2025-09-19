"""
Flask server to serve AI Assistant as a REST API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_assistant import ai_response

app = Flask(__name__)
CORS(app)  # allow all origins (frontend -> backend)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        user_input = data.get("message", "")
        response = ai_response(user_input)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
