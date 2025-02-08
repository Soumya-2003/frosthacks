from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from sentiment_analysis import analyze_sentiment
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Welcome to the Sentiment Analysis API! Use the /analyze-content or /analyze-sentence endpoints."

@app.route('/analyze-content', methods=['POST'])
def analyze_content():
    """
    Analyze the sentiment of a single journal entry.
    Expects JSON input with a 'content' field.
    """
    try:
        # Parse the input JSON
        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'Invalid input. Expected JSON with "content" field.'}), 400
        
        # Extract content
        content = data['content']
        
        # Perform sentiment analysis
        sentiment_results = analyze_sentiment(content)
        
        # Return the results
        return jsonify(sentiment_results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Run the Flask app on localhost:5000
