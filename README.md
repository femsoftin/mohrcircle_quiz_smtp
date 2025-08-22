# Mohr’s Circle Quiz (Node.js + Express + Nodemailer)

A 20-question Mohr’s Circle (2D & 3D) quiz served by Express. On submission, the server emails results (user email, score, answers).

## Quick Start (Local)
```bash
npm install
cp .env.example .env
# edit .env with your SMTP + email credentials
npm start
# open http://localhost:3000
```

## Environment Variables
See `.env.example`. For Gmail:
- Create an **App Password** (Google Account → Security → App passwords) and use it as `EMAIL_PASS`.
- Keep `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`.

## Deploy Free (Replit)
1. Create a new **Node.js Repl**.
2. Upload all files/folders from this project.
3. In **Secrets (Environment Variables)** add:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
   - `EMAIL_USER`, `EMAIL_PASS`
   - `RECEIVER_EMAIL` (optional)
4. Click **Run** → open the web URL.

## Deploy (Render)
1. Push this folder to a GitHub repo.
2. On Render.com → **New +** → **Web Service** → connect the repo.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add the environment variables.
6. Deploy.

## Deploy (Railway)
1. Create a new project → **Deploy from GitHub**.
2. Add environment variables under **Variables**.
3. Deploy.

## Security Notes
- Never commit real credentials to Git.
- Use environment variables on the host.
- Frontend only sends email + score; SMTP credentials stay server-side.
