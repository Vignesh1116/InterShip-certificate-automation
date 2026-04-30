from passlib.context import CryptContext
import jwt, datetime

SECRET = "secret"

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p):
    # Bcrypt has a 72-character limit
    return pwd.hash(p[:72])

def verify_password(p, h):
    return pwd.verify(p, h)

def create_token(data):
    data["exp"] = datetime.datetime.utcnow() + datetime.timedelta(hours=5)
    return jwt.encode(data, SECRET, algorithm="HS256")