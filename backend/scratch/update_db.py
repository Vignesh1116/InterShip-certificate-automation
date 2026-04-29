import sqlite3

try:
    conn = sqlite3.connect('test.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN start_date VARCHAR;")
    cursor.execute("ALTER TABLE users ADD COLUMN end_date VARCHAR;")
    conn.commit()
    conn.close()
    print("Successfully added start_date and end_date to users table.")
except Exception as e:
    print("Error:", e)
