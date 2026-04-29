# 📜 Magizh Technologies — Internship Management & Certification Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green.svg)
![React](https://img.shields.io/badge/Frontend-React-blue.svg)
![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)

A premium, enterprise-grade platform designed for Magizh Technologies to streamline intern registration, track internship progress, and issue professional, secure certificates with QR-based verification.

---

## ✨ Key Features

- 👤 **Admin Dashboard**: Centralized management for student registration and tracking.
- 🆔 **Intern ID Generation**: Automatically assigns unique identifiers to every intern.
- 📊 **Live Analytics**: Real-time stats on total students, ongoing internships, and completions.
- 📜 **Official Certification**: Generate professional PDF certificates with a single click.
- 🔍 **QR Verification**: Built-in verification system allowing anyone to scan and validate certificates instantly.
- 🔒 **Secure Admin Portal**: Restricted access for management tasks using secure credentials.
- 📱 **Responsive Design**: Fully optimized for both desktop and mobile devices.

---

## 🛠️ Technology Stack

### **Frontend**
- **React.js**: Modern component-based architecture.
- **Vanilla CSS**: Custom premium design system with glassmorphism and smooth animations.
- **Axios**: Secure API communication.
- **Lucide Icons**: Professional SVG iconography.

### **Backend**
- **FastAPI**: High-performance Python web framework.
- **SQLAlchemy**: Powerful ORM for database management.
- **SQLite**: Reliable local database storage.
- **JWT (JSON Web Tokens)**: Secure administrative authentication.
- **FPDF & QRCode**: Dynamic document generation.

---

## 🚀 Getting Started

### **Prerequisites**
- Python 3.8+
- Node.js 16+
- npm or yarn

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/internship-platform.git
cd internship-platform
```

### **2. Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend will be running at `http://localhost:8000`*

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
npm start
```
*The dashboard will be available at `http://localhost:3000`*

---

## 🔐 Admin Credentials
For the initial setup, the following administrative credentials are pre-configured:
- **Email:** `admin@gmail.com`
- **Password:** `admin@123`

---

## 📁 Project Structure

```text
├── backend/            # FastAPI Server & Database
│   ├── main.py         # Entry point
│   ├── models.py       # DB Schema
│   └── test.db         # Local Database
├── frontend/           # React Dashboard
│   ├── src/            # Components & Pages
│   └── public/         # Static assets
└── certificates/       # Storage for generated documents
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
