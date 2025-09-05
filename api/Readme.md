# Wine App API

This directory contains the Node.js Express backend for the Wine App.

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB (a running instance)

### Installation & Setup

1.  **Install dependencies:**
    ```sh
    npm install
    ```

2.  **Configure Environment Variables:**
    -   Copy the example environment file:
        ```sh
        cp .env.example .env
        ```
    -   Open the newly created `.env` file and add your specific configuration (e.g., your MongoDB connection string and a unique JWT secret).

3.  **Running the server:**
    -   To run the server once:
        ```sh
        npm start
        ```
    -   To run the server in development mode with automatic restarts on file changes (using `nodemon`):
        ```sh
        npm run watch
        ```

The API will be running at `http://localhost:3000` by default.
