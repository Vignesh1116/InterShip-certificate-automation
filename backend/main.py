from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import auth
import certificate
import random, string, os
from datetime import datetime

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

# Resolve project root for certificates directory
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CERTS_DIR = os.path.join(PROJECT_ROOT, "certificates")


def get_db():
    db = SessionLocal()
    yield db
    db.close()


def gen_id():
    return "CERT-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Magizh Technologies - Certificate System",
        "version": "2.2.0-fix"
    }


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


class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Hardcoded admin credentials as requested
    if request.email == "admin@gmail.com" and request.password == "admin@123":
        return {"token": auth.create_token({"id": 0, "role": "admin"})}
    
    user = db.query(models.User).filter(models.User.email == request.email).first()

    if not user or not auth.verify_password(request.password, user.password):
        raise HTTPException(400, "Invalid credentials.")

    return {"token": auth.create_token({"id": user.id})}


@app.post("/generate")
def generate(
    name: str,
    email: str,
    role: str,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db)
):
    """Generate a certificate for a student. Auto-creates user if not exists."""

    # Check if user exists by email, or create a new one
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        internship_id = f"INT-{random.randint(1000, 9999)}"
        user = models.User(
            name=name,
            email=email,
            password=auth.hash_password("default123"),
            role=role,
            internship_id=internship_id
        )
        db.add(user)
        db.flush()  # Get the user ID
    else:
        # Update name/role if changed
        user.name = name
        user.role = role

    cert_id = gen_id()

    # Make sure cert_id is unique
    while db.query(models.Certificate).filter_by(cert_id=cert_id).first():
        cert_id = gen_id()

    file_path = certificate.generate_certificate(user, cert_id, role, start_date, end_date)

    db.add(models.Certificate(
        user_id=user.id,
        cert_id=cert_id,
        role=role,
        issue_date=datetime.now().strftime("%Y-%m-%d")
    ))

    db.commit()

    return {
        "cert_id": cert_id,
        "file": file_path,
        "student_name": user.name,
        "student_email": user.email,
        "internship_id": user.internship_id,
        "role": role,
        "start_date": start_date,
        "end_date": end_date
    }


from pydantic import BaseModel

class InternCreate(BaseModel):
    name: str
    email: str
    role: str
    start_date: str
    end_date: str

@app.post("/interns")
def add_intern(intern: InternCreate, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        user = db.query(models.User).filter(models.User.email == intern.email).first()
        
        if user:
            # Update existing user
            user.name = intern.name
            user.role = intern.role
            user.start_date = intern.start_date
            user.end_date = intern.end_date
            db.commit()
            db.refresh(user)
            return {"message": "Intern updated successfully", "internship_id": user.internship_id, "user_id": user.id}
        
        # Create new user
        internship_id = f"INT-{random.randint(1000, 9999)}"
        user = models.User(
            name=intern.name,
            email=intern.email,
            password=auth.hash_password("default123"),
            role=intern.role,
            internship_id=internship_id,
            start_date=intern.start_date,
            end_date=intern.end_date
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": "Intern added successfully", "internship_id": internship_id, "user_id": user.id}
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        print(f"Error adding intern: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/generate/intern/{internship_id}")
def generate_by_internship_id(internship_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.internship_id == internship_id).first()

    if not user:
        raise HTTPException(404, f"Intern with Internship ID {internship_id} not found.")

    cert_id = gen_id()
    while db.query(models.Certificate).filter_by(cert_id=cert_id).first():
        cert_id = gen_id()

    # Use defaults if dates are missing for older records
    start_date = user.start_date or "01 May 2025"
    end_date = user.end_date or "30 June 2025"

    file_path = certificate.generate_certificate(user, cert_id, user.role, start_date, end_date)

    db.add(models.Certificate(
        user_id=user.id,
        cert_id=cert_id,
        role=user.role,
        issue_date=datetime.now().strftime("%Y-%m-%d")
    ))

    db.commit()

    return {
        "cert_id": cert_id,
        "file": file_path,
        "student_name": user.name,
        "student_email": user.email,
        "internship_id": user.internship_id,
        "role": user.role,
        "start_date": start_date,
        "end_date": end_date
    }


@app.get("/verify/{cert_id}")
def verify(cert_id: str, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter_by(cert_id=cert_id).first()

    if not cert:
        return {"status": "INVALID"}

    user = db.get(models.User, cert.user_id)

    return {
        "status": "VERIFIED",
        "name": user.name,
        "email": user.email,
        "company": "Magizh Technologies",
        "role": cert.role,
        "cert_id": cert.cert_id,
        "internship_id": user.internship_id,
        "issue_date": cert.issue_date
    }


@app.get("/preview/{cert_id}")
def preview_certificate(cert_id: str, db: Session = Depends(get_db)):
    """Preview the generated certificate PDF in the browser."""
    cert = db.query(models.Certificate).filter_by(cert_id=cert_id).first()
    if not cert:
        raise HTTPException(404, "Certificate not found")

    pdf_path = os.path.join(CERTS_DIR, f"{cert_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(404, "Certificate file not found")

    # By omitting the 'filename' parameter, FastAPI will not force 'attachment',
    # allowing the browser to display the PDF inline.
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename={cert_id}.pdf"}
    )

@app.get("/download/{cert_id}")
def download_certificate(cert_id: str, db: Session = Depends(get_db)):
    """Download the generated certificate PDF."""
    cert = db.query(models.Certificate).filter_by(cert_id=cert_id).first()
    if not cert:
        raise HTTPException(404, "Certificate not found")

    pdf_path = os.path.join(CERTS_DIR, f"{cert_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(404, "Certificate file not found")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{cert_id}.pdf"
    )


@app.get("/students")
def list_students(db: Session = Depends(get_db)):
    """List all students/users with internship status."""
    users = db.query(models.User).all()
    today = datetime.now().date()
    
    results = []
    for u in users:
        status = "Doing Internship"
        if u.end_date:
            try:
                end_dt = datetime.strptime(u.end_date, "%Y-%m-%d").date()
                if today > end_dt:
                    status = "Completed"
            except:
                pass
        
        results.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "internship_id": u.internship_id,
            "start_date": u.start_date,
            "end_date": u.end_date,
            "status": status
        })
    return results


@app.get("/certificates")
def list_certificates(db: Session = Depends(get_db)):
    """List all certificates."""
    certs = db.query(models.Certificate).all()
    results = []
    for c in certs:
        user = db.get(models.User, c.user_id)
        results.append({
            "cert_id": c.cert_id,
            "student_name": user.name if user else "Unknown",
            "role": c.role,
            "issue_date": c.issue_date
        })
    return results


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Get overall internship statistics based on dates."""
    users = db.query(models.User).all()
    today = datetime.now().date()
    
    total_users = len(users)
    completed_count = 0
    
    for u in users:
        if u.end_date:
            try:
                end_dt = datetime.strptime(u.end_date, "%Y-%m-%d").date()
                if today > end_dt:
                    completed_count += 1
            except:
                pass
    
    doing_count = total_users - completed_count
    
    # Role distribution
    role_counts = {}
    for u in users:
        role = u.role
        if role:
            role_counts[role] = role_counts.get(role, 0) + 1
        
    return {
        "total_students": total_users,
        "doing_internships": doing_count,
        "completed_internships": completed_count,
        "roles": [{"role": k, "count": v} for k, v in role_counts.items()]
    }