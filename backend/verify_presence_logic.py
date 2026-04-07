import pandas as pd
import requests
import json
from datetime import date, timedelta

def verify_presence_only():
    base_url = "http://localhost:8000/api"
    login_payload = {"email": "admin@vsbec.edu.in", "password": "admin123"}
    
    try:
        r = requests.post(f"{base_url}/auth/login", json=login_payload)
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Create a Day 1 Excel (Students A and B are BOTH present)
        # Columns: Student_ID, Department, Year, Section, Date
        day1 = date.today() - timedelta(days=1)
        day2 = date.today()
        
        df1 = pd.DataFrame([
            {"Student_ID": "STUD-A", "Department": "IT", "Year": "III Year", "Section": "B", "Date": day1.isoformat()},
            {"Student_ID": "STUD-B", "Department": "IT", "Year": "III Year", "Section": "B", "Date": day1.isoformat()}
        ])
        
        # 2. Create a Day 2 Excel (Only Student A is present, B is ABSENT because they aren't in the file)
        df2 = pd.DataFrame([
            {"Student_ID": "STUD-A", "Department": "IT", "Year": "III Year", "Section": "B", "Date": day2.isoformat()}
        ])
        
        df1.to_excel("verify_day1.xlsx", index=False)
        df2.to_excel("verify_day2.xlsx", index=False)

        # 3. Upload both
        print("Uploading Day 1...")
        requests.post(f"{base_url}/upload/attendance", headers=headers, files={'file': open('verify_day1.xlsx', 'rb')})
        print("Uploading Day 2...")
        requests.post(f"{base_url}/upload/attendance", headers=headers, files={'file': open('verify_day2.xlsx', 'rb')})

        # 4. Fetch results
        # We expect:
        # Day 1 and Day 2 are unique. Total = 2.
        # STUD-A: 2 appearances / 2 dates = 100%
        # STUD-B: 1 appearance / 2 dates = 50%
        
        r = requests.get(f"{base_url}/attendance/section?department=IT&year=III+Year&section=B", headers=headers)
        print("Summary Result:", json.dumps(r.json(), indent=2))
        
        # Also check individual student for STUD-B
        # Wait, the summary API returns section-level. Let's find STUD-B.
        # Actually, let's look at the overview which calculates based on blended.
        
    except Exception as e:
        print("Verification failed:", e)

if __name__ == "__main__":
    verify_presence_only()
