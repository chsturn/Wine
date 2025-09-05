from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Pydantic Models for Data Structure ---

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


app = FastAPI(
    title="Wine Label AI Service",
    description="An API to analyze wine label images using a local LLaVA model via Ollama.",
    version="0.1.0",
)

@app.get("/")
def read_root():
    """
    Root endpoint for health checks.
    """
    return {"message": "AI Service is running"}

# The /analyze-label endpoint will be added in a later step.

import base64
import httpx
from fastapi import UploadFile, File, HTTPException

@app.post("/analyze-label", response_model=WineData)
async def analyze_label(file: UploadFile = File(...)):
    """
    Accepts an image of a wine label, sends it to Ollama with LLaVA for analysis,
    and returns the extracted wine data as JSON.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    # --- Ollama Communication ---

    # Define the prompt for the LLaVA model
    prompt = """
    Analyze the provided image of a wine label and extract its details.
    Respond with ONLY a single, valid JSON object that conforms to the following structure.
    Do not include any introductory text, explanations, or code formatting like ```json.

    The JSON object must contain these keys: "name", "year", "winery", "region", "grapeVariety", "aroma", "taste", "oakAging", "foodPairing", "alcoholPercentage", "description", "price".

    - "aroma", "taste", and "foodPairing" must be arrays of strings.
    - "oakAging" must be an object with "oakType" (string) and "durationMonths" (integer).
    - If a value cannot be determined from the label, set its value to null.
    """

    payload = {
        "model": "llava",
        "prompt": prompt,
        "images": [base64_image],
        "stream": False,  # Get the full response at once
        "format": "json" # Request JSON output
    }

    OLLAMA_API_URL = "http://localhost:11434/api/generate"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)

        # The response from Ollama with format=json is already a JSON object
        return response.json()

    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Could not connect to Ollama service: {e}")
    except Exception as e:
        # Catch other potential errors, e.g., from the response parsing
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
