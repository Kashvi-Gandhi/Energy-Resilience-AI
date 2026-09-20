from pydantic import BaseModel, Field
from typing import List, Optional

class SimulationRunRecord(BaseModel):
    scenario_title: str
    risk_score: int = Field(ge=0, le=100)
    confidence_level: str
    affected_corridors: List[str]
    action_required: bool
    primary_bypass_route: str
    estimated_delay_days: int
    spr_drawdown_mbpd: float
    scout_analysis: str
    logistics_plan: str
    dossier_markdown: str
    status: str = "COMPLETED"