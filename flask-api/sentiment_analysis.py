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
    "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness",
    "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise"
]

# Map detailed emotions to core categories
emotion_mapping = {
    "joy": "happy", "amusement": "happy", "excitement": "happy", "love": "happy", "optimism": "happy",
    "sadness": "sad", "grief": "sad", "disappointment": "sad",
    "fear": "anxious", "nervousness": "anxious",
    "anger": "depressed", "remorse": "depressed", "disapproval": "depressed"
}

def analyze_sentiment(content):
    """
    Analyze emotions for a given sentence or content.
    
    Args:
        content (str): The input text to analyze.
    
    Returns:
        dict: A dictionary containing detected emotions and their probabilities.
    """
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
    
    # Get top predicted emotions
    top_emotions = torch.topk(probs, 3)  # Get top 3 emotions
    
    # Map detected emotions to core categories
    for idx in range(len(top_emotions.indices[0])):
        emotion = emotion_labels[top_emotions.indices[0][idx].item()]
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