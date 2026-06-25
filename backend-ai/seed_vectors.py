import os
import re
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load credentials from .env
load_dotenv()

# Clean and format the Supabase base URL string
raw_url = os.getenv("SUPABASE_URL")
if not raw_url:
    raise ValueError("❌ ERROR: SUPABASE_URL is missing from your .env file!")

SUPABASE_URL = raw_url.strip().rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

print(f"🔗 Direct API Mode connected to: {SUPABASE_URL}")

# Initialize the Gemini Client
ai_client = genai.Client(api_key=GEMINI_API_KEY)

# Define standard PostgREST headers required by Supabase API proxy
API_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def parse_intelligence_briefs(file_path):
    """Parses the text corpus file into structured dictionary objects."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ Missing briefs corpus file at: {file_path}")
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    entries = content.split("--- ENTRY")
    parsed_articles = []
    
    for entry in entries:
        if not entry.strip():
            continue
            
        title_match = re.search(r"Title:\s*(.*)", entry)
        source_match = re.search(r"Source:\s*(.*)", entry)
        route_match = re.search(r"Route:\s*(.*)", entry)
        content_split = entry.split("Content:")
        
        if title_match and source_match and route_match and len(content_split) > 1:
            parsed_articles.append({
                "title": title_match.group(1).strip(),
                "source": source_match.group(1).strip(),
                "route_name": route_match.group(1).strip(),
                "content": content_split[1].strip()
            })
            
    return parsed_articles

def seed_vector_database():
    briefs_path = os.path.join("mock_data", "intelligence_briefs.txt")
    articles = parse_intelligence_briefs(briefs_path)
    print(f"📖 Found {len(articles)} articles to process.\n")
    
    for idx, article in enumerate(articles, 1):
        print(f"🧠 [Article {idx}/5] Generating Gemini Vector Embedding: '{article['title']}'...")
        
        try:
            # Generate 768-dimension vector using Google Gemini
            response = ai_client.models.embed_content(
                model="gemini-embedding-001",
                contents=article["content"],
                config=types.EmbedContentConfig(output_dimensionality=768)
            )
            embedding = response.embeddings[0].values
        except Exception as e:
            print(f"   ❌ Gemini embedding generation failed: {e}")
            continue

        # Build direct PostgREST URL pathing manually to completely avoid PGRST125 router errors
        route_endpoint = f"{SUPABASE_URL}/rest/v1/supply_routes?route_name=eq.{requests.utils.quote(article['route_name'])}&select=id"
        
        route_id = None
        try:
            route_resp = requests.get(route_endpoint, headers=API_HEADERS)
            if route_resp.status_code == 200 and route_resp.json():
                route_id = route_resp.json()[0]["id"]
                print(f"   🔗 Linked directly to Supply Route ID: {route_id}")
            else:
                print(f"   ⚠️ Route lookup empty or returned code {route_resp.status_code}. Seeding article without explicit foreign link.")
        except Exception as e:
            print(f"   ⚠️ Network issue on lookup: {e}")

        # Assemble record payload
        payload = {
            "title": article["title"],
            "source": article["source"],
            "content": article["content"],
            "associated_route_id": route_id,
            "embedding": embedding
        }

        # Issue direct HTTP POST insert request to the database
        news_endpoint = f"{SUPABASE_URL}/rest/v1/geopolitical_news"
        try:
            upload_resp = requests.post(news_endpoint, headers=API_HEADERS, json=payload)
            if upload_resp.status_code in [200, 201]:
                print(f"   ✅ Successfully seeded Article {idx} directly into Supabase!")
            else:
                print(f"   ❌ Database rejected insertion: ({upload_resp.status_code}) - {upload_resp.text}")
        except Exception as e:
            print(f"   ❌ Failed to send payload over network: {e}")
            
    print("\n🎉 Seeding execution complete! Confirm the contents in your Supabase Table Editor.")

if __name__ == "__main__":
    seed_vector_database()