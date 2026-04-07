import pandas as pd
import requests
import json
from datetime import date

def verify_upload():
    # 1. Create a dummy Excel file with the new 'Department' column
    df = pd.DataFrame([
        {
            "Student_ID": "22IT101",
            "Student_Name": "Test Student",
            "Department": "IT",
            "Year": "III Year",
            "Section": "B",
            "Subject_Code": "IT8801",
            "Date": date.today().isoformat(),
            "Status": "present"
        }
    ])
    
    filename = "verify_upload_dept.xlsx"
    df.to_excel(filename, index=False)
    print(f"Created test file: {filename}")

    # 2. Get auth token
    base_url = "http://localhost:8000/api"
    login_payload = {"email": "admin@vsbec.edu.in", "password": "admin123"}
    try:
        r = requests.post(f"{base_url}/auth/login", json=login_payload)
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 3. Upload the file
        files = {'file': open(filename, 'rb')}
        r = requests.post(f"{base_url}/upload/attendance", headers=headers, files=files)
        print("Upload Result:", r.json())
        
        # 4. Verify summary recomputation
        r = requests.get(f"{base_url}/attendance/section?department=IT&year=III+Year&section=B&range=today", headers=headers)
        print("Dashboard Section Result:", json.dumps(r.json(), indent=2))
        
    except Exception as e:
        print("Verification failed:", e)

if __name__ == "__main__":
    verify_upload()
