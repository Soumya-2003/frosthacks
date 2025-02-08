import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import traceback
from datetime import datetime

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
    "joy": "Happiness", "amusement": "Happiness", "excitement": "Excitement", "love": "Happiness", "optimism": "Happiness",
    "sadness": "Sadness", "grief": "Sadness", "disappointment": "Sadness",
    "fear": "Fear", "nervousness": "Fear",
    "anger": "Anger", "remorse": "Anger", "disapproval": "Disgust", "neutral": "Boredom",
    "surprise": "Surprise", "disgust": "Disgust"
}

# Define colors for each emotion
emotion_colors = {
    "Happiness": "#FFD700", "Sadness": "#87CEEB", "Anger": "#FF4500", "Fear": "#9370DB",
    "Surprise": "#98FB98", "Disgust": "#8A2BE2", "Excitement": "#32CD32", "Boredom": "#FFA07A"
}

def analyze_emotions(journal_entries):
    # Initialize daily emotion scores
    daily_emotions = {day: {emotion: 0 for emotion in emotion_mapping.values()} for day in journal_entries.keys()}

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
        top_emotions = torch.topk(probs, 3)  # Get top 3 emotions per
        
        # Map detected emotions to core categories
        for idx in range(len(top_emotions.indices[0])):
            try:
                emotion_index = top_emotions.indices[0][idx].item()
                if 0 <= emotion_index < len(emotion_labels):
                    emotion = emotion_labels[emotion_index]
                    probability = top_emotions.values[0][idx].item()
                    core_emotion = emotion_mapping.get(emotion, "Boredom")
                    if core_emotion in daily_emotions[day]:
                        daily_emotions[day][core_emotion] += probability
                else:
                    print(f"Invalid emotion index: {emotion_index}")
            except Exception as e:
                print(e)
                print(traceback.format_exc())

    return daily_emotions

def generate_weekly_report(journal_entries, weekly_assessment):
    daily_emotions = analyze_emotions(journal_entries)

    # Create a weekly report
    weekly_report = {
        "success": True,
        "data": []
    }

    for day, emotions in daily_emotions.items():
        # Skip days with no data
        if not any(emotions.values()):
            continue

        traits = []
        index = 0.1
        for emotion, value in emotions.items():
            traits.append({
                "value": int(value * 100),  # Scale to percentage
                "label": emotion,
                "fill": emotion_colors[emotion],
                "index": index
            })
            index += 0.1
        # Sort traits by label to ensure consistent order
        traits.sort(key=lambda x: x['label'])
        weekly_report["data"].append({"day": day, "traits": traits})

    # Optionally, add overall assessment data to the report
    # if weekly_assessment:
    #     overall_emotions = weekly_assessment.get("overall_emotions", {})
    #     overall_mood = weekly_assessment.get("overall_mood", "Unknown")
    #     weekly_report["overall_assessment"] = {
    #         "overall_emotions": overall_emotions,
    #         "overall_mood": overall_mood
    #     }

    return weekly_report