from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, dashboard, levels, language, ws, generateContent, lcd_ws_server

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
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
app.include_router(generateContent.router)
app.include_router(language.router)

app.include_router(language.router)
app.include_router(lcd_ws_server.router)