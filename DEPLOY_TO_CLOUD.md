# 🚀 SahakarGig: Live Deployment Guide (Vercel + Render)

This guide walks you through deploying **SahakarGig** for free on **Vercel** (Frontend) and **Render** (Backend API + MongoDB Atlas).

---

## 📋 Pre-Requisites Checklist:
1. **GitHub Account**: [github.com](https://github.com)
2. **Render Account**: [render.com](https://render.com) (Free)
3. **Vercel Account**: [vercel.com](https://vercel.com) (Free)

---

## 🛠️ Step 1: Push Code to GitHub

Open **PowerShell** or **Command Prompt** and run:

```powershell
cd C:\Users\pande\Desktop\sahakar-gig-platform

# 1. Initialize git
git init
git add .
git commit -m "Initial commit of SahakarGig platform"

# 2. Create a new repository on GitHub (e.g. 'sahakar-gig-platform')
# Then link and push:
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sahakar-gig-platform.git
git push -u origin main
```

---

## 🌐 Step 2: Deploy Backend to Render (5 Minutes)

1. Go to [dashboard.render.com](https://dashboard.render.com) and click **"New +" ➔ "Web Service"**.
2. Connect your GitHub repository: `sahakar-gig-platform`.
3. Fill in the following settings:
   - **Name**: `sahakargig-backend`
   - **Root Directory**: `backend` *(Very Important!)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **"Environment Variables"**, add:
   - **`MONGODB_URI`**: `mongodb+srv://<username>:<password>@cluster0.wb1e7sn.mongodb.net/sahakargig?retryWrites=true&w=majority`
   - **`PORT`**: `5000`
5. Click **"Deploy Web Service"**.
6. Once deployed, Render will give you a public URL (e.g., `https://sahakargig-backend.onrender.com`).
   - Test it by opening: `https://sahakargig-backend.onrender.com/api/health`

---

## ⚡ Step 3: Deploy Frontend to Vercel (2 Minutes)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository: `sahakar-gig-platform`.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `frontend` *(Very Important!)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **"Environment Variables"**, add:
   - **`VITE_API_URL`**: `https://sahakargig-backend.onrender.com/api` *(Put your Render URL here)*
5. Click **"Deploy"**!

🎉 Your platform is now **100% Live on the Internet** with SSL (HTTPS), MongoDB Atlas AWS Mumbai cluster, and global CDN!
