# Gym Management System

Full-stack Gym Management System starter project using:

- React JS
- Spring Boot
- MySQL
- Bootstrap
- Maven

## Project Structure

- `backend/` - Spring Boot REST API
- `frontend/` - React + Vite application

## Features Included

- Admin registration and login
- Member registration and login
- Add and view trainers
- Add and view packages
- View all members and search members by name
- Update member profile and change password
- Add and view memberships
- View membership details by member client ID
- BMI calculator for visitors

## Backend Setup

1. Create a `.env` file inside `backend/`.
2. Add your database values:

```env
DB_URL=jdbc:mysql://localhost:3306/gym_management_system?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

3. Run:

```bash
cd backend
mvn spring-boot:run
```

Backend default URL: `http://localhost:8080`

## Frontend Setup

1. Install packages:

```bash
cd frontend
npm install
```

2. Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Run the development server:

```bash
npm run dev
```

Frontend default URL: `http://localhost:5173`

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


