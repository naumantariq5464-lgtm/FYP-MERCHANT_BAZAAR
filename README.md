# Merchant Bazaar (FYP) 🛍️
> **A Modern Multi-Tenant E-Commerce Platform for Independent Merchants & Brands**

Merchant Bazaar empowers entrepreneurs and brands to create, customize, and publish their own digital storefronts with unique subdomains, live branding customization, product & inventory management, order tracking, and guest checkout capabilities.

---

## 🏗️ System Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | [FastAPI](https://fastapi.tiangolo.com/) (Python  3.14) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) (Neon Serverless) + [SQLAlchemy 2.0](https://www.sqlalchemy.org/) |
| **Database Migrations** | [Alembic](https://alembic.sqlalchemy.org/) |
| **Authentication** | JWT (JSON Web Tokens) with `python-jose` & `passlib[bcrypt]` |
| **Media / Asset Storage**| [Cloudinary](https://cloudinary.com/) (Logos & Hero Banners) |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose |
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript |
| **Styling** | Modern Vanilla CSS design system |

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Python 3.10+** (Download from [python.org](https://www.python.org/downloads/))
- **Node.js 18+ & npm** (Download from [nodejs.org](https://nodejs.org/))
- **Git** (Download from [git-scm.com](https://git-scm.com/))
- **Docker Desktop** *(Optional, for containerized run)*

---

## ⚙️ Backend Setup Guide (Using Windows CMD)

Follow these exact steps in **Windows Command Prompt (`cmd.exe`)**:

### Step 1: Open CMD and Navigate to Backend Folder
```cmd
cd d:\FYP\merchant-bazaar\backend
```

### Step 2: Create a Virtual Environment (`venv`)
Run the following command to create an isolated Python virtual environment:
```cmd
python -m venv venv
```

### Step 3: Activate the Virtual Environment in CMD
Activate the virtual environment using the batch script:
```cmd
venv\Scripts\activate.bat
```
*(Once activated, you will see `(venv)` prefixed in your CMD prompt).*

### Step 4: Install Dependencies
Upgrade `pip` and install all required Python packages:
```cmd
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### 📦 Requirements Reference (`requirements.txt`)
The backend relies on the following core production packages:
```text
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
sqlalchemy>=2.0.30
alembic>=1.13.1
psycopg[binary]>=3.2.0
pydantic>=2.10.0
pydantic-settings>=2.6.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.12
cloudinary>=1.42.0
python-dotenv>=1.0.1
email-validator>=2.2.0
httpx>=0.27.0
```

### Step 5: Configure Backend Environment Variables (`.env`)
Create a `.env` file inside the `backend/` folder (or copy from `.env.example`):
```cmd
copy .env.example .env
```

Open `backend\.env` in any text editor and fill in your credentials:
```ini
# Database Connection String (PostgreSQL / Neon / Supabase)
DATABASE_URL=postgresql://username:password@localhost:5432/merchant_bazaar_db

# Security & JWT Authentication
# (Generate a 32+ character random secret string)
SECRET_KEY=your-super-secret-jwt-key-minimum-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Super Admin Initial Credentials
ADMIN_EMAIL=admin@merchantbazaar.com
ADMIN_PASSWORD=YourSecureAdminPassword123!

# Cloudinary Storage (For Store Logos & Banners)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application Settings
APP_NAME=Merchant Bazaar
BASE_DOMAIN=merchantbazaar.com
FRONTEND_URL=http://localhost:3000
```
> ⚠️ **Security Notice:** Never commit your `.env` file containing real secrets to GitHub. It is protected by `.gitignore`.

### Step 6: Run Database Migrations
Apply database schema migrations via Alembic:
```cmd
alembic upgrade head
```

### Step 7: Start the FastAPI Backend Server
```cmd
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will now be live:
- **API Base URL:** `http://localhost:8000/api`
- **Interactive Swagger Docs:** `http://localhost:8000/api/docs`
- **Health Check Endpoint:** `http://localhost:8000/api/health`

---

## 🎨 Frontend Setup Guide (Using Windows CMD)

Open a **new** Windows Command Prompt window for the frontend:

### Step 1: Navigate to Frontend Folder
```cmd
cd d:\FYP\merchant-bazaar\frontend
```

### Step 2: Configure Frontend Environment Variables (`.env.local`)
Create a `.env.local` file inside the `frontend/` folder (or copy from `.env.example`):
```cmd
copy .env.example .env.local
```

Ensure `frontend\.env.local` has:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_DOMAIN=localhost:3000
```

### Step 3: Install Node Dependencies
```cmd
npm install
```

### Step 4: Run Next.js Development Server
```cmd
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 🐳 Docker Deployment (Alternative Backend Run)

If you have Docker Desktop installed, you can start the entire backend with a single command:

```cmd
cd d:\FYP\merchant-bazaar\backend
docker compose up --build -d
```

- **View Logs:** `docker compose logs -f`
- **Stop Backend:** `docker compose down`

---

## 📂 Project Directory Structure

```text
merchant-bazaar/
├── backend/
│   ├── alembic/                # Database migration scripts
│   ├── alembic.ini             # Alembic configuration
│   ├── app/
│   │   ├── dependencies/       # Auth guards & session dependency injection
│   │   ├── models/             # SQLAlchemy ORM models (User, Store, Product, Order)
│   │   ├── routers/            # FastAPI API route controllers
│   │   ├── schemas/            # Pydantic request/response validation schemas
│   │   ├── services/           # Business logic & database operations
│   │   ├── config.py           # Pydantic Settings & environment loader
│   │   ├── database.py         # SQLAlchemy engine & session maker
│   │   └── main.py             # FastAPI application entrypoint & middleware
│   ├── .dockerignore           # Excluded files for Docker build
│   ├── .env.example            # Sample backend environment template
│   ├── Dockerfile              # Container definition for Python/FastAPI
│   ├── docker-compose.yml      # Docker compose configuration
│   └── requirements.txt        # Python dependency manifest
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── components/         # Modular UI components (dashboard, landing, storefront)
│   │   ├── context/            # React context providers (AuthContext, CartContext)
│   │   ├── lib/                # Axios API client & utility helpers
│   │   └── styles/             # Global CSS & design tokens
│   ├── .env.example            # Sample frontend environment template
│   ├── package.json            # Node.js dependencies & scripts
│   └── tsconfig.json           # TypeScript configuration
├── .gitignore                  # Git ignore rules for Python, Node, & secrets
└── README.md                   # Project documentation & setup guide
```

---

## 🔒 Security & Privacy

- All sensitive credentials (`.env`, `.env.local`, JWT secrets, database connection URLs, Cloudinary API keys) are strictly ignored via `.gitignore` and are never committed.
- Passwords are encrypted using salted `bcrypt` hashes.
- Authentication uses stateless JWT tokens with role-based access control (Admin, Seller, Customer).

---

## 📜 License
Developed as a Final Year Project (FYP). All rights reserved.
>>>>>>> d56ffb9 (Initial commit: Merchant Bazaar fullstack platform with FastAPI backend and Next.js frontend)
