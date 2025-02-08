from textblob import TextBlob
from collections import Counter

def analyze_sentiment(tweet):
    """Analyze the sentiment of a tweet using TextBlob."""
    analysis = TextBlob(tweet)
    if analysis.sentiment.polarity > 0:
        return "Positive"
    elif analysis.sentiment.polarity < 0:
        return "Negative"
    else:
        return "Neutral"
    
def extract_fields(tweets):
    """Extract hashtags, mentions, and topics from tweets."""
    hashtags = Counter([tag for tweet in tweets for tag in tweet.split() if tag.startswith('#')])
    mentions = Counter([mention for tweet in tweets for mention in tweet.split() if mention.startswith('@')])
    topics = Counter([word.lower() for tweet in tweets for word in tweet.split() if len(word) > 4])

    return {
        "hashtags": hashtags.most_common(5),
        "mentions": mentions.most_common(5),
        "topics": topics.most_common(5),
    }
    
def build_response(username, tweets, sentiments):
    """Build the hierarchical JSON response."""
    positive_tweets = [tweets[i] for i in range(len(tweets)) if sentiments[i] == "Positive"]
    negative_tweets = [tweets[i] for i in range(len(tweets)) if sentiments[i] == "Negative"]

    positive_fields = extract_fields(positive_tweets)
    negative_fields = extract_fields(negative_tweets)

    response = {
        "name": username,
        "tweets": tweets,
        "children": [
            {
                "name": "Positive",
                "value": len(positive_tweets),
                "data": [
                    {"Hashtags": positive_fields['hashtags']},
                    {"Mentions": positive_fields['mentions']},
                    {"Topics": positive_fields['topics']},
                ],
                "children": [
                    {"name": "Hashtags", "value": len(positive_fields['hashtags'])},
                    {"name": "Mentions", "value": len(positive_fields['mentions'])},
                    {"name": "Topics", "value": len(positive_fields['topics'])},
                ],
            },
            {
                "name": "Negative",
                "value": len(negative_tweets),
                "data": [
                    {"Hashtags": negative_fields['hashtags']},
                    {"Mentions": negative_fields['mentions']},
                    {"Topics": negative_fields['topics']},
                ],
                "children": [
                    {"name": "Hashtags", "value": len(negative_fields['hashtags'])},
                    {"name": "Mentions", "value": len(negative_fields['mentions'])},
                    {"name": "Topics", "value": len(negative_fields['topics'])},
                ],
            },
        ],
    }
    return response


if __name__ == '__main__':
    app.run(debug=True)
