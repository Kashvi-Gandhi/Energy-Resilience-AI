import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Absolute/Relative imports depending on execution context
from app.database import query_vector_news 
# 🛠️ HELPER ASSUMPTION: Importing your initialized supabase client from your database file
# If you configure it elsewhere, adjust this import statement to match.
from app.database import supabase 
from app.agents import run_scout_agent, run_logistics_agent

load_dotenv()

app = FastAPI(
    title="Energy Resilience AI Backend Engine",
    description="FastAPI engine handling geopolitical RAG analytics and tanker rerouting simulations.",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing (CORS) for Next.js frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon environment development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schema for structured POST request validation
class CrisisRequest(BaseModel):
    scenario: str = Field(
        ..., 
        description="The real-time crisis scenario text or intelligence report to process.",
        example="Unannounced naval military exercises have closed down two major commercial shipping lanes inside the Strait of Hormuz."
    )

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Energy Resilience AI Core",
        "engine": "Google Gemini Pro/Flash Integration Active"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "database_connected": True}


# --- 🛠️ UPDATED SUPABASE DATA EXTRACTION ENDPOINTS ---

@app.get("/api/vessels")
def get_live_fleet():
    """
    Fetches real-time fleet positions from Supabase, joining 
    associated route risks, origin/destination ports relational profiles.
    """
    try:
        # Executes table joins across your primary and foreign key constraints
        response = supabase.table("vessels").select(
            "id, name, current_lat, current_lon, cargo_type, capacity_barrels, status, updated_at, "
            "supply_routes(route_name, risk_score), "
            "origin:ports!vessels_origin_port_id_fkey(name), "
            "destination:ports!vessels_destination_port_id_fkey(name)"
        ).execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase vessels read failure: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database operational failure: {str(e)}")


@app.get("/api/threats")
def get_active_threat_briefs():
    """
    Fetches real-time hot intelligence incidents from the newly created active_threats ledger.
    """
    try:
        # Added 'description' to the select string to feed the frontend detail window
        response = supabase.table("active_threats").select(
            "id, event_type, severity, region, latitude, longitude, status, description, created_at, "
            "supply_routes(route_name, risk_score)"
        ).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase active_threats read failure: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database operational failure: {str(e)}")
    

@app.get("/api/routes")
def get_supply_corridors():
    """
    Fetches strategic marine transit corridors directly out of Supabase
    """
    try:
        response = supabase.table("supply_routes").select("id, route_name, risk_score, waypoints").execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase supply_routes fetch failure: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database route error: {str(e)}")


@app.get("/api/ports")
def get_operational_ports():
    """
    Fetches terminal transshipment port capacities directly to clear the Unregistered Hub errors
    """
    try:
        response = supabase.table("ports").select(
            "id, name, country, throughput_capacity_mtpa, crude_stream_compatibility, latitude, longitude"
        ).order("name", desc=False).execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase ports fetch failure: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database port node error: {str(e)}")

# --- ------------------------------------------ ---

# Core Day 9 API Endpoint converted to POST to handle complex text data safely
@app.post("/api/simulate-crisis")
def simulate_crisis_event(payload: CrisisRequest):
    scenario = payload.scenario
    print(f"\n⚡ Initiating Full Agent Simulation for: '{scenario}'")
    
    try:
        # 1. Gather context from our vector data store (Match threshold set to 0.3)
        intel_context = query_vector_news(query_text=scenario, match_threshold=0.3, match_count=1)
        
        # 2. Execute Agent 1 (Assessment) - Passing both database context and the user scenario
        scout_assessment = run_scout_agent(intel_context, user_scenario=scenario)
        print(f"📊 Scout Risk Assessment: {scout_assessment.get('risk_score', 5)}/100")
        
        # 3. Execute Agent 2 (Mitigation Planning)
        logistics_plan = run_logistics_agent(scout_assessment)
        print(f"⚓ Logistics Action Triggered: {logistics_plan.get('reroute_triggered', False)}")
        
        # 4. Return combined operational intelligence back to client
        return {
            "status": "success",
            "input_scenario": scenario,
            "scout_assessment": scout_assessment,
            "logistics_mitigation": logistics_plan
        }
        
    except Exception as e:
        print(f"❌ Critical Failure inside simulation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation Pipeline Error: {str(e)}")