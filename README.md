# 🚀 DecisionKiller

> Stop Overthinking. Decide.

DecisionKiller is a structured decision intelligence engine that transforms ambiguity into quantified clarity using weighted logic, personalized profiling, and bias-aware modeling — all visualized through an interactive dashboard.

---

## 🧠 Problem Statement

Most people do not struggle due to lack of information — they struggle due to indecision.

Traditional AI tools provide conversational advice, but they do not:
- Enforce structured thinking
- Quantify trade-offs
- Model personal constraints
- Visualize clarity
- Convert decisions into execution protocols

DecisionKiller solves this gap.

---

## 🎯 What DecisionKiller Does

1. Accepts a dilemma (e.g., *Machine Learning vs Cloud Architecture*)
2. Collects structured personal inputs:
   - Skill level
   - DSA strength
   - Math comfort
   - Financial pressure
   - Work style
3. Sends structured profile to AI via secure backend proxy
4. Receives strict JSON output
5. Applies clarity modeling
6. Displays:
   - Clarity Edge (%)
   - Dimensional analysis
   - Risk level
   - Cognitive bias check
   - 7-step execution protocol

---

## 🔥 Key Features

### ✅ Structured Decision Modeling
No open-ended chat. Users provide measurable variables that feed a weighted analysis engine.

### ✅ Quantified Clarity Edge
Generates a percentage-based clarity score showing which path is stronger under given constraints.

### ✅ Dimensional Trade-off Analysis
Compares options across:
- Time to Competence
- Income Potential
- Difficulty
- Risk Level
- Long-Term Growth

### ✅ Cognitive Bias Detection
Identifies potential psychological traps influencing hesitation.

### ✅ Execution Protocol
Generates a structured 7-step roadmap for the recommended path.

### ✅ Hybrid Intelligence Architecture
- Primary: Gemini LLM (via secure Node.js proxy)
- Fallback: Deterministic local engine if API fails
- Fully resilient system

---

## 🏗 Architecture

### Frontend
- React + Vite
- Glassmorphism UI
- Dynamic state-driven rendering
- Fully responsive

### Backend
- Node.js + Express
- Secure API proxy
- Environment-based API key management
- Strict JSON enforcement

### AI Layer
- Gemini 2.5 Flash
- System-enforced structured JSON output
- Deterministic fallback logic

---

## 🔐 Security

- API key stored in `.env`
- Never exposed to frontend
- Backend proxy architecture
- Graceful API failure handling

---

## 🚀 How It’s Different from ChatGPT

ChatGPT is conversational and open-ended.

DecisionKiller is:

- Structured
- Constraint-driven
- Quantitative
- Profile-based
- Visualization-focused
- Execution-oriented

ChatGPT gives advice.
DecisionKiller models trade-offs and converts them into measurable clarity.

---

## 🛠 Setup Instructions

### 1. Install Dependencies

Frontend:
```bash
npm install
npm run dev

## Backend
cd server
npm install
node server.js
