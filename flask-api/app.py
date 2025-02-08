from flask import Flask, request, jsonify
import json
import tweepy
from sentiment_analysis import analyze_sentiment
from weekly_analysis import weekly_sentiment_analysis
from social_media_analyzer import twitter_analyzer
import os
from dotenv import load_dotenv
from report.emotion_analysis import generate_weekly_report
import requests

load_dotenv()

app = Flask(__name__)


# Twitter API v2 credentials
API_KEY = os.getenv("NEXT_PUBLIC_TWEEPY_API_KEY")
API_SECRET = os.getenv("NEXT_PUBLIC_TWEEPY_API_SECRET")
BEARER_TOKEN = os.getenv("BEARER_TOKEN")

GOOGLE_API_KEY = os.getenv("NEXT_PUBLIC_GOOGLE_API_KEY")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GOOGLE_API_KEY}"

# Tweepy client for v2 API
client = tweepy.Client(bearer_token=BEARER_TOKEN)

@app.route('/')
def home():
    
    return "Welcome to the Sentiment Analysis API! Use the /analyze endpoint to analyze journal entries."

@app.route('/twitter-sentiment', methods=['POST'])
def twitter_sentiment_analysis():
    data = request.get_json()
    username = data['username']
    if not username:
        return jsonify({"error": "Username is required"}), 400

    try:
        user = client.get_user(username=username)
        if not user.data:
            return jsonify({"error": "User not found"}), 404

        user_id = user.data.id
        tweets = client.get_users_tweets(id=user_id, max_results=10)
        
        tweets_text = [tweet.text for tweet in tweets.data] 
    except (tweepy.TooManyRequests, Exception) as e:
        tweets_text = [
            "Just watched the latest episode of my favorite show! Amazing storyline! #TVShows", 
            "Feeling grateful for all the wonderful people in my life. #Blessed", 
            "The weather today is terrible. It's been raining all day and ruined my plans. #Frustrated"]
    
    sentiments = [twitter_analyzer.analyze_sentiment(tweet) for tweet in tweets_text]
    response = twitter_analyzer.build_response(username, tweets_text, sentiments)
    return jsonify(response)

@app.route('/analyze-content', methods=['POST'])
def analyze_content():
    """
    Analyze the sentiment of a single journal entry.
    Expects JSON input with a 'content' field.
    """
    try:
        # Validate JSON request
        data = request.get_json()
        content = data.get('content') if isinstance(data, dict) else None

        print("MYYYYYYYY Content: ",content)

        if not content:
            return jsonify({'error': 'Invalid input. Expected JSON with "content" field.'}), 400

        #Perform sentiment analysis (Uncomment when function is available)
        sentiment_results = analyze_sentiment([content])
        return jsonify(sentiment_results), 200

    except Exception as e:
        print(f"Error in Flask API: {e}")  # Log exact error
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/analyze-sentence', methods=['POST'])
def analyze_sentence():
    """
    Analyze the sentiment of a sentence based on a specific word.
    Expects JSON input with 'sentence' and 'word' fields.
    """
    try:
        # Parse the input JSON
        data = request.get_json()
        if not data or 'sentence' not in data or 'word' not in data:
            return jsonify({'error': 'Invalid input. Expected JSON with "sentence" and "word" fields.'}), 400
        
        sentence = data['sentence']
        word = data['word']
        
        # Check if the word is in the sentence
        if word.lower() not in sentence.lower():
            return jsonify({'error': f'The word "{word}" is not present in the sentence.'}), 400
        
        # Perform sentiment analysis
        sentiment_results = analyze_sentiment(sentence)
        
        # Add the word to the response
        sentiment_results["word"] = word
        
        # Return the results
        return jsonify(sentiment_results), 200
    
    except Exception as e:
        print(f"Error in Flask API: {e}")  # Log exact error
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/analyze-weekly-data', methods=['POST'])
def analyze_weekly_data():
    try:
        # Parse the input JSON
        data = request.get_json()
        if not data or 'journal_entries' not in data:
            return jsonify({'error': 'Invalid input. Expected JSON with "journal_entries" field.'}), 400

        journal_entries = data['journal_entries']  # Dictionary of journal entries (Day 1, Day 2, etc.)

        print("starting")
        overall_mood, overall_emotions = weekly_sentiment_analysis(journal_entries)

        print(">>Overall Mood: reaching")

        # Prepare the response
        return jsonify({
            "overall_emotions": overall_emotions,
            "overall_mood": overall_mood.upper(),
            "message": "Emotion analysis completed successfully"
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/chatbot", methods=["POST"])
def chatbot():
    try:
        # Get user input from request JSON
        data = request.get_json()
        user_message = data.get("message", "")

        # Prepend context
        prompt = f"Respond like a mental health chatbot in 1 or 2 sentences. User is saying this: {user_message}"

        # Prepare API request payload
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        # Send request to Gemini API
        response = requests.post(GEMINI_URL, json=payload, headers={"Content-Type": "application/json"})
        response_data = response.json()

        # Extract bot response
        bot_response = response_data.get("candidates", [{}])[0].get("content", "I'm here to help. Please tell me more.")

        return jsonify({"response": bot_response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Run the Flask app on localhost:5000
