import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Import our RAG retrieval helper and schema
from test_rag import retrieve_live_context
from schemas import ScoutAssessment

# Load environment
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ai_client = genai.Client(api_key=GEMINI_API_KEY)

def run_structured_test():
    scenario = "Naval blockade in Strait of Hormuz with drone strikes on crude tankers"
    
    print("1. Fetching live threat context from Supabase...")
    intel = retrieve_live_context(scenario)

    prompt = f"""
You are the Geopolitical Scout Agent for ResilientIndia AI.
Evaluate the following crisis scenario using the provided real-time threat intelligence.

SCENARIO: {scenario}

{intel}
"""

    print("2. Sending request to Gemini with Pydantic Schema enforcement...")
    response = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ScoutAssessment,
        ),
    )

    # Convert JSON text directly into validated Python object
    parsed_output = ScoutAssessment.model_validate_json(response.text)

    print("\n--- [SUCCESS: VALIDATED PYDANTIC OBJECT] ---")
    print(f"Risk Score: {parsed_output.risk_score}")
    print(f"Confidence Level: {parsed_output.confidence_level}")
    print(f"Affected Corridors: {parsed_output.affected_corridors}")
    print(f"Executive Summary: {parsed_output.threat_summary}")

if __name__ == "__main__":
    run_structured_test()