# 🚀 How to Set Up ChurnSense from GitHub (No Import Errors!)

When you download your code from GitHub and open it on a new computer, VS Code will show `import pandas` or `import numpy` errors because the new computer doesn't have those packages installed in the project. 

The correct professional practice is to create a **Python Virtual Environment (`venv`)**. A `venv` acts as an isolated container specifically for your project so that you don't mess up the global system Python.

Follow these exact steps from inside VS Code after downloading the project:

### Step 1: Open the Terminal in VS Code
1. Open the **ChurnSense** folder in VS Code.
2. Go to the top menu: **Terminal > New Terminal** (or press `` Ctrl + ` ``).

### Step 2: Create the Virtual Environment
Run this exact command in the terminal to create a virtual environment folder named `venv`:

```bash
python -m venv venv
```
*(Wait a few seconds. You will see a new folder named `venv` appear on the left side in your project files).*

### Step 3: Activate the Virtual Environment
You must activate the `venv` so VS Code knows to use it. Run this command:

**On Windows (Command Prompt or PowerShell):**
```bash
.\venv\Scripts\activate
```

**On Mac / Linux (if a judge asks):**
```bash
source venv/bin/activate
```

*(You will know it worked because you will see `(venv)` colored in green at the very beginning of your terminal prompt line).*

### Step 4: Tell VS Code to use the `venv`
Sometimes VS Code still shows yellow squiggly lines until you tell the IDE to look at the `venv`.
1. Press **Ctrl + Shift + P** (Windows) to open the Command Palette.
2. Type and select: **Python: Select Interpreter**
3. Select the option that says: **`Python 3.x.x ('venv': venv)`** (It should have a star ⭐ next to it).

### Step 5: Install all Requirements
Now that you are inside the active virtual environment, install the AI and Backend libraries using the `requirements.txt` file I created for you. Run this command:

```bash
cd backend
pip install -r requirements.txt
```

*(Watch it download pandas, numpy, scikit-learn, fastapi, etc. It might take 1-2 minutes).*

### Step 6: Start the Project!
Everything is now perfectly configured. 
You can start the backend by navigating to the backend folder and running:

```bash
uvicorn main:app --reload
```

And in a **second terminal** (split terminal), start the React frontend:
```bash
cd frontend_react
npm install
npm run dev
```

### ✅ That's it! No more import errors.
