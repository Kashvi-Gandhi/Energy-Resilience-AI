import os
import time
import logging
from pathlib import Path
from datetime import datetime, timezone
import feedparser
from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# Resolve .env file path
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not all([GEMINI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY]):
    logging.error(f"GEMINI_API_KEY: {'Found' if GEMINI_API_KEY else 'MISSING'}")
    logging.error(f"SUPABASE_URL: {'Found' if SUPABASE_URL else 'MISSING'}")
    logging.error(f"SUPABASE_ANON_KEY: {'Found' if SUPABASE_ANON_KEY else 'MISSING'}")
    raise ValueError(f"Missing critical environment variables in: {env_path}")

# Initialize Clients
ai_client = genai.Client(api_key=GEMINI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# High-Risk Geopolitical Keywords
RISK_KEYWORDS = [
    "strait of hormuz", "bab-el-mandeb", "suez", "tanker", "blockade", 
    "naval", "drone attack", "missile", "crude oil", "maritime risk", "persian gulf"
]

RSS_FEEDS = [
    "https://www.maritime-executive.com/rss",
    "https://gcaptain.com/feed/",
]

def contains_threat_keyword(text: str) -> bool:
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in RISK_KEYWORDS)

def generate_embedding(text: str) -> list[float]:
    """Generates 768-dimensional vector embedding using Gemini API."""
    response = ai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config={
            "output_dimensionality": 768
        }
    )
    return response.embeddings[0].values

def store_threat_event(title: str, summary: str, source_url: str, embedding: list[float]):
    data = {
        "title": title,
        "summary": summary,
        "source_url": source_url,
        "embedding": embedding,
        "ingested_at": datetime.now(timezone.utc).isoformat(),
        "status": "UNPROCESSED"
    }
    supabase.table("threat_signals").upsert(data, on_conflict="source_url").execute()
    logging.info(f"Ingested event: {title[:50]}...")

def process_rss_feeds():
    logging.info("Scanning live intelligence feeds...")
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:10]:
                title = getattr(entry, "title", "")
                summary = getattr(entry, "summary", getattr(entry, "description", ""))
                link = getattr(entry, "link", "")
                
                content_to_scan = f"{title} {summary}"
                if contains_threat_keyword(content_to_scan):
                    logging.warning(f"Threat Signal Detected: {title}")
                    vector = generate_embedding(content_to_scan)
                    store_threat_event(title, summary, link, vector)
        except Exception as e:
            logging.error(f"Error parsing feed {feed_url}: {e}")

def run_worker(interval_seconds: int = 300):
    logging.info(f"Starting ResilientIndia AI Ingestion Worker [Interval: {interval_seconds}s]")
    while True:
        process_rss_feeds()
        logging.info(f"Sleeping for {interval_seconds} seconds...\n")
        time.sleep(interval_seconds)

if __name__ == "__main__":
    run_worker(interval_seconds=300)