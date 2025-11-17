# DistroChess3 — Nuxt 3 + MongoDB scaffold

This folder contains a minimal Nuxt 3 project scaffold and a tiny server API backed by MongoDB.

Quick start (Windows PowerShell):

```powershell
cd c:\Users\mad\git\distrochess3
npm install
copy .env.example .env
# edit .env to set MONGODB_URI and MONGODB_DB
npm run dev
```

Files added:

- `package.json` — scripts and dependencies (`nuxt`, `mongodb`)
- `nuxt.config.ts` — runtime config reads `MONGODB_URI` / `MONGODB_DB`
- `pages/index.vue` — simple UI to list/create games
- `components/ChessBoard.vue` — placeholder board
- `server/utils/mongo.ts` — MongoDB connection helper
- `server/api/games.get.ts` and `server/api/games.post.ts` — simple game endpoints

Notes:

- The server code expects `MONGODB_URI` and `MONGODB_DB` available as environment variables. On Windows, put them in a `.env` file or set them in PowerShell before running.
- This is a starting point — you can expand models, validation, and UI as needed.
