Image Moderation API
Image Moderation API is a powerful platform designed to detect and block harmful or unwanted imagery, such as graphic violence, hate symbols, explicit nudity, self-harm depictions, or extremist propaganda. By leveraging Google Cloud Vision, OpenCV, and machine learning models, it ensures safe content delivery. Whether you're a developer, a content platform, or a business, this API provides a seamless solution to moderate images, manage authentication, and track usage. Simplify content safety and focus on your core goals with the Image Moderation API.
Features

User Authentication: Secure bearer token-based authentication with admin privileges.
Image Moderation: Analyze images and generate content-safety reports.
Usage Tracking: Monitor API usage with MongoDB.
RESTful APIs: Well-structured endpoints for seamless integration.
Scalable Architecture: Built with Docker for scalability and maintainability.
Frontend UI: Minimal React UI for token generation, image upload, and report viewing.

Prerequisites
Before you begin, ensure you have the following installed on your machine:

Docker and Docker Compose
Git
Google Cloud account (for Vision API credentials)
MongoDB (handled via Docker)

Installation
Clone the Repository
git clone https://github.com/<your-username>/image-moderation-api.git

Set Up Environment Variables
Create a .env file in both the backend and frontend directories and add the following variables:

Backend .env:
MONGODB_URL=mongodb://mongo:27017
DATABASE_NAME=imageModeration
SECRET_KEY=your-super-secret-key-change-this-in-production
GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
INITIAL_ADMIN_TOKEN=admin-12345


Frontend .env:
REACT_APP_API_URL=http://localhost:7000



Note: Ensure you have a valid credentials.json file for Google Cloud Vision and place it at the path specified in GOOGLE_APPLICATION_CREDENTIALS. The docker-compose.yml mounts this file into the container.
Build and Run with Docker
docker-compose up --build

The services will start:

Backend API at http://localhost:7000.
Frontend UI at http://localhost:80.
MongoDB at mongodb://localhost:27017.

Environment Variables



Variable
Description
Example Value



MONGODB_URL
MongoDB connection string
mongodb://mongo:27017


DATABASE_NAME
MongoDB database name
imageModeration


SECRET_KEY
Secret key for JWT authentication
your-super-secret-key


GOOGLE_APPLICATION_CREDENTIALS
Path to Google Cloud credentials
/app/credentials.json


GOOGLE_CLOUD_PROJECT
Google Cloud project ID
your-google-cloud-project-id


INITIAL_ADMIN_TOKEN
Initial admin token for authentication
admin-12345


REACT_APP_API_URL
Backend API URL (for frontend)
http://localhost:7000


Contributing
We welcome contributions! To contribute to this project:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeatureName).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeatureName).
Open a pull request.

Note: A Git workflow (e.g., GitHub Flow) is planned but not yet implemented.
License
This project is licensed under the MIT License. See the LICENSE file for details.
