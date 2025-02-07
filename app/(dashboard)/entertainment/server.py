from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# 🎭 Predefined emotion weights for different genres
emotion_weights = {
    "happy-pop": 8, "sad-blues": -6, "relaxing-lofi": 7, "energetic-rock": 9, "melancholy-classical": -4,
    "thriller": 6, "romance": 8, "comedy": 9, "horror": -5, "drama": -2, "sci-fi": 5,
    "fps": 7, "rpg": 6, "puzzle": 5, "strategy": 4, "sports": 8
}

# 🎯 Function to calculate emotional impact score
def calculate_impact(preferences):
    total_score = sum(emotion_weights.get(pref["genre"], 0) for pref in preferences)
    count = len(preferences)
    return total_score / count if count > 0 else 0

# 🎭 Generate emotional impact report
def generate_report(score):
    if score > 7: return "🎉 You prefer uplifting and energetic entertainment!"
    if score > 4: return "😊 Your preferences lean toward feel-good content."
    if score > 0: return "😌 You enjoy balanced emotions in entertainment."
    return "😢 Your choices suggest a preference for deeper or melancholic themes."

# 🌐 API Endpoint
@app.route("/analyze-preferences", methods=["POST"])
def analyze_preferences():
    data = request.get_json()
    preferences = data.get("preferences", [])
    impact_score = calculate_impact(preferences)
    report = generate_report(impact_score)

    return jsonify({"impactScore": impact_score, "report": report})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
