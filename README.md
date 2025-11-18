# Calculator (frontend + backend)

Simple calculator demo that uses an Express backend to perform binary operations and a small static frontend.

Getting started

1. Open a terminal and change to the project folder:

   cd "c:\Users\dell\OneDrive\Desktop\calculator"

2. Install dependencies and start the server:

   npm install
   npm start

3. Open http://localhost:3000 in your browser.

API

POST /api/calc
Request JSON: { op: 'add'|'sub'|'mul'|'div'|'pow', a: number, b: number }
Response: { result: number }

Notes

- The frontend also contains a small client-side expression evaluator for quick one-off expressions.
- This demo is intentionally small and educational. Do not expose the client-side evaluator to untrusted inputs in production.
 
Fallback behavior

- If the backend server is not available (for example, Node/npm isn't installed), the frontend will automatically fall back to performing binary operations locally in the browser. This lets you use the calculator UI without running the Express server.

Quick demo (no Node required)

- Open `public/simple.html` in your browser (double-click or `File → Open` in your browser). This is a self-contained calculator built only with HTML/CSS/JS — no server or install required.

