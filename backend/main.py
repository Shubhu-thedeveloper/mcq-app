from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import auth, test, progress

app = FastAPI(title="Spaced Repetition MCQ API")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(test.router)
app.include_router(progress.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Spaced Repetition MCQ API"}
