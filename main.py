from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get API Key from .env
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing. Please check your .env file.")

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Configure Gemini API
genai.configure(api_key=API_KEY)

@app.route("/generate-blog", methods=["POST"])
def generate_blog():
    try:
        data = request.get_json()
        topic = data.get("topic", "").strip()
        keywords = data.get("keywords", [])

        if not topic:
            return jsonify({"error": "❌ Topic is required"}), 400

        # Initialize Gemini Model
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Write a blog on '{topic}' using the keywords: {', '.join(keywords)}."
        response = model.generate_content(prompt)

        if hasattr(response, "text") and response.text:
            return jsonify({"blog": response.text})
        else:
            return jsonify({"error": "❌ Failed to generate blog"}), 500

    except Exception as e:
        return jsonify({"error": f"❌ {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
