from pydantic import BaseModel, Field
from typing import List, Optional

class OakAging(BaseModel):
    oakType: Optional[str] = None
    durationMonths: Optional[int] = None

class WineData(BaseModel):
    name: Optional[str] = Field(None, description="The name of the wine.")
    year: Optional[int] = Field(None, description="The vintage year of the wine.")
    winery: Optional[str] = Field(None, description="The winery that produced the wine.")
    region: Optional[str] = Field(None, description="The region where the wine is from.")
    grapeVariety: Optional[str] = Field(None, description="The grape variety or blend.")
    aroma: Optional[List[str]] = Field(None, description="A list of aroma descriptors.")
    taste: Optional[List[str]] = Field(None, description="A list of taste descriptors.")
    oakAging: Optional[OakAging] = None
    foodPairing: Optional[List[str]] = Field(None, description="A list of food pairing suggestions.")
    alcoholPercentage: Optional[float] = Field(None, description="The alcohol percentage of the wine.")
    description: Optional[str] = Field(None, description="A general description of the wine.")
    price: Optional[float] = None
