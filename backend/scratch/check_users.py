import sqlite3
import os

db_path = "test.db"
if not os.path.exists(db_path):
    print(f"{db_path} does not exist.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    conn.close()
