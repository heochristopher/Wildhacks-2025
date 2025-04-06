from fastapi import FastAPI
from routes import auth, dashboard, levels, language, ws

app = FastAPI()

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(levels.router)
app.include_router(language.router)
app.include_router(ws.router)