"""
Flask server to serve AI Assistant as a REST API
"""

from flask import Flask, request, jsonify
from ai_assistant import ai_response

app = Flask(__name__)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    user_input = data.get("message", "")
    response = ai_response(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
