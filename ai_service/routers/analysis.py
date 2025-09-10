import base64
import json
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..models import WineData

router = APIRouter()

@router.post("/analyze-label", response_model=WineData)
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

    prompt = """
    Analyze the provided image of a wine label and extract its details.
    Respond with ONLY a single, valid JSON object that conforms to the following structure.
    Do not include any introductory text, explanations, or code formatting like ```json.

    The JSON object must contain these keys: "name", "year", "winery", "region", "grapeVariety", "aroma", "taste", "oakAging", "foodPairing", "alcoholPercentage", "description", "price".

    - "aroma", "taste", and "foodPairing" must be arrays of strings.
    - "oakAging" must be an object with "oakType" (string) and "durationMonths" (integer).
    - description must be a concise summary of the wine's characteristics.
    - If a value cannot be determined from the label, set its value to null.
    """

    payload = {
        "model": "llava:34b",
        "prompt": prompt,
        "images": [base64_image],
        "stream": False,
        "format": "json",
        "temperature": 0.3,
    }

    OLLAMA_API_URL = "http://localhost:11434/api/generate"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status()
            response_data = response.json().get("response", {})

        return json.loads(response_data)

    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Could not connect to Ollama service: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
