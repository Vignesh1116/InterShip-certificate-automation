#!/usr/bin/env python3
"""
Database Seeding Script - Creates test users for the certificate system
"""
from .database import SessionLocal, engine, Base
from . import models, auth
import sys

def seed_database():
    """Create tables and add test users"""
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
    
    db = SessionLocal()
    
    # Check if users already exist
    existing_users = db.query(models.User).all()
    if existing_users:
        print(f"⚠️  Database already has {len(existing_users)} users. Skipping seed...")
        db.close()
        return
    
    # Test users data
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
    
    print("\n" + "="*60)
    print("🌱 SEEDING DATABASE WITH TEST USERS")
    print("="*60)
    
    created_users = []
    
    for user_data in test_users:
        user = models.User(
            name=user_data["name"],
            email=user_data["email"],
            password=auth.hash_password(user_data["password"]),
            role=user_data["role"],
            internship_id=user_data["internship_id"]
        )
        db.add(user)
        db.flush()  # Get the ID immediately
        created_users.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "internship_id": user.internship_id,
            "password": user_data["password"]  # Show password only during seed
        })
    
    db.commit()
    
    print("\n✅ Successfully created 5 test users:\n")
    
    for user in created_users:
        print(f"┌─ User ID: {user['id']}")
        print(f"├─ Name: {user['name']}")
        print(f"├─ Email: {user['email']}")
        print(f"├─ Role: {user['role']}")
        print(f"├─ Password: {user['password']}")
        print(f"└─ Internship ID: {user['internship_id']}\n")
    
    print("="*60)
    print("📋 HOW TO USE:")
    print("="*60)
    print("\n1. LOGIN using any of the email/password combinations above")
    print("2. LOGIN ENDPOINT: POST /login")
    print("   - email: alice@example.com")
    print("   - password: password123")
    print("\n3. GENERATE CERTIFICATE: POST /generate/{user_id}")
    print("   - user_id: Use the ID from above (1, 2, 3, 4, or 5)")
    print("   - role: Junior Developer (or any role)")
    print("   - start_date: 2024-01-01")
    print("   - end_date: 2024-12-31")
    print("\n" + "="*60 + "\n")
    
    db.close()

if __name__ == "__main__":
    seed_database()
