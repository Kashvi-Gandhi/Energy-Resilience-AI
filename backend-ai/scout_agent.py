import os
from google import genai
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

ai_client = genai.Client(api_key=GEMINI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def retrieve_live_context(user_query: str, match_count: int = 3) -> str:
    """Fetch real-time threat signals matching the scenario using vector search."""
    # 1. Embed user scenario query
    response = ai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=user_query,
        config={"output_dimensionality": 768}
    )
    query_vector = response.embeddings[0].values

    # 2. Match vectors in Supabase
    rpc_response = supabase.rpc(
        "match_threat_signals",
        {
            "query_embedding": query_vector,
            "match_threshold": 0.3,
            "match_count": match_count
        }
    ).execute()

    matched_events = rpc_response.data
    if not matched_events:
        return "No recent real-time threat signals matched this query."

    # 3. Format into structured context for Gemini
    context_str = "REAL-TIME THREAT INTEL (INGESTED LIVE):\n"
    for item in matched_events:
        context_str += f"- [{item['title']}] (Similarity: {item['similarity']:.2f}): {item['summary']}\n"

    return context_str