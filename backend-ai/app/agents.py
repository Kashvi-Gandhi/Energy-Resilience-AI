import os
import json
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()

ai_client = genai.Client(api_key=GEMINI_API_KEY)

API_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def run_scout_agent(intel_context: list, user_scenario: str = "") -> dict:
    """Agent 1: Evaluates geopolitical reports against the user's active scenario with strict system boundaries."""
    
    if not intel_context or intel_context[0].get("similarity", 0) < 0.50:
        print("🛡️ [Safety Lock Triggered]: No relevant crisis records match this query context.")
        return {
            "risk_score": 5,
            "primary_threat": "Operational sectors reporting normal parameters. No verified hostile matching anomalies detected.",
            "target_route_id": None
        }
        
    top_match = intel_context[0]
    print(f"🔥 Found context match! Title: '{top_match.get('title')}' (Score: {top_match.get('similarity'):.3f})")
    
    context_text = f"Source: {top_match['source']}\nContent: {top_match['content']}"
    
    # 🚨 SYSTEM INSTRUCTION SHIELD: Forces Gemini to prioritize your exact instruction over the context data
    system_rules = """
    You are an automated Maritime Risk Score Processor. Your sole job is to evaluate the severity of the ACTUAL USER SCENARIO provided.
    
    You will be given HISTORICAL INTEL CONTEXT purely to map out the region and target route data. 
    DO NOT score the severity of the text in the HISTORICAL INTEL CONTEXT. Score only the ACTUAL USER SCENARIO.
    
    CRITICAL SCORING MATRIX rules:
    1. If the user scenario mentions routine weather conditions, fog, localized seasonal delays, or routine maintenance: You MUST return a risk_score between 20 and 25.
    2. If the user scenario mentions military drills, naval strikes, blocks, or non-destructive delays: Return a score between 40 and 65.
    3. If the user scenario mentions direct missile explosions, severe destructive cyclones, or active kinetic attacks: Return a score between 75 and 100.
    """

    user_payload = f"""
    HISTORICAL INTEL CONTEXT:
    {context_text}
    
    ACTUAL USER SCENARIO TO EVALUATE:
    "{user_scenario}"
    """
    
    try:
        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_payload,
            config=types.GenerateContentConfig(
                system_instruction=system_rules, # Injected directly into the model's core directive layer
                response_mime_type="application/json",
                response_schema=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "risk_score": types.Schema(type=types.Type.INTEGER, description="Integer calculated strictly from the user scenario based on the scoring matrix."),
                        "primary_threat": types.Schema(type=types.Type.STRING, description="Brief explanation of why the user scenario got this exact score.")
                    },
                    required=["risk_score", "primary_threat"]
                )
            )
        )
        
        parsed_json = json.loads(response.text.strip())
        parsed_json["target_route_id"] = top_match.get("associated_route_id")
        return parsed_json
        
    except Exception as e:
        print(f"❌ Scout Agent Generation Failure: {e}")
        return {"risk_score": 5, "primary_threat": "Operational baseline quiet.", "target_route_id": None}


def run_logistics_agent(scout_analysis: dict) -> dict:
    """Agent 2: Modifies physical route plans if threat boundaries are breached."""
    risk_score = scout_analysis.get("risk_score", 0)
    route_id = scout_analysis.get("target_route_id")
    
    action_plan = {
        "reroute_triggered": False,
        "affected_vessels": [],
        "strategic_recommendation": "Current operational profiles remain within safe parameters. No deviations required."
    }
    
    if risk_score >= 70 and route_id:
        vessels_endpoint = f"{SUPABASE_URL}/rest/v1/vessels?current_route_id=eq.{route_id}"
        try:
            resp = requests.get(vessels_endpoint, headers=API_HEADERS)
            vessels = resp.json() if resp.status_code == 200 else []
        except Exception:
            vessels = []
            
        affected_names = [v["name"] for v in vessels]
        
        prompt = f"""
        You are a Supply Chain Optimization Expert (The Logistics Architect Agent).
        A major shipping crisis has breached parameters.
        
        CRISIS SUMMARY:
        - Risk Level: {risk_score}/100
        - Threat Profile: {scout_analysis.get('primary_threat')}
        - Fleet Target Units: {', '.join(affected_names) if affected_names else "En Route Tankers"}
        
        Generate an Emergency Strategic Response Advisory for the Indian Ministry of Petroleum.
        State that the active routes coordinates must be altered immediately, adding exactly 10 days to the journey duration.
        Provide a text summary explaining the disruption and fallback destination ports.
        """
        
        try:
            ai_resp = ai_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            recommendation = ai_resp.text.strip()
        except Exception as e:
            recommendation = f"Alternative transit layout required immediately. Journey time increased by +10 days."
            
        action_plan = {
            "reroute_triggered": True,
            "affected_vessels": affected_names,
            "strategic_recommendation": recommendation
        }
        
    return action_plan