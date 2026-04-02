# Research Agent

A full-stack AI research assistant powered by LangChain, LangGraph, and Ollama. It searches the web, Wikipedia, and arXiv to answer research questions with cited sources — all through a clean React UI.

## Project Flow

![Project Flow Diagram](docs/flow-diagram.png)

---

## Project Structure

```
Research_Agent/
├── Backend/          # FastAPI server + LangChain agent
│   ├── api.py        # Main FastAPI app + /chat + /health endpoints
│   ├── auth.py       # JWT auth — register, login, /me
│   ├── .env          # Environment variables
│   └── pyproject.toml
│
└── Frontend/         # React + Vite + Tailwind UI
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── components/   # Sidebar, TopBar, ChatMessage, etc.
    │   ├── context/      # AuthContext (JWT storage)
    │   └── pages/        # AuthPage (login + signup)
    └── vite.config.ts
```

---

## Features

- AI research agent with web search, Wikipedia, and arXiv tools
- Streaming responses via Server-Sent Events (SSE)
- Per-tool enable/disable toggles in the UI
- Session history with conversation memory (SQLite checkpointing)
- JWT-based authentication (register + login)
- Research starter cards for quick topic exploration

---

## Prerequisites

- [Python 3.14+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/) — Python package manager
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/) running locally with your model pulled

---

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Research_Agent
```

### 2. Backend

```bash
cd Backend
uv sync
```

Configure `.env`:

```env
MODEL_NAME=your-ollama-model-name
TEMPERATURE=0.7
CHECKPOINT_DB=research_research.db
AUTH_DB=auth.db
JWT_SECRET=your-secret-key-here
```

Start the backend:

```bash
uv run uvicorn api:app --reload --port 8000
```

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Backend health check |
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Sign in, returns JWT |
| GET | `/auth/me` | Yes | Current user info |
| POST | `/chat` | Yes | Stream agent response (SSE) |

### Chat request body

```json
{
  "message": "What is quantum entanglement?",
  "thread_id": "session-123",
  "tool_permissions": {
    "web_search": true,
    "wikipedia": true,
    "Arxiv": true
  }
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Ollama (local) via `langchain-ollama` |
| Agent | LangChain + LangGraph |
| Memory | SQLite via `langgraph-checkpoint-sqlite` |
| Backend | FastAPI + Uvicorn |
| Auth | JWT (`python-jose`) + bcrypt |
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Search tools | DuckDuckGo, Wikipedia, arXiv |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MODEL_NAME` | Ollama model name | — |
| `TEMPERATURE` | LLM temperature | `0.7` |
| `CHECKPOINT_DB` | SQLite file for conversation memory | `research_research.db` |
| `AUTH_DB` | SQLite file for user accounts | `auth.db` |
| `JWT_SECRET` | Secret key for signing JWTs | — |
