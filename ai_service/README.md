# Wine AI Service

This service is a FastAPI application that provides an API to analyze wine label images using a locally hosted LLaVA model via Ollama.

## Setup and Installation

### Prerequisites

- Python 3.8+
- An Ollama instance running with the `llava` model pulled.
  - You can pull the model with: `ollama pull llava`
  - The Ollama server must be accessible at `http://localhost:11434`.

### Installation

1.  **Create and activate a virtual environment (recommended):**
    ```sh
    python3 -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

## Running the Service

To run the FastAPI server, use `uvicorn`:

```sh
uvicorn main:app --reload
```

The `--reload` flag enables hot-reloading for development, so the server will restart automatically when you make code changes.

The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, interactive API documentation (provided by Swagger UI) is automatically generated and available at:

`http://localhost:8000/docs`

You can use this interface to test the file upload directly from your browser.

### Endpoints

- **`POST /analyze-label`**
  - Accepts a multipart form data request with an image file.
  - **Form Key**: `file`
  - **Value**: The image file of the wine label.
  - **Returns**: A JSON object with the analyzed wine data.
