from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.models import user, account, trading_plan, trading_daily_book
from app.routes import auth, users, accounts, trading_plans, trading_daily_books

# Create database tables
user.Base.metadata.create_all(bind=engine)
account.Base.metadata.create_all(bind=engine)
trading_plan.Base.metadata.create_all(bind=engine)
trading_daily_book.Base.metadata.create_all(bind=engine)

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
app.include_router(accounts.router)
app.include_router(trading_plans.router)
app.include_router(trading_daily_books.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Token Auth API"}
