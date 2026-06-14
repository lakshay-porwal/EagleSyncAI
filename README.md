# EagleSyncAI 🚀

> **Autonomous AI-Agentic Career Intelligence Platform**

EagleSyncAI is a premium, state-of-the-art SaaS platform designed to streamline skill auditing, personalized roadmap creation, mock evaluations, placement matches, and automatic applications. Powered by **Google Gemini 3.5**, EagleSyncAI leverages a closed-loop multi-agent architecture to keep your career trajectory in sync.

---

## 🤖 Core Feature Suite

### 1. Multi-Agent Closed-Loop Orchestration
An interconnected agent ecosystem running in the background, emitting live terminal log streams to the client via Socket.io:
*   **Capability Agent**: Evaluates user profiles and AST programming skill levels to calculate readiness vectors.
*   **Roadmap Agent**: Generates custom week-by-week learning syllabus matching target duration, commitment intensity, and learning style.
*   **Career Agent**: Projects role matching matrices against recruitment benchmarks.
*   **Progress Agent**: Evaluates mock evaluations history to compute study velocity, score trends, and identify learning gaps.
*   **Interview Agent**: Conducts mock evaluations, scores responses, and provides actionable feedback.
*   **Auto-Apply Agent**: Scans open listings and automatically applies to matching positions.

### 2. Interactive Roadmaps
*   **On-Demand Customized Syllabus**: Spawns the Roadmap Agent using custom parameters (1, 2, 3, or 6 months duration; Light/Moderate/Intensive study speed; Practical or Theoretical styles).
*   **Progress Auditing**: Interactive checklists for checking off weekly milestone tasks, updating completion metrics in real time.

### 3. AI Mentor Chat (Gemini 3.5)
*   **Context-Aware Dialogues**: Chat with a dedicated co-pilot specializing in DSA, System Design, Frontend/React, Backend/Node.js, or JEE/NEET prep.
*   **High-Availability Fallback**: Active rule-based backup prompts in case of network failures or API limitations.

### 4. Mock Interview Hub
*   **Interactive Evaluations**: Conducts mock exams for Technical SDE rounds or JEE/NEET subjects.
*   **Score & Skill Blend Feedback**: Returns detailed score percentages, named suggestions, and automatically feeds the performance score back to update your skill matrix (closed-loop).

### 5. Automated Placements Radar
*   **Recruiter Matching**: Searches and ranks open internships, jobs, hackathons, and certifications.
*   **Auto-Apply**: Spawns the background agent to apply to multiple matching positions.

### 6. WhatsApp status updates
*   **Bulletins on WhatsApp**: Dispatches progress bulletins directly to the user's mobile device.
*   **Status Toggles**: Manage notification triggers on the System Settings page.

---

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, Framer Motion, Axios, Socket.io-client.
*   **Backend**: Node.js, Express, Socket.io, Mongoose (MongoDB), `@google/genai` (Gemini 3.5 Flash).
*   **Integrations**: Twilio WhatsApp API (optional fallback mode included).

---

## 🚀 Installation & Local Run

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Atlas or Local)
*   Google Gemini API Key

### 1. Setup Backend Server
1. Navigate to the `server` directory:
    ```bash
    cd server
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file based on the template:
    ```bash
    cp .env.example .env
    ```
    *Open the `.env` file and configure your `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.*
4. Start the server in development mode:
    ```bash
    npm run dev
    ```
    *The server will run on `http://localhost:5000`.*

### 2. Setup Frontend Application
1. Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *The frontend will run on `http://localhost:5173`.*

---

## ⚙️ Configuration (.env template)
Refer to [server/.env.example](file:///d:/Downloads/EagleSyncAI-main/EagleSyncAI-main/server/.env.example) for setting up server configuration variables.
