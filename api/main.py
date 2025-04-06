from fastapi import FastAPI
from routes import auth, dashboard, levels, generateContent

app = FastAPI()

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(levels.router)
app.include_router(generateContent.router)
