from pydantic import BaseModel
from typing import List

class Insight(BaseModel):
    id: int
    severity: str        # critical | warning | info
    category: str        # Attendance | Results
    title: str
    detail: str
    affected: int
    section: str
    metric: str

class InsightsResponse(BaseModel):
    insights: List[Insight]
    generated_at: str
