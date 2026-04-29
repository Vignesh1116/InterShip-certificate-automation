
import sys
import os

# Add backend to path so we can import from it
sys.path.append(os.path.abspath("backend"))

from backend.database import SessionLocal, engine, Base
from backend import models, certificate
import random, string

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def gen_id():
    return "CERT-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

def add_intern_and_generate_cert(name, email, role, start_date, end_date):
    db = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            user = models.User(
                name=name,
                email=email,
                password="hashed_password_here", # Not used for cert generation
                role=role,
                internship_id=f"INT-{random.randint(1000,9999)}",
                start_date=start_date,
                end_date=end_date
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"User {name} created with ID {user.id}")
        else:
            print(f"User {name} already exists with ID {user.id}")

        cert_id = gen_id()
        file_path = certificate.generate_certificate(user, cert_id, role, start_date, end_date)

        cert = models.Certificate(
            user_id=user.id,
            cert_id=cert_id,
            role=role,
            issue_date=start_date
        )
        db.add(cert)
        db.commit()
        
        # Absolute path for the output
        abs_path = os.path.abspath(file_path)
        print(f"Certificate generated successfully!")
        print(f"Certificate ID: {cert_id}")
        print(f"File Path: {abs_path}")
        return abs_path
    finally:
        db.close()

if __name__ == "__main__":
    add_intern_and_generate_cert(
        name="Santhosh", 
        email="santhosh@example.com", 
        role="Python Developer Intern", 
        start_date="2024-01-01", 
        end_date="2024-03-01"
    )
