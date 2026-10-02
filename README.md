<<<<<<< HEAD
# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8sm6282ej0n5

# Welcome to Your Miaoda Project

## Project Info

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

## Run the complete local system

The complete Windows startup launches the React frontend and all local backend
services:

```powershell
cd D:\J.A.R.V.I.S\app-8sm6282ej0n5
npm install
python -m pip install -r requirements.txt
python -m pip install -r "D:\J.A.R.V.I.S\SYSTEM CONTROL ON VOICE\Jarvis\requirements.txt"
npm run start:all
```

Open `http://127.0.0.1:5173`.

The launcher starts these services:

| Service | Port | Health check |
| --- | ---: | --- |
| React/Vite frontend | 5173 | `http://127.0.0.1:5173` |
| J.A.R.V.I.S unified gateway | 8000 | `http://127.0.0.1:8000/health` |
| Zevorix LLM/RAG FastAPI | 8001 | `http://127.0.0.1:8001/health` |
| IoT device FastAPI | 8010 | `http://127.0.0.1:8010/health` |

The Vite frontend connects to the services through these development proxy
paths:

- `/jarvis` -> gateway `8000`
- `/zevorix` -> Zevorix `8001`
- `/iot` -> IoT API `8010`

To start each process manually, see
[`docs/RUN_LOCAL.md`](docs/RUN_LOCAL.md). To use the repository launcher,
run `D:\J.A.R.V.I.S\START_JARVIS.bat`.

### How to develop backend services?

Configure environment variables and install relevant dependencies.If you need to use a database, please use the official version of Supabase.

## Learn More

You can also check the help documentation: Download and Building the app（ [https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en](https://intl.cloud.baidu.com/en/doc/MIAODA/s/download-and-building-the-app-en)）to learn more detailed content.
=======
# J.A.R.V.I.S.-The-Agent-
The AI Agent
>>>>>>> 7297e82f1af08239bde8c3cf91d1b2897f1da866
