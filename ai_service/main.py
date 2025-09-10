from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import analysis

app = FastAPI(
    title="Wine Label AI Service",
    description="An API to analyze wine label images using a local LLaVA model via Ollama.",
    version="0.1.0",
)

# CORS Middleware
origins = [
    "http://localhost:4200", # Angular frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)

@app.get("/")
def read_root():
    """
    Root endpoint for health checks.
    """
    return {"message": "AI Service is running"}
