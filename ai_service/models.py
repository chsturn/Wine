from pydantic import BaseModel, Field
from typing import List, Optional

class OakAging(BaseModel):
    oakType: Optional[str] = None
    durationMonths: Optional[int] = None

class WineData(BaseModel):
    name: str = Field(..., description="The name of the wine.")
    year: int = Field(..., description="The vintage year of the wine.")
    winery: str = Field(..., description="The winery that produced the wine.")
    region: str = Field(..., description="The region where the wine is from.")
    grapeVariety: str = Field(..., description="The grape variety or blend.")
    aroma: List[str] = Field(..., description="A list of aroma descriptors.")
    taste: List[str] = Field(..., description="A list of taste descriptors.")
    oakAging: Optional[OakAging] = None
    foodPairing: List[str] = Field(..., description="A list of food pairing suggestions.")
    alcoholPercentage: float = Field(..., description="The alcohol percentage of the wine.")
    description: str = Field(..., description="A general description of the wine.")
    price: Optional[float] = None
