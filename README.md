# Checklist App

## 📌 Project Overview

This is a full-stack **Checklist/Todo Application** built with:

- **Frontend**: Angular (`/frontend-angular`)
- **Backend**: Express.js (`/backend-express`)
- **Database**: PostgreSQL
- **Containerization**: Docker with `docker-compose` for development and production

---

## 🚀 Getting Started (Development)

To run the full stack locally with Docker:

### 1. Build containers

```bash
docker compose -f docker-compose.dev.yml build
```

### 2. Start services

```bash
docker compose -f docker-compose.dev.yml up
```

This will start:

- PostgreSQL on port 5432  
- Express backend on port 3000  
- Angular frontend on port 4200

### 3. Stop services

```bash
docker compose -f docker-compose.dev.yml down
```

---

## ⚠️ Production Status

Production setup is not yet complete. The following would have to be handled further:

- Managing environment variables securely (e.g., using `.env` files or secret managers)
- Finalizing `docker-compose.yml` for deployment

---

## 🔭 Future Improvements

- ✅ Full production setup for Docker
- 🚀 Google Cloud deployment setup (potentially via GitHub Actions)
- 🧪 Test the CRUD functionality of the tasks  
- Mock PostgreSQL or run it in a dev container during tests