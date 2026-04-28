from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from . import models, auth, certificate
import random, string

from fastapi.responses import HTMLResponse

app = FastAPI()

# Allow React frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/", response_class=HTMLResponse)
def root():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Magizh Technologies - Certificate System</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
            
            body {
                margin: 0;
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
                color: white;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            }
            
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                max-width: 600px;
            }
            
            h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                background: linear-gradient(to right, #fff, #90caf9);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            p {
                font-size: 1.2rem;
                opacity: 0.8;
                margin-bottom: 2rem;
            }
            
            .badge {
                background: #d32f2f;
                padding: 0.5rem 1rem;
                border-radius: 50px;
                font-weight: 600;
                font-size: 0.9rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 1.5rem;
                display: inline-block;
            }
            
            .btn {
                background: #fff;
                color: #1a237e;
                padding: 1rem 2rem;
                border-radius: 10px;
                text-decoration: none;
                font-weight: 700;
                transition: all 0.3s ease;
                display: inline-block;
            }
            
            .btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                background: #f0f0f0;
            }
            
            .status {
                margin-top: 2rem;
                font-size: 0.9rem;
                color: #81d4fa;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="badge">Internal System</div>
            <h1>Magizh Technologies</h1>
            <p>Professional Internship Certificate Generation & Verification System</p>
            <a href="/docs" class="btn">Explore API Docs</a>
            <div class="status">● System Operational</div>
        </div>
    </body>
    </html>
    """

def get_db():
    db = SessionLocal()
    yield db
    db.close()

def gen_id():
    return "CERT-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


@app.post("/register")
def register(name: str, email: str, password: str, role: str, db: Session = Depends(get_db)):
    user = models.User(
        name=name,
        email=email,
        password=auth.hash_password(password),
        role=role,
        internship_id=f"INT-{random.randint(1000,9999)}"
    )
    db.add(user)
    db.commit()
    return {"message": "User Registered"}


@app.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not auth.verify_password(password, user.password):
        raise HTTPException(400, "Invalid")

    return {"token": auth.create_token({"id": user.id})}


@app.post("/generate/{user_id}")
def generate(user_id: int,
             role: str,
             start_date: str,
             end_date: str,
             db: Session = Depends(get_db)):

    user = db.query(models.User).get(user_id)

    if not user:
        raise HTTPException(404, f"User with ID {user_id} not found. Please check the ID and try again.")

    cert_id = gen_id()

    file_path = certificate.generate_certificate(user, cert_id, role, start_date, end_date)

    db.add(models.Certificate(
        user_id=user_id,
        cert_id=cert_id,
        role=role,
        issue_date=start_date
    ))

    db.commit()

    return {"cert_id": cert_id, "file": file_path}


@app.get("/verify/{cert_id}")
def verify(cert_id: str, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter_by(cert_id=cert_id).first()

    if not cert:
        return {"status": "INVALID"}

    user = db.query(models.User).get(cert.user_id)

    return {
        "status": "VERIFIED",
        "name": user.name,
        "company": "Magizh Technologies"
    }