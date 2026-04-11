# Gym Management System

A full-stack gym management platform built with React, Spring Boot, and MySQL. The application supports admin and member authentication, package and trainer management, membership tracking, and a BMI calculator for visitors.

## Live Demo

- Frontend: [https://gym-subscription-trainer-scheduling.vercel.app](https://gym-subscription-trainer-scheduling.vercel.app)


## Tech Stack

- Frontend: React, Vite, Bootstrap, Axios
- Backend: Spring Boot, Spring Data JPA, Spring Security, Maven
- Database: MySQL
- Deployment: Vercel, Render, Railway

## Features

- Admin registration and login
- Member registration and login
- Add, update, view, and delete trainers
- Add, update, and view gym packages
- Register members and manage profiles
- Create and manage memberships
- Membership request approval flow
- Member search by keyword
- BMI calculator page
- Responsive UI for public and dashboard pages

## Project Structure

```text
GYM_SUBS/
├── backend/    Spring Boot REST API
├── frontend/   React + Vite frontend
├── docker-compose.yml
└── render.yaml
```

## Live Deployment Architecture

- Frontend deployed on Vercel
- Backend deployed on Render
- MySQL database hosted on Railway

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abhi-10949/GYM-Subscription-Trainer-Scheduling.git
cd GYM-Subscription-Trainer-Scheduling
```

### 2. Backend Setup

Create `backend/.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/gym_management_system?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### 3. Frontend Setup

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Docker Setup

You can also run the entire project locally with Docker.

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/api`
- MySQL: `localhost:3306`

## Deployment Configuration

This repository includes:

- [docker-compose.yml](/Users/abhishekkumar/Documents/JAVA_PROJECT_GYM_SUBS/docker-compose.yml) for local containerized setup
- [render.yaml](/Users/abhishekkumar/Documents/JAVA_PROJECT_GYM_SUBS/render.yaml) for Render deployment
- [frontend/vercel.json](/Users/abhishekkumar/Documents/JAVA_PROJECT_GYM_SUBS/frontend/vercel.json) for Vercel deployment
- [backend/Dockerfile](/Users/abhishekkumar/Documents/JAVA_PROJECT_GYM_SUBS/backend/Dockerfile) for backend container build
- [frontend/Dockerfile](/Users/abhishekkumar/Documents/JAVA_PROJECT_GYM_SUBS/frontend/Dockerfile) for frontend container build

## Production Environment Variables

### Backend

```env
DB_URL=jdbc:mysql://your-host:3306/your-database?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

The backend also supports Railway-style MySQL environment variables:

```env
MYSQLHOST=your-host
MYSQLPORT=3306
MYSQLDATABASE=your-database
MYSQLUSER=your-user
MYSQLPASSWORD=your-password
```

### Frontend

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

## Main API Endpoints

- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `POST /api/auth/member/register`
- `POST /api/auth/member/login`
- `GET /api/packages`
- `POST /api/packages`
- `GET /api/trainers`
- `POST /api/trainers`
- `GET /api/members`
- `GET /api/members/search?keyword=...`
- `GET /api/members/{clientId}`
- `PATCH /api/members/{clientId}`
- `POST /api/members/{clientId}/change-password`
- `GET /api/memberships`
- `POST /api/memberships`
- `GET /api/memberships/member/{clientId}`
- `GET /api/health`

## Demo Data Suggestions

You can test the project by creating:

- Demo admin accounts
- Demo members
- Demo packages such as Basic, Standard, and Premium
- Demo trainers with different specializations
- Membership approval remarks such as `Welcome to the gym. Your membership has been approved.`

## Notes

- Render free tier may sleep after inactivity, so the first API request can be slow.
- The public trainer and package pages only show data that exists in the production database.
- If deployed frontend requests fail, verify `APP_CORS_ALLOWED_ORIGINS` in Render.

## Author

Abhishek Kumar
