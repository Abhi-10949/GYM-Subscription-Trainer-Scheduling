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

## Docker Deployment

This repo now includes containerized deployment for the full stack:

- `database` - MySQL 8
- `backend` - Spring Boot app on port `8080`
- `frontend` - Vite build served by Nginx on port `3000`

### Start everything

From the project root:

```bash
docker compose up --build
```

### Access the app

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`
- MySQL: `localhost:3306`

### Important production variables

Backend supports environment-based CORS now:

```env
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
DB_URL=jdbc:mysql://your-db-host:3306/gym_management_system?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

Frontend build uses:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Suggested cloud split

If you want to deploy publicly, a simple setup is:

- Frontend on Vercel or Netlify
- Backend on Render, Railway, or AWS
- Database on Railway MySQL, Render PostgreSQL/MySQL alternative, AWS RDS, or another managed MySQL provider

For that setup:

1. Deploy the database and copy its connection string into backend env vars.
2. Deploy the backend and set `APP_CORS_ALLOWED_ORIGINS` to your frontend URL.
3. Deploy the frontend with `VITE_API_BASE_URL` pointing to the backend public URL.

## Vercel + Render + Railway Deployment

This repo is now prepared for this split:

- `frontend/` -> Vercel
- `backend/` -> Render
- MySQL -> Railway

### 1. Deploy MySQL on Railway

Create a new Railway project and add the MySQL template.

Railway's current MySQL docs say the service exposes:

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQL_URL`

Sources:

- [Railway MySQL docs](https://docs.railway.com/guides/mysql)
- [Railway variables docs](https://docs.railway.com/variables)

For a Render-hosted backend, the simplest path is:

1. Open the Railway MySQL service.
2. Copy either the individual MySQL variables or the connection details from `MYSQL_URL`.
3. Keep TCP Proxy enabled so Render can connect from outside Railway.

Note:
The backend now supports either the app's original `DB_URL` style or Railway-style `MYSQL_URL` / `MYSQLHOST` variables at startup.

### 2. Deploy Backend on Render

This repo includes a Render Blueprint file at `render.yaml`.

Render's current docs say Blueprint config lives in `render.yaml`, Docker services can point to `dockerfilePath` and `dockerContext`, and web services should bind to `PORT` with a health check path.

Sources:

- [Render Blueprint YAML reference](https://render.com/docs/blueprint-spec)
- [Render web services docs](https://render.com/docs/web-services)
- [Render environment variables docs](https://render.com/docs/environment-variables)

Recommended steps:

1. Push this repo to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Render should use [`render.yaml`](/Users/abhishekkumar/Documents/JAVA_PROJECT_GYM_SUBS/render.yaml).
4. Set these backend environment variables in Render:

```env
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-project.vercel.app
DB_URL=jdbc:mysql://<railway-host>:<railway-port>/<railway-db>?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=<railway-user>
DB_PASSWORD=<railway-password>
```

You can also use Railway-style variables instead:

```env
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-project.vercel.app
MYSQLHOST=<railway-host>
MYSQLPORT=<railway-port>
MYSQLDATABASE=<railway-db>
MYSQLUSER=<railway-user>
MYSQLPASSWORD=<railway-password>
```

After deploy, verify:

- Health endpoint: `https://your-render-backend.onrender.com/api/health`
- API base URL: `https://your-render-backend.onrender.com/api`

### 3. Deploy Frontend on Vercel

Vercel's current docs say build settings can be configured in `vercel.json`, and rewrites are also defined there. This repo includes a Vercel config in `frontend/vercel.json` for Vite output and SPA routing.

Sources:

- [Vercel vercel.json docs](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel build docs](https://vercel.com/docs/deployments/configure-a-build)
- [Vercel rewrites docs](https://vercel.com/docs/rewrites)

Recommended steps:

1. In Vercel, import the same GitHub repo.
2. Set the Root Directory to `frontend`.
3. Confirm the framework is Vite.
4. Set this environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

5. Deploy.

### 4. Final Wiring

Once both apps are live:

1. Copy the real Vercel production URL into Render's `APP_CORS_ALLOWED_ORIGINS`.
2. Redeploy the Render backend.
3. Test:
   - Home page loads
   - Admin/member login works
   - Trainer/package/member APIs return data
   - `GET /api/health` returns status `UP`

### Example Production Values

```env
# Render backend
APP_CORS_ALLOWED_ORIGINS=https://gym-subs.vercel.app
DB_URL=jdbc:mysql://mysql.railway.internal-or-public-host:12345/gym_management_system?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=strong-password

# Vercel frontend
VITE_API_BASE_URL=https://gym-management-backend.onrender.com/api
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
