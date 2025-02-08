from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

# Load fine-tuned RoBERTa for emotion detection
model_name = "SamLowe/roberta-base-go_emotions"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Define emotion labels from GoEmotions dataset
emotion_labels = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion",
    "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment",
    "excitement", "fear", "gratitude", "grief", "joy", "love", "neutral",
    "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise"
]

# Map detailed emotions to core categories
emotion_mapping = {
    "joy": "happy", "amusement": "happy", "excitement": "happy", "love": "happy", "optimism": "happy",
    "admiration": "happy", "approval": "happy", "gratitude": "happy", "pride": "happy",
    "sadness": "sad", "grief": "sad", "disappointment": "sad", "embarrassment": "sad",
    "remorse": "sad", "desire": "sad", "disgust": "sad",
    "fear": "anxious", "neutral": "anxious", "surprise": "anxious", "confusion": "anxious", "curiosity": "anxious",
    "anger": "depressed", "annoyance": "depressed", "disapproval": "depressed", "realization": "sad"
}

def analyze_sentiment(content):
    """
    Analyze emotions for a given text content.

    Args:
        content (str): The input text.

    Returns:
        dict: Emotion probabilities and overall mood.
    """
    if not content.strip():
        return {"error": "Empty input received."}

    # Initialize emotion scores
    emotion_scores = {"happy": 0, "sad": 0, "anxious": 0, "depressed": 0}

    # Merge multi-line text into a single cleaned string
    processed_text = content.replace("\n", " ").strip()

    # Tokenize input
    inputs = tokenizer(processed_text, return_tensors="pt", padding=True, truncation=True, max_length=512)

    # Get model predictions
    with torch.no_grad():
        outputs = model(**inputs)

    # Convert logits to probabilities
    probs = F.softmax(outputs.logits, dim=-1)

    # Ensure valid probabilities
    if probs.numel() == 0:
        return {"error": "No emotion probabilities found."}

    # Get the number of emotions available
    num_emotions = min(3, probs.shape[1])  # Ensure we don't exceed available emotions
    if num_emotions == 0:
        return {"error": "No valid emotions detected."}

    # Get top predicted emotions safely
    top_emotions = torch.topk(probs, num_emotions)

    # Map detected emotions to core categories
    for idx in range(num_emotions):
        emotion_idx = top_emotions.indices[0][idx].item()
        
        # Ensure the index is within bounds
        if emotion_idx >= len(emotion_labels):
            continue  # Skip if index is out of range

        emotion = emotion_labels[emotion_idx]
        probability = top_emotions.values[0][idx].item()
        
        core_emotion = emotion_mapping.get(emotion, "other")
        if core_emotion in emotion_scores:
            emotion_scores[core_emotion] += probability

    # Determine overall mood
    overall_mood = max(emotion_scores, key=emotion_scores.get)

    # Prepare the result
    result = {
        "content": content,
        "emotion_scores": emotion_scores,
        "overall_mood": overall_mood.upper()
    }

    return result
