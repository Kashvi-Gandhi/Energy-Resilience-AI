from pydantic import BaseModel, Field
from typing import List, Optional

class ScoutAssessment(BaseModel):
    threat_summary: str = Field(description="2-3 sentence executive threat summary based on live intelligence.")
    risk_score: int = Field(ge=0, le=100, description="Calculated threat severity score from 0 to 100.")
    affected_corridors: List[str] = Field(description="List of impacted maritime chokepoints or transit routes.")
    confidence_level: str = Field(description="Confidence rating: LOW, MEDIUM, HIGH, or CRITICAL.")

class LogisticsReroutePlan(BaseModel):
    action_required: bool = Field(description="True if risk score > 70 and mitigation is required.")
    primary_bypass_route: str = Field(description="Alternative maritime transit route (e.g., Cape of Good Hope).")
    estimated_delay_days: int = Field(description="Additional transit days required by rerouting.")
    spr_drawdown_mbpd: float = Field(description="Strategic Petroleum Reserve drawdown rate in Million Barrels Per Day.")
    recommended_spr_locations: List[str] = Field(description="Target SPR facilities (e.g., Visakhapatnam, Mangaluru, Padur).")
    dossier_markdown: str = Field(description="Formatted Executive Intelligence Dossier for leadership.")