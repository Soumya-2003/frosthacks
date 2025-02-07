import ssl
import json
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

ssl._create_default_https_context = ssl._create_unverified_context
# Ensure VADER lexicon is downloaded
nltk.download('vader_lexicon')

def analyze_sentiment(sentences):
    """
    Analyzes the sentiment of a list of sentences using VADER.
    It also calculates the overall sentiment of the paragraph.

    Args:
        sentences (list): A list of sentences as input.

    Returns:
        dict: JSON formatted output with individual and overall sentiment results.
    """
    sia = SentimentIntensityAnalyzer()
    results = {}
    
    overall_compound = 0  # Sum of all compound scores
    positive_count = 0
    negative_count = 0
    neutral_count = 0

    for sentence in sentences:
        scores = sia.polarity_scores(sentence)
        compound = scores["compound"]

        if compound >= 0.05:
            mood = "Positive"
            positive_count += 1
        elif compound <= -0.05:
            mood = "Negative"
            negative_count += 1
        else:
            mood = "Neutral"
            neutral_count += 1

        overall_compound += compound

        results['content'] = {
            "sentiment_score": compound,
            "mood": mood
        }

    # Calculate average sentiment score for overall paragraph
    avg_compound = overall_compound / len(sentences)

    # Determine overall sentiment
    if avg_compound >= 0.05:
        overall_mood = "Positive"
    elif avg_compound <= -0.05:
        overall_mood = "Negative"
    else:
        overall_mood = "Neutral"

    # Add overall sentiment result
    results["overall_sentiment"] = {
        "average_sentiment_score": round(avg_compound, 4),
        "mood": overall_mood,
        "positive_sentences": positive_count,
        "negative_sentences": negative_count,
        "neutral_sentences": neutral_count
    }

    return results

 