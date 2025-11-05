# 🖥️ Tana Teachings — Frontend

Professional, responsive, and scalable frontend for the **Tana Teachings** platform, built with **React (Vite)**, **Tailwind CSS**, and reusable components for clean UI and fast development.

For a deeper architecture and component reference, see DOCS.md.

---

## Features

- Fully responsive layout (desktop & mobile)
- Clean UI with Tailwind CSS
- Reusable components structure (Navbar, HeroSection, HowItWorks, Footer)
- Organized folder system for scalability
- Integration-ready setup for backend APIs

---

## Quickstart (Local)

### Clone Repo

```bash
git clone https://github.com/Abik1221/Tana_teachings.git
cd Tana_teachings/frontend
Switch to Your Branch

git checkout mast-branch
Install Dependencies

npm install
Run Development Server

npm run dev
Open in browser: http://localhost:5173/



Scripts
Command	Description
npm run dev	Start local development server
npm run build	Build production-ready app
npm run preview	Preview production build locally

Development Workflow
Work on your branch only:

bash
Copy code
git checkout mast-branch
Update branch with latest main:


git pull origin main
Commit & push changes:


git add .
git commit -m "Your message"
git push origin mast-branch
Create PR on GitHub (base = main, compare = your branch) for review.

Key Components
Component	Description
Navbar.jsx	Top navigation bar with responsive toggle
HeroSection.jsx	Landing section introducing the platform
HowItWorks.jsx	Step-by-step process explanation
Footer.jsx	Contact & social links section
App.jsx	Root wrapper connecting all pages

Sample Flows (PowerShell)
Start dev server and open app:


cd Tana_teachings/frontend
npm run dev
Start-Process "http://localhost:5173/"



Troubleshooting


npm install errors: ensure Node.js & npm are installed and network is stable.

Dev server not starting: check port 5173 is free.

Styling issues: rebuild Tailwind cache with npx tailwindcss -o ./dist/output.css --watch.




© 2025 Tana Teachings — All Rights Reserved.

```
