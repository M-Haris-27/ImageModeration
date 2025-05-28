# 🛡️ Image Moderation API

The **Image Moderation API** is a powerful and scalable platform designed to detect and block harmful or unwanted imagery such as:

* 🔪 Graphic violence
* ☠️ Hate symbols
* 🔞 Explicit nudity
* 🩸 Self-harm depictions
* 🚫 Extremist propaganda

Leveraging **Google Cloud Vision**, **OpenCV**, and **custom ML models**, this API helps ensure safe content delivery for developers, platforms, and businesses.

---

## 🚀 Features

* 🔐 **User Authentication**: Secure bearer token-based auth with admin privileges.
* 🧠 **Image Moderation**: Analyze images and generate content safety reports.
* 📊 **Usage Tracking**: Monitor API usage with MongoDB.
* 🌐 **RESTful APIs**: Clean, well-structured endpoints.
* 🐳 **Scalable Architecture**: Built with Docker and Docker Compose.
* 🖼️ **Frontend UI**: Minimal React UI for token generation, image upload, and report viewing.

---

## 🧰 Prerequisites

Ensure the following are installed on your machine:

* [Docker & Docker Compose](https://docs.docker.com/get-docker/)
* [Git](https://git-scm.com/)
* [Google Cloud Account](https://cloud.google.com/) (for Vision API)
* Google Vision API credentials (as `credentials.json`)

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/image-moderation-api.git
cd image-moderation-api
```

### 2. Set Up Environment Variables

Create a `.env` file in both the **backend** and **frontend** directories.

#### 📁 Backend `.env`

```env
MONGODB_URL=mongodb://mongo:27017
DATABASE_NAME=imageModeration
SECRET_KEY=your-super-secret-key-change-this-in-production
GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
GOOGLE_CLOUD_PROJECT=your-google-cloud-project-id
INITIAL_ADMIN_TOKEN=admin-12345
```

#### 📁 Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:7000
```

> 💡 Place your Google Cloud Vision `credentials.json` in the project root. It will be mounted to `/app/credentials.json` via Docker.

### 3. Build and Run with Docker

```bash
docker-compose up --build
```

---

## 🌐 Access

* **Backend API**: [http://localhost:7000](http://localhost:7000)
* **Frontend UI**: [http://localhost:80](http://localhost:80)
* **MongoDB**: mongodb://localhost:27017

---

## 📄 Environment Variables Reference

| Variable                         | Description                        | Example                        |
| -------------------------------- | ---------------------------------- | ------------------------------ |
| `MONGODB_URL`                    | MongoDB connection string          | `mongodb://mongo:27017`        |
| `DATABASE_NAME`                  | MongoDB database name              | `imageModeration`              |
| `SECRET_KEY`                     | JWT authentication secret key      | `your-super-secret-key`        |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud credentials   | `/app/credentials.json`        |
| `GOOGLE_CLOUD_PROJECT`           | Your Google Cloud project ID       | `your-google-cloud-project-id` |
| `INITIAL_ADMIN_TOKEN`            | Initial admin token for API access | `admin-12345`                  |
| `REACT_APP_API_URL`              | API base URL used in frontend      | `http://localhost:7000`        |

---

## 🤝 Contributing

We welcome all contributions!

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes

   ```bash
   git commit -m "Add some feature"
   ```
4. Push to GitHub

   ```bash
   git push origin feature/YourFeatureName
   ```
5. Open a pull request 🚀

> 📌 *Note: A Git workflow (e.g., GitHub Flow) is planned but not yet implemented.*

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

Let me know if you'd like a logo badge, setup script, or deployment instructions added!
