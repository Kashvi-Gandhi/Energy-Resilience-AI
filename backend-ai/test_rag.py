import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client

# Resolve .env path
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

ai_client = genai.Client(api_key=GEMINI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def retrieve_live_context(user_query: str, match_count: int = 3) -> str:
    # 1. Generate query embedding (768-D)
    response = ai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=user_query,
        config={"output_dimensionality": 768}
    )
    query_vector = response.embeddings[0].values

    # 2. Vector search in Supabase using the RPC function
    rpc_response = supabase.rpc(
        "match_threat_signals",
        {
            "query_embedding": query_vector,
            "match_threshold": 0.2,
            "match_count": match_count
        }
    ).execute()

    matched_events = rpc_response.data
    if not matched_events:
        return "No matching live threat signals found."

    context_str = "REAL-TIME THREAT INTEL (INGESTED LIVE):\n"
    for item in matched_events:
        context_str += f"- [{item['title']}] (Similarity: {item['similarity']:.2f}): {item['summary']}\n"
    return context_str

def run_scout_agent_test(user_scenario: str):
    print(f"\n🔍 Scenario Input: '{user_scenario}'")
    
    # Step A: Retrieve Context from DB
    retrieved_intel = retrieve_live_context(user_scenario)
    print("\n--- [RAG RETRIEVAL TEST] ---")
    print(retrieved_intel)
    
    # Step B: Synthesize with Gemini 2.5 Flash
    prompt = f"""
You are the Geopolitical Scout Agent for ResilientIndia AI.
Evaluate the following crisis scenario using the provided real-time threat intelligence.

SCENARIO: {user_scenario}

{retrieved_intel}

Provide a 2-sentence threat assessment and a calculated Risk Score (0-100).
"""
    response = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    
    print("\n--- [SCOUT AGENT ASSESSMENT] ---")
    print(response.text)

if __name__ == "__main__":
    # Test scenario matching your live ingested data
    run_scout_agent_test("Escalating naval tensions and drone attacks near the Strait of Hormuz affecting oil tankers")