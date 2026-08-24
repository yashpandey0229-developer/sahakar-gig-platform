# 🚀 SahakarGig Deployment & MongoDB Atlas Setup Guide
### Step-by-Step Production Cloud Deployment for Hackathon & Live Production

This guide covers how to set up a **free cloud MongoDB Atlas database** and deploy your full-stack application to **Render**, **Vercel**, or **Railway** in under 10 minutes.

---

## 🍃 Part 1: Free MongoDB Atlas Cloud Database Setup (3 Minutes)

1. **Sign up for Free**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. **Create a Free Shared Cluster**:
   - Select the **M0 Free Tier** (512MB free storage forever).
   - Select cloud provider (AWS / Google Cloud) and region closest to India (e.g. *ap-south-1 Mumbai*).
3. **Set Database Access**:
   - Create a database user with username (e.g. `sahakarAdmin`) and password.
4. **Set Network Access (IP Whitelist)**:
   - Go to **Network Access** → Click **Add IP Address** → Choose **"Allow Access from Anywhere" (`0.0.0.0/0`)** so your cloud server can connect.
5. **Get Connection String**:
   - Click **Connect** → Choose **"Drivers" (Node.js)**.
   - Copy the URI:
     ```
     mongodb+srv://sahakarAdmin:<password>@cluster0.abcde.mongodb.net/sahakargig?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.

---

## ☁️ Part 2: One-Click Deployment on Render (Recommended Full-Stack)

Render natively runs both your Node.js Express backend and React frontend together.

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SahakarGig platform with MongoDB"
   git branch -M main
   git remote add origin https://github.com/your-username/sahakar-gig-platform.git
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) → **New Web Service** → Connect your GitHub repository.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
4. Add Environment Variables under **Environment**:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string from Part 1*
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
5. Click **Deploy Web Service**! Render will build the frontend, start Express, and seed MongoDB automatically.

---

## ⚡ Part 3: Deploying on Vercel

If deploying frontend to Vercel:
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Build Command: `npm run build`
3. Output Directory: `dist`

---

## 🛠️ Part 4: Local Full-Stack Development

To run both Frontend (Vite on port 3000) and Backend (Express on port 5000) simultaneously:

```bash
# Run both frontend and backend
npm run dev:all
```

Or run separately:
- Terminal 1: `npm run dev` (Vite Frontend at `http://localhost:3000`)
- Terminal 2: `npm run server` (Express Backend + MongoDB at `http://localhost:5000`)
