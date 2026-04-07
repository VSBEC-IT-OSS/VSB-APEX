import pandas as pd
import requests
import json

def verify_all_simplified():
    base_url = "http://localhost:8000/api"
    login_payload = {"email": "admin@vsbec.edu.in", "password": "admin123"}
    
    try:
        r = requests.post(f"{base_url}/auth/login", json=login_payload)
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Test Results (Simplified: No Is_Pass)
        df_res = pd.DataFrame([
            {
                "Student_ID": "RES-001", "Department": "IT", "Year": "III Year", "Section": "B", 
                "Semester": 5, "Subject_Code": "IT8501", "Total_Marks": 85
            },
            {
                "Student_ID": "RES-002", "Department": "IT", "Year": "III Year", "Section": "B", 
                "Semester": 5, "Subject_Code": "IT8501", "Total_Marks": 40
            }
        ])
        df_res.to_excel("verify_res.xlsx", index=False)
        print("Uploading Results...")
        r_res = requests.post(f"{base_url}/upload/results", headers=headers, files={'file': open('verify_res.xlsx', 'rb')})
        print("Results Result:", r_res.json())

        # 2. Test Internal (Simplified)
        df_int = pd.DataFrame([
            {
                "Student_ID": "INT-001", "Department": "IT", "Year": "III Year", "Section": "B", 
                "Subject_Code": "IT8501", "Test_Number": 1, "Marks_Scored": 45
            }
        ])
        df_int.to_excel("verify_int.xlsx", index=False)
        print("Uploading Internal Test...")
        r_int = requests.post(f"{base_url}/upload/internal", headers=headers, files={'file': open('verify_int.xlsx', 'rb')})
        print("Internal Result:", r_int.json())

    except Exception as e:
        print("Verification failed:", e)

if __name__ == "__main__":
    verify_all_simplified()
