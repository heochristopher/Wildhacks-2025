from fastapi import FastAPI
from routes import auth, dashboard

app = FastAPI()

app.include_router(auth.router)
app.include_router(dashboard.router)