#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine, Base
from backend import models, auth

def main():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if users already exist
    existing_users = db.query(models.User).all()
    
    print("\n" + "="*70)
    print("🎯 INTERNSHIP CERTIFICATE SYSTEM - DATABASE SETUP")
    print("="*70 + "\n")
    
    if existing_users:
        print(f"✅ Database already has {len(existing_users)} users\n")
        for i, user in enumerate(existing_users, 1):
            print(f"{i}. {user.name} ({user.email})")
            print(f"   └─ User ID: {user.id}, Role: {user.role}\n")
    else:
        print("📝 Creating 5 test users...\n")
        
        test_users = [
            {
                "name": "Alice Johnson",
                "email": "alice@example.com",
                "password": "password123",
                "role": "Junior Developer",
                "internship_id": "INT-2024-001"
            },
            {
                "name": "Bob Smith",
                "email": "bob@example.com",
                "password": "password123",
                "role": "UI/UX Designer",
                "internship_id": "INT-2024-002"
            },
            {
                "name": "Charlie Davis",
                "email": "charlie@example.com",
                "password": "password123",
                "role": "Data Analyst",
                "internship_id": "INT-2024-003"
            },
            {
                "name": "Diana Martinez",
                "email": "diana@example.com",
                "password": "password123",
                "role": "QA Engineer",
                "internship_id": "INT-2024-004"
            },
            {
                "name": "Eve Wilson",
                "email": "eve@example.com",
                "password": "password123",
                "role": "DevOps Engineer",
                "internship_id": "INT-2024-005"
            }
        ]
        
        for user_data in test_users:
            user = models.User(
                name=user_data["name"],
                email=user_data["email"],
                password=auth.hash_password(user_data["password"]),
                role=user_data["role"],
                internship_id=user_data["internship_id"]
            )
            db.add(user)
        
        db.commit()
        
        print("="*70)
        print("🎉 TEST USERS CREATED SUCCESSFULLY!")
        print("="*70 + "\n")
        
        users = db.query(models.User).all()
        for i, user in enumerate(users, 1):
            print(f"{i}. {user.name}")
            print(f"   ├─ User ID: {user.id}")
            print(f"   ├─ Email: {user.email}")
            print(f"   ├─ Role: {user.role}")
            print(f"   └─ Password: password123\n")
    
    print("="*70)
    print("📚 QUICK START GUIDE")
    print("="*70)
    print("\n1️⃣  LOGIN ENDPOINT (POST /login)")
    print("   Email: alice@example.com")
    print("   Password: password123")
    print("   → Returns: JWT Token with User ID\n")
    
    print("2️⃣  GENERATE CERTIFICATE (POST /generate/{user_id})")
    print("   User ID: 1 (from login response)")
    print("   Role: Junior Developer")
    print("   Start Date: 2024-01-01")
    print("   End Date: 2024-12-31")
    print("   → Returns: PDF Certificate\n")
    
    print("3️⃣  FRONTEND")
    print("   React App running on http://localhost:3000")
    print("   Backend API on http://localhost:8000\n")
    
    print("="*70 + "\n")
    
    db.close()

if __name__ == "__main__":
    main()
