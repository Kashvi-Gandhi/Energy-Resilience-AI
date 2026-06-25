import os
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# Normalize environment configurations
raw_url = os.getenv("SUPABASE_URL")
SUPABASE_URL = raw_url.strip().rstrip("/") if raw_url else None
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Initialize Gemini Client
ai_client = genai.Client(api_key=GEMINI_API_KEY)

# PostgREST API Request Headers
API_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def get_gemini_embedding(text: str):
    """Generates a 768-dimension vector embedding using Gemini."""
    try:
        response = ai_client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"❌ Gemini Embedding Generation Error: {e}")
        return None

def query_vector_news(query_text: str, match_threshold: float = 0.4, match_count: int = 2):
    """
    Calls the Supabase RPC match_news function via direct HTTP POST request 
    to retrieve the most relevant geopolitical intel.
    """
    embedding = get_gemini_embedding(query_text)
    if not embedding:
        return []

    # RPC payload structure matching our match_news SQL signature
    payload = {
        "query_embedding": embedding,
        "match_threshold": match_threshold,
        "match_count": match_count
    }

    # Supabase RPC endpoints are structured as: {URL}/rest/v1/rpc/{function_name}
    rpc_endpoint = f"{SUPABASE_URL}/rest/v1/rpc/match_news"
    
    try:
        response = requests.post(rpc_endpoint, headers=API_HEADERS, json=payload)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Vector search failed: ({response.status_code}) - {response.text}")
            return []
    except Exception as e:
        print(f"❌ Network issue during vector search: {e}")
        return []