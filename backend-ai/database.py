import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_simulation_run(
    scenario_title: str,
    scout_data: dict,
    logistics_data: dict,
    dossier_markdown: str
) -> dict:
    """Inserts a completed simulation run into the simulation_runs database table."""
    record = {
        "scenario_title": scenario_title,
        "risk_score": scout_data.get("risk_score"),
        "confidence_level": scout_data.get("confidence_level"),
        "affected_corridors": scout_data.get("affected_corridors", []),
        "action_required": logistics_data.get("action_required", False),
        "primary_bypass_route": logistics_data.get("primary_bypass_route"),
        "estimated_delay_days": logistics_data.get("estimated_delay_days", 0),
        "spr_drawdown_mbpd": logistics_data.get("spr_drawdown_mbpd", 0.0),
        "scout_analysis": scout_data.get("threat_summary"),
        "logistics_plan": logistics_data.get("mitigation_strategy"),
        "dossier_markdown": dossier_markdown,
        "status": "COMPLETED"
    }
    
    response = supabase.table("simulation_runs").insert(record).execute()
    return response.data[0] if response.data else {}