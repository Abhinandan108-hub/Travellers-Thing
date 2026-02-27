# Git Setup for GitHub

## Step 1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 2: Create Repository on GitHub
1. Go to https://github.com/new
2. Create a new repository (e.g., "travellers-thing")
3. Do NOT initialize with README, .gitignore, or license (we have them)

## Step 3: Connect Local to Remote
```bash
git remote add origin https://github.com/your-username/travellers-thing.git
git branch -M main
git push -u origin main
```

## Step 4: Verify .gitignore is working
```bash
# Check what will be pushed
git status

# Should NOT show:
# - node_modules/
# - .env
# - dist/
# - .vscode/
```

## Important Notes:
- ✅ .env files are IGNORED (won't be pushed)
- ✅ node_modules/ are IGNORED (won't be pushed)
- ✅ .env.example files ARE pushed (so others know what env vars are needed)
- ✅ Build folders (dist/) are IGNORED

## For Development Setup
When someone clones your repo, they need to:

### Backend:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

---

## Sensitive Data NOT to commit:
- .env files (database passwords, API keys, secrets)
- node_modules/ (can be reinstalled from package.json)
- dist/ & build/ (can be rebuilt)
- .vscode/ (personal IDE settings)
- logs/
- Any files with credentials or API keys
