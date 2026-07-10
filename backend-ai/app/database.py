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

# PostgREST API Request Headers (used for direct REST calls e.g. vector RPC)
API_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# Initialize the official Supabase Client (single authoritative initialization)
# main.py imports this: "from app.database import supabase"
supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase Client initialized successfully in database.py")
    except ImportError:
        print("⚠️ supabase-py not installed. Install it with: pip install supabase")
        supabase = None
    except Exception as e:
        print(f"⚠️ Failed to initialize Supabase Client: {e}")
        supabase = None


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
    to retrieve the most semantically relevant geopolitical intel documents.

    Uses direct REST (requests library) instead of the supabase-py client
    because pgvector RPC calls work more reliably through raw PostgREST.
    """
    embedding = get_gemini_embedding(query_text)
    if not embedding:
        return []

    # RPC payload structure matching our match_news SQL function signature
    payload = {
        "query_embedding": embedding,
        "match_threshold": match_threshold,
        "match_count": match_count
    }

    # Supabase RPC endpoints: {URL}/rest/v1/rpc/{function_name}
    rpc_endpoint = f"{SUPABASE_URL}/rest/v1/rpc/match_news"

    try:
        response = requests.post(
            rpc_endpoint,
            json=payload,
            headers=API_HEADERS,
            timeout=30
        )
        response.raise_for_status()
        results = response.json()
        print(f"✅ Vector search returned {len(results)} matching documents")
        return results if isinstance(results, list) else []
    except requests.exceptions.RequestException as e:
        print(f"❌ Vector RPC request failure: {e}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error in query_vector_news: {e}")
        return []
