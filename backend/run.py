# run.py
import subprocess, sys, os

if __name__ == "__main__":
    is_dev = os.getenv("APP_ENV", "development") == "development"
    cmd = [
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", "8000",
    ]
    if is_dev:
        cmd.append("--reload")
    subprocess.run(cmd)