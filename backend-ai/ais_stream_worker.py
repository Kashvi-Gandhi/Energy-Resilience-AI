import asyncio
import json
import logging
import os
from dotenv import load_dotenv
from supabase import Client, create_client
import websockets

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)
load_dotenv()

AISSTREAM_API_KEY = os.getenv("AISSTREAM_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not all([AISSTREAM_API_KEY, SUPABASE_URL, SUPABASE_KEY]):
  raise ValueError("Missing AISSTREAM_API_KEY or Supabase credentials in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


async def connect_ais_stream():
  # Connect to aisstream.io WebSocket endpoint
  async with websockets.connect(
      "wss://stream.aisstream.io/v0/stream"
  ) as websocket:
    # Subscribe to bounding box around Strait of Hormuz
    subscribe_message = {
        "APIKey": AISSTREAM_API_KEY,
        "BoundingBoxes": [
            [[27.5, 55.0], [25.0, 57.5]]  # [NW Corner, SE Corner]
        ],
        "FilterMessageTypes": ["PositionReport"],
    }

    await websocket.send(json.dumps(subscribe_message))
    logging.info("Connected to Aisstream.io. Listening for live tankers...")

    async for message in websocket:
      try:
        data = json.loads(message)
        if "MetaData" in data and "Message" in data:
          metadata = data["MetaData"]
          position = data["Message"]["PositionReport"]

          mmsi = metadata.get("MMSI")
          ship_name = metadata.get("ShipName", "Unknown Vessel").strip()
          latitude = position.get("Latitude")
          longitude = position.get("Longitude")

          # Upsert live vessel position into Supabase
          vessel_data = {
              "mmsi": str(mmsi),
              "vessel_name": ship_name,
              "current_lat": latitude,
              "current_lng": longitude,
              "last_updated": metadata.get("time_utc"),
          }

          supabase.table("vessels").upsert(
              vessel_data, on_conflict="mmsi"
          ).execute()
          logging.info(
              f"Updated Vessel {ship_name} ({mmsi}) at [{latitude},"
              f" {longitude}]"
          )

      except Exception as e:
        logging.error(f"Error processing AIS packet: {e}")


if __name__ == "__main__":
  try:
    asyncio.run(connect_ais_stream())
  except KeyboardInterrupt:
    logging.info("AIS Ingestion Worker stopped.")