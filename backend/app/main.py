from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.models import user
from app.routes import auth, users

# Create database tables
user.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title="Token Auth API")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite dev server default port
    "http://localhost:4173",  # Vite preview server default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Token Auth API"}
