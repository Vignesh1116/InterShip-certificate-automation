import sqlite3
import os

def fix_schema(path):
    if not os.path.exists(path):
        print(f"File {path} does not exist.")
        return
    
    print(f"Checking/Fixing schema for {path}")
    conn = sqlite3.connect(path)
    cursor = conn.cursor()
    
    # Check current columns
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    
    added = False
    if 'start_date' not in columns:
        print(f"Adding start_date to {path}")
        cursor.execute("ALTER TABLE users ADD COLUMN start_date VARCHAR")
        added = True
    
    if 'end_date' not in columns:
        print(f"Adding end_date to {path}")
        cursor.execute("ALTER TABLE users ADD COLUMN end_date VARCHAR")
        added = True
    
    if added:
        conn.commit()
        print(f"Schema fixed for {path}")
    else:
        print(f"Schema already correct for {path}")
    
    conn.close()

if __name__ == "__main__":
    fix_schema('test.db')
    fix_schema('backend/test.db')
