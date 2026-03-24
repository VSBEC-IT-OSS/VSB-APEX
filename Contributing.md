# 🤖 Contributing Guide: Using AI to Build VSB-APEX

This guide explains **how to use AI effectively as a developer teammate** to complete issues in this project — even if you are a beginner.

The goal:

> Each team member should be able to **complete 1 issue per day** using AI assistance.

---

# 🚀 Overall Workflow (Simple View)

1. Get assigned an issue
2. Download + prepare codebase
3. Give code + issue to AI (Claude)
4. Generate solution
5. Apply changes locally
6. Test properly
7. Push to your fork
8. Create Pull Request
9. Admin reviews, tests, merges

---

# 🧩 STEP 1 — Get Your Task

* Go to GitHub Issues
* Pick or get assigned **ONE issue only**
* Read it fully:

  * Scope
  * Expected outcome
  * Acceptance criteria

👉 Do NOT start coding without understanding the issue.

---

# 📦 STEP 2 — Get the Codebase Ready

You need to give the **entire project context** to AI.

## Option A: Download ZIP (Simple)

1. Go to repo
2. Click **Code → Download ZIP**
3. Extract it

---

## Option B: Use Repomix (Recommended for AI)

Repomix converts your repo into **one clean text file**.

### Install:

```bash
npm install -g repomix
```

### Run inside project:

```bash
repomix
```

This generates:

```
repomix-output.txt
```

👉 This file = FULL project context for AI

---

# 🧠 STEP 3 — Use Claude (Free Tier)

Go to:
👉 https://claude.ai

---

## 🔑 IMPORTANT: How to Prompt AI Correctly

### ❌ BAD PROMPT

> fix this issue

### ✅ GOOD PROMPT

Paste:

```
This is my full project codebase:
[paste repomix-output.txt]

This is the issue I need to solve:
[paste issue content]

Instructions:
- Give exact file changes
- Mention file paths
- Write complete code (not partial)
- Do not skip anything
```

---

## 💡 Pro Tips

* If output is too big:

  * Ask: “split into backend and frontend changes”
* If confused:

  * Ask: “explain before coding”
* If error:

  * Paste error → ask fix

---

# 🛠 STEP 4 — Apply Code Changes

Now manually update your project.

### Rules:

* Follow exact file paths from AI
* Do NOT randomly create files
* Do NOT break existing structure

---

## 🧪 STEP 5 — Test Locally (VERY IMPORTANT)

Before pushing:

### Backend:

```bash
uvicorn main:app --reload
```

### Frontend:

```bash
npm install
npm run dev
```

---

## ✅ Test Checklist

* No crashes
* API works
* UI loads properly
* Feature works as per issue
* No console errors

---

# 🍴 STEP 6 — Fork + Push

## First Time Only:

1. Click **Fork** on GitHub
2. Clone your fork:

```bash
git clone <your-fork-url>
```

---

## Create Branch

```bash
git checkout -b feature/issue-name
```

---

## Add + Commit

```bash
git add .
git commit -m "feat: completed issue - student dashboard part 1"
```

---

## Push

```bash
git push origin feature/issue-name
```

---

# 🔁 STEP 7 — Create Pull Request (PR)

1. Go to your fork
2. Click **Compare & Pull Request**
3. Add:

### Title:

```
feat: <issue title>
```

### Description:

* What you implemented
* What files changed
* How to test

---

# 👨‍💼 FOR REPO ADMIN (VERY IMPORTANT)

You must **strictly control quality**.

---

## 🔍 STEP 1 — Review PR

Check:

* Does it match the issue?
* Any unnecessary file changes?
* Code structure clean?

---

## 🧪 STEP 2 — Test the PR LOCALLY

### Pull PR branch:

```bash
git fetch origin pull/<PR_NUMBER>/head:test-branch
git checkout test-branch
```

---

### Run Project:

Backend:

```bash
uvicorn main:app --reload
```

Frontend:

```bash
npm run dev
```

---

## ✅ Test Checklist (Admin)

* Feature works correctly
* No existing features broken
* No duplicate logic
* No hardcoded values
* API responses correct

---

## ⚠️ Reject PR if:

* Code breaks app
* Feature incomplete
* Bad structure
* Random files added
* No proper testing

---

## ✅ Merge PR if:

* Clean implementation
* Matches issue
* Fully tested
* No conflicts

---

# 🔀 Handling Multiple PRs (Important)

When many PRs exist:

### Rules:

1. Merge **small PRs first**
2. Avoid merging conflicting features together
3. Pull latest main before testing each PR:

```bash
git checkout main
git pull origin main
```

---

## 🔥 Conflict Handling

If PR shows conflict:

* Ask contributor to:

```bash
git pull origin main
git resolve conflicts
git push again
```

---

# 📁 File Structure Discipline

### DO:

* Follow existing folders
* Use service-based logic
* Keep code modular

### DO NOT:

* Create random folders
* Mix frontend/backend logic
* Duplicate existing code

---

# ⚡ Daily Workflow Expectation

Each member:

* 1 Issue per day
* Use AI properly
* Test properly
* Submit PR

---

# 🧠 Final Advice

### AI is your assistant, NOT your brain

* Always review AI output
* Understand what you paste
* Debug yourself first

---

# 🏁 Goal

If followed correctly:

* Team of 5 → 5 issues/day
* 30+ issues/week
* Full system built **fast + clean**

---

Stay consistent. Build smart. 🚀
