import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Absolute/Relative imports depending on execution context
# Make sure app/database.py and app/agents.py exist in your folder structure
from app.database import query_vector_news 
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