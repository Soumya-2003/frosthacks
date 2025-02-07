from flask import Flask, request, jsonify
import json
from sentiment_analysis import analyze_sentiment
from weekly_analysis import weekly_sentiment_analysis
app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Sentiment Analysis API! Use the /analyze endpoint to analyze journal entries."

@app.route('/analyze-content', methods=['POST'])
def analyze_content():
    
    try:
        # Parse the input JSON
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'Invalid input. Expected JSON with "content" field.'}), 400

        # Extract the journal content
        journal_contents = [data['content']]

        # Perform sentiment analysis
        sentiment_results = analyze_sentiment(journal_contents)

        # Return the results
        return jsonify(sentiment_results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Run the Flask app on localhost:5000