# Day-wise Spaced Repetition MCQ Platform

This is a full-stack platform built with FastApi, React, Vite, and MongoDB. It allows users to take daily 30-question MCQ tests, utilizing a spaced repetition algorithm that re-tests weak subjects 3-4 days later while discarding mastered subjects.

## ⚙️ Prerequisites
Before running the project locally, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher)
- **Python** (3.10 or higher)
- **MongoDB** (running locally on port `27017` or configured via `MONGO_URI` environment variable)

---

## 🚀 Setup & Run Instructions

You will need to run the backend and the frontend on two separate terminal processes.

### 1. Database Setup
Ensure that **MongoDB** is actively running on your local machine.
If you need to seed the database with mock math questions for testing:
```bash
cd backend
../myenv/Scripts/python seed.py
```

### 2. Backend (FastAPI) Setup
The backend requires a Python virtual environment and its dependencies to be installed.

**Windows PowerShell:**
```bash
# From the root directory (d:\mcq_app)
# If the virtual environment does not exist yet:
python -m venv myenv

# Install the Python dependencies into the environment:
.\myenv\Scripts\pip install fastapi uvicorn motor "pydantic[email]" "passlib[bcrypt]" "python-jose[cryptography]" python-multipart

# Start the FastAPI server (it will run on http://127.0.0.1:8000)
.\myenv\Scripts\uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend (React + Vite) Setup
The frontend dependencies need to be installed via `npm`.

**Windows PowerShell:**
```bash
# Open a NEW terminal side-by-side with your backend
# Navigate to the frontend directory
cd frontend

# Install the necessary NPM dependencies
npm install

# Start the frontend dev server (it will run on http://localhost:5173)
npm run dev
```

---

## 🌐 Usage
Once both the FastAPI server and the Vite server are running:
1. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.
2. Register for a new account.
3. Click "Start Daily Test" from your dashboard to invoke the smart spaced-repetition logic!
