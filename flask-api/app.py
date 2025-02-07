from flask import Flask, request, jsonify
import json
from sentiment_analysis import analyze_sentiment
app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to the Sentiment Analysis API! Use the /analyze endpoint to analyze journal entries."

@app.route('/analyze-content', methods=['POST'])
def analyze():
    
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Run the Flask app on localhost:5000