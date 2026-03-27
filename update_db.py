import sqlite3
import os

db_path = 'd:/ChurnSense/churnsense.db'
if os.path.exists(db_path):
    print("Connecting to DB:", db_path)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Try adding the email column
    try:
        cursor.execute("ALTER TABLE customers ADD COLUMN email VARCHAR;")
        conn.commit()
        print("Successfully added 'email' column to SQLite.")
    except Exception as e:
        print("Column 'email' already exists or error:", e)
    
    # Update the names and emails of the top 2 customers explicitly so the UI reads them immediately
    try:
        cursor.execute("UPDATE customers SET email = 'jayantmv25@gmail.com', customer_name = 'Jayant M V' WHERE customer_id = 'CUST-0001';")
        cursor.execute("UPDATE customers SET email = 'jayaprasath0911@gmail.com', customer_name = 'Jayaprasath M' WHERE customer_id = 'CUST-0002';")
        conn.commit()
        print("Successfully seeded Jayant and Jayaprasath into the live database.")
    except Exception as e:
        print("Error updating records:", e)
        
    conn.close()
else:
    print("Database file not found at", db_path)
