"""
AI Assistant with DuckDuckGo Integration

Features:
- Conversational responses for greetings, identity, gratitude, and farewells.
- Uses DuckDuckGo Instant Answer API for factual questions.
- Returns responses in a natural, ChatGPT-like style.

How to Run (for CLI test):
1. pip install -r requirements.txt
2. python ai_assistant.py

For Web API (Flask):
1. pip install -r requirements.txt
2. python server.py
"""

import requests

def duckduckgo_search(query):
    url = "https://api.duckduckgo.com/"
    params = {"q": query, "format": "json", "no_redirect": 1, "no_html": 1}
    try:
        response = requests.get(url, params=params)
        data = response.json()
        if data.get("AbstractText"):
            return data["AbstractText"]
        elif data.get("RelatedTopics"):
            for topic in data["RelatedTopics"]:
                if "Text" in topic:
                    return topic["Text"]
        return None
    except Exception:
        return None

def ai_response(user_input):
    query = user_input.lower().strip()
    # Conversational responses
    if query in ["hello", "hi", "hey"]:
        return "Hello! How can I help you today?"
    elif "who are you" in query:
        return "I am an AI assistant designed to help answer your questions."
    elif "thank" in query:
        return "You're welcome!"
    elif query in ["bye", "goodbye"]:
        return "Goodbye! Have a great day!"
    # Otherwise, search DuckDuckGo
    else:
        search_result = duckduckgo_search(query)
        if search_result:
            return f"Here’s what I found: {search_result}"
        else:
            return "I couldn’t find anything useful on that."

def main():
    print("AI Assistant is running. Type 'bye' to exit.")
    while True:
        user_input = input("You: ")
        response = ai_response(user_input)
        print("AI:", response)
        if user_input.lower().strip() in ["bye", "goodbye"]:
            break

if __name__ == "__main__":
    main()
