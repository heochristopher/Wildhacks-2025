from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, dashboard, levels, language, ws, submit_test, update_score, generateContent

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001"
    "https://dotby.tech"
    # Add any other origins you need to allow
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows requests from these origins
    allow_credentials=True,
    allow_methods=["*"],              # Allows all HTTP methods
    allow_headers=["*"],              # Allows all headers
)


app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(levels.router)
app.include_router(language.router)
app.include_router(ws.router)
app.include_router(submit_test.router)
app.include_router(generateContent.router)
app.include_router(update_score.router)