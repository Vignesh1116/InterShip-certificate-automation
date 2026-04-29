import os
import sys

# Add backend to path
sys.path.append(os.path.abspath("backend"))

from backend.database import DATABASE_URL, BASE_DIR

print(f"BASE_DIR: {BASE_DIR}")
print(f"DATABASE_URL: {DATABASE_URL}")
print(f"CWD: {os.getcwd()}")
