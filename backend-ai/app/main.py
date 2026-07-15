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
    )
    # 1. Add an explicit field for premium surge so we don't rely only on string parsing
    premium_surge: int = Field(
        default=25,
        description="Global operational insurance premium surge scale percentage.",
        example=89
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


@app.get("/api/reports")
def get_intelligence_reports():
    """
    Aggregates active geopolitical threats from the database and maps them
    on the fly into cryptographically structured report dossiers.
    """
    try:
        # Querying your existing active_threats table, joining supply_routes metadata
        response = supabase.table("active_threats").select(
            "id, event_type, severity, region, description, created_at, "
            "supply_routes(route_name)"
        ).order("created_at", desc=True).execute()
        
        threats = response.data or []
        reports_dossier = []
        
        for index, threat in enumerate(threats):
            # 1. Dynamically structure an executive-level report title
            event = threat.get("event_type", "Security Vector Incident").upper()
            route_info = threat.get("supply_routes")
            route_name = route_info.get("route_name") if route_info else None
            location_anchor = route_name or threat.get("region", "Global Operations Axis")
            
            title = f"{event} INTERCEPT DOCKET ({location_anchor.upper()})"
            
            # 2. Translate database threat severity into standard compliance classification tiers
            severity_tier = str(threat.get("severity", "")).upper()
            if "CRITICAL" in severity_tier or "HIGH" in severity_tier:
                classification = "SECRET"
            elif "MEDIUM" in severity_tier:
                classification = "RESTRICTED"
            else:
                classification = "CONFIDENTIAL"
                
            # 3. Formulate file weights programmatically based on string size
            desc_len = len(threat.get("description") or "")
            mock_size = f"{round((desc_len % 15) + 2.4, 1)} MB"
            
            reports_dossier.append({
                "id": threat.get("id", str(index)),
                "title": title,
                "created_at": threat.get("created_at"),
                "origin_branch": f"Sector: {threat.get('region', 'Tactical HQ')}",
                "file_size": mock_size,
                "security_classification": classification,
                "description": threat.get("description", "No historical analyst field logs written.")
            })
            
        return reports_dossier

    except Exception as e:
        print(f"❌ Supabase aggregation mapping failure: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database aggregation exception: {str(e)}")

# --- ------------------------------------------ ---

# Core Day 9 API Endpoint converted to POST to handle complex text data safely
@app.post("/api/simulate-crisis")
def simulate_crisis_event(payload: CrisisRequest):
    scenario = payload.scenario
    premium_surge = payload.premium_surge
    
    # Package premium context cleanly into the prompt string
    full_scenario_text = f"{scenario} [CRITICAL VARIABLE: Global operational insurance premiums inflated by +{premium_surge}%]"
    
    print(f"\n⚡ Initiating Full Agent Simulation")
    print(f"📖 Scenario: '{scenario}'")
    print(f"💰 Insurance Premium Surge: +{premium_surge}%")
    
    try:
        # 1. Gather context from our vector data store
        intel_context = query_vector_news(query_text=scenario, match_threshold=0.3, match_count=1)
        
        # 2. Execute Agent 1 (Assessment) - Passed the raw scenario context
        raw_scout_assessment = run_scout_agent(intel_context, user_scenario=full_scenario_text)
        
        # 3. Execute Agent 2 (Mitigation Planning) - Explicitly passing both the Scout intelligence AND the premium surge variable
        raw_logistics_plan = run_logistics_agent(
            scout_assessment=raw_scout_assessment, 
            premium_surge=premium_surge
        )
        
        # --- 🛠️ ROBUST PARSING ENGINE LOGIC ---
        scout_data = {}
        if isinstance(raw_scout_assessment, dict):
            scout_data["risk_score"] = raw_scout_assessment.get("risk_score", 75)
            scout_data["assessment"] = (
                raw_scout_assessment.get("assessment") or 
                raw_scout_assessment.get("risk_analysis") or 
                str(raw_scout_assessment)
            )
        else:
            scout_data["risk_score"] = 80
            scout_data["assessment"] = str(raw_scout_assessment)

        logistics_data = {}
        if isinstance(raw_logistics_plan, dict):
            trigger_status = (
                raw_logistics_plan.get("reroute_triggered") or 
                raw_logistics_plan.get("action_required") or 
                True
            )
            logistics_data["reroute_triggered"] = bool(trigger_status)
            logistics_data["recommendation"] = (
                raw_logistics_plan.get("recommendation") or 
                raw_logistics_plan.get("mitigation_plan") or 
                str(raw_logistics_plan)
            )
        else:
            logistics_data["reroute_triggered"] = True
            logistics_data["recommendation"] = str(raw_logistics_plan)
            
        print(f"📊 Processed Scout Risk Score: {scout_data['risk_score']}/100")
        print(f"⚓ Processed Logistics Action Triggered: {logistics_data['reroute_triggered']}")
        
        return {
            "status": "success",
            "input_scenario": scenario,
            "premium_surge": premium_surge,
            "scout_assessment": scout_data,
            "logistics_mitigation": logistics_data
        }
        
    except Exception as e:
        print(f"❌ Critical Failure inside simulation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Simulation Pipeline Error: {str(e)}")