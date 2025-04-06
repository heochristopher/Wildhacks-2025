from fastapi import FastAPI
from routes import auth, dashboard, levels, generateContent


app = FastAPI()

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(levels.router)
<<<<<<< HEAD
app.include_router(generateContent.router)
=======
app.include_router(language.router)
>>>>>>> 47beae3 (.)
