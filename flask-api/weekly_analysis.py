from flask import Flask, request, jsonify
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import traceback

# Load fine-tuned RoBERTa for emotion detection
model_name = "SamLowe/roberta-base-go_emotions"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Define emotion labels from GoEmotions dataset
emotion_labels = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion",
    "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment",
    "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness",
    "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise", "neutral"
]

# Map detailed emotions to core categories
emotion_mapping = {
    "joy": "happy", "amusement": "happy", "excitement": "happy", "love": "happy", "optimism": "happy",
    "sadness": "sad", "grief": "sad", "disappointment": "sad",
    "fear": "anxious", "nervousness": "anxious",
    "anger": "depressed", "remorse": "depressed", "disapproval": "depressed", "neutral": "happy"
}

def weekly_sentiment_analysis(journal_entries):
    # Initialize overall emotion scores
    overall_emotions = {"happy": 0, "sad": 0, "anxious": 0, "depressed": 0}

    # Process each day's journal entry
    for day, entry in journal_entries.items():
        # Merge multi-line text into a single cleaned string
        processed_text = entry.replace("\n", " ").strip()

        # Tokenize input
        inputs = tokenizer(processed_text, return_tensors="pt", padding=True, truncation=True, max_length=512)

        # Get model predictions
        with torch.no_grad():
            outputs = model(**inputs)

        # Convert logits to probabilities
        probs = F.softmax(outputs.logits, dim=-1)

        # Get top predicted emotions
        top_emotions = torch.topk(probs, 3)  # Get top 3 emotions per day
        # Map detected emotions to core categories
        for idx in range(len(top_emotions.indices[0])):
            try:
                emotion_index = top_emotions.indices[0][idx].item()
                if 0 <= emotion_index < len(emotion_labels):
                    emotion = emotion_labels[emotion_index]
                    probability = top_emotions.values[0][idx].item()
                    core_emotion = emotion_mapping.get(emotion, "other")
                    if core_emotion in overall_emotions:
                        overall_emotions[core_emotion] += probability
                else:
                    print(f"Invalid emotion index: {emotion_index}")
            except Exception as e:
                print(e)
                print(traceback.format_exc())

    # Determine overall mood
    overall_mood = max(overall_emotions, key=overall_emotions.get)
    return (overall_mood, overall_emotions)