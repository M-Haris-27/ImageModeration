Image Moderation API
Overview
This project implements an Image Moderation API using FastAPI to detect and block harmful or unwanted imagery, such as graphic violence, hate symbols, explicit nudity, self-harm depictions, or extremist propaganda. The API is secured with bearer token authentication, uses MongoDB for data storage, and includes a minimal React frontend for interaction. The project is containerized using Docker.
Features

Backend: Built with Python and FastAPI, providing secure REST API endpoints.
Frontend: A minimal React UI for token generation, image upload, and safety report display.
Database: MongoDB with collections for tokens and usage tracking.
Authentication: Bearer token-based authentication with admin-only endpoints.
Containerization: Dockerized backend, frontend, and MongoDB with a docker-compose.yml for easy setup.
Image Processing: Utilizes Google Cloud Vision, OpenCV, and ML libraries (PyTorch, Transformers) for image moderation.

Project Structure

backend/: Contains the FastAPI application.
app/: Main application code.
api/: API endpoints for authentication and moderation.
core/: Configuration, database, and security utilities.
models/: MongoDB data models.


tests/: Unit tests for the API.
main.py: Entry point for the FastAPI app.
requirements.txt: Backend dependencies.


frontend/: React frontend for interacting with the API.
src/: React components, hooks, and utilities.
public/: Static assets.


docker-compose.yml: Orchestrates the backend, frontend, and MongoDB services.
Dockerfile (backend): Dockerfile for the backend.
Dockerfile (frontend): Dockerfile for the frontend.

Prerequisites

Docker and Docker Compose
Git
Node.js (for local frontend development, if not using Docker)
Google Cloud credentials for image moderation (see .env setup)

Setup Instructions

Clone the Repository
git clone <repository-url>
cd <repository-name>


Environment Configuration
Copy the .env.example file to .env for both backend and frontend, and fill in the required values:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

Example .env for backend:
MONGODB_URL=mongodb://mongo:27017
DATABASE_NAME=imageModeration
SECRET_KEY=your-super-secret-key-change-this-in-production
GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
INITIAL_ADMIN_TOKEN=admin-12345

Example .env for frontend:
REACT_APP_API_URL=http://localhost:7000

Note: Ensure you have a valid credentials.json file for Google Cloud Vision and place it at the path specified in GOOGLE_APPLICATION_CREDENTIALS. The docker-compose.yml mounts this file into the container.

Build and Run with Docker
Build and start the containers using Docker Compose:
docker-compose up --build

This will:

Start the FastAPI backend on http://localhost:7000.
Start the React frontend on http://localhost:80.
Start a MongoDB instance on mongodb://localhost:27017.


Access the Application

API Docs: Open http://localhost:7000/docs for the FastAPI Swagger UI.
Frontend UI: Open http://localhost (port 80) to interact with the API.



API Endpoints
Authentication (Admin-Only)

POST /auth/tokens: Generate a new bearer token.
GET /auth/tokens: List all tokens (admin only).
DELETE /auth/tokens/{token}: Delete a specific token (admin only).

Moderation

POST /moderate: Upload an image and receive a content-safety report.

All endpoints require a valid bearer token in the Authorization: Bearer <token> header.
Frontend Usage

Generate a Token: Use the frontend UI to generate a bearer token.
Upload an Image: Select an image file to upload for moderation.
View Safety Report: The UI will display the moderation results, including detected categories and confidence scores.

Development Workflow

Git Workflow: Not yet implemented. Planned to use GitHub Flow with feature branches and CI hooks for linting.
Backend Development:
Install dependencies: pip install -r backend/requirements.txt.
Run locally: uvicorn backend.main:app --host 0.0.0.0 --port 7000 --reload.


Frontend Development:
Install dependencies: cd frontend && npm install.
Run locally: npm start.


Testing:
Backend tests: cd backend && pytest.



Dependencies
Backend (from requirements.txt)

FastAPI==0.104.1
Uvicorn[standard]==0.24.0
Motor==3.3.2
PyMongo==4.6.0
Python-Multipart==0.0.6
Pillow==10.1.0
Pydantic==2.5.0
Python-Jose[cryptography]==3.3.0
Passlib[bcrypt]==1.7.4
Google-Cloud-Vision>=3.4.0
OpenCV-Python==4.8.1.78
Torch>=2.0.0
Torchvision>=0.15.0
Transformers>=4.30.0
Numpy<2.0
Aiohttp>=3.8.0

Frontend

React (built using Node.js 18)
Nginx (for serving the production build)

License
This project is licensed under the MIT License. See the LICENSE file for details.
