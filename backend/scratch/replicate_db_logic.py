import os

# Replicate logic from backend/database.py
# __file__ in backend/database.py would be equivalent to:
database_py_path = os.path.join(os.getcwd(), 'backend', 'database.py')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(database_py_path)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'test.db')}"

print(f"Evaluated BASE_DIR: {BASE_DIR}")
print(f"Evaluated DATABASE_URL: {DATABASE_URL}")
print(f"Root test.db path: {os.path.join(os.getcwd(), 'test.db')}")
