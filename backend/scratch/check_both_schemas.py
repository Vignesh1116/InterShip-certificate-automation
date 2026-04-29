import sqlite3

def check_schema(path):
    print(f"Checking schema for {path}")
    conn = sqlite3.connect(path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("Columns in 'users' table:")
    for col in columns:
        print(f"- {col[1]} ({col[2]})")
    conn.close()

if __name__ == "__main__":
    check_schema('test.db')
    check_schema('backend/test.db')
