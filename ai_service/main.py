from fastapi import FastAPI
from .routers import analysis

app = FastAPI(
    title="Wine Label AI Service",
    description="An API to analyze wine label images using a local LLaVA model via Ollama.",
    version="0.1.0",
)

app.include_router(analysis.router)

@app.get("/")
def read_root():
    """
    Root endpoint for health checks.
    """
    return {"message": "AI Service is running"}
