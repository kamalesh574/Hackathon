import subprocess
import time
import sys
import os

def run():
    print("Starting ChurnSense Premium SaaS Platform (React Edition)...")
    
    # Resolve project root and venv paths
    root_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.join(root_dir, ".venv", "Scripts", "python.exe")
    
    # Fallback to system python if venv not found
    python_cmd = venv_python if os.path.exists(venv_python) else sys.executable
    print(f"Using Python: {python_cmd}")
    
    # 1. Start Backend (FastAPI)
    print("Starting Backend API (FastAPI) on port 8000...")
    backend_process = subprocess.Popen(
        [python_cmd, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=root_dir
    )
    
    # Wait for backend to initialize
    time.sleep(4)
    
    # 2. Start Frontend (React via Vite)
    print("Starting Frontend Dashboard (React/Vite) on port 5173...")
    frontend_dir = os.path.join(root_dir, "frontend_react")
    
    try:
        # Use shell=True for npm commands on Windows
        subprocess.run(["npm", "run", "dev"], cwd=frontend_dir, shell=True)
    except KeyboardInterrupt:
        print("\nShutting down platform...")
    finally:
        backend_process.terminate()

if __name__ == "__main__":
    run()
