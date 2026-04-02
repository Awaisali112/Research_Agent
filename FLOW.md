# Project Flow

## Auth Flow

```
User visits app
  → Not logged in → AuthPage (Login / Signup)
      → POST /auth/register or /auth/login
          → JWT token returned → stored in localStorage
              → App loads
```

## Chat Flow

```
User types a query
  → SearchInput → App.tsx calls streamChat()
      → POST /api/chat  (JWT in Authorization header)
          → FastAPI verifies token
              → LangChain agent picks tools based on query
                  ├── web_search  (DuckDuckGo)
                  ├── wikipedia
                  └── arxiv
              → Streams SSE chunks back
          → Frontend renders chunks in real-time
              → Final response shown in ChatMessage
```

## Tool Permission Flow

```
User toggles tool in Sidebar
  → ToolPermissions state updates in App.tsx
      → Passed into every /chat request body
          → Backend blocks or allows each tool per request
```

## Session / Memory Flow

```
New session created (manual or auto on first message)
  → Unique thread_id generated
      → Sent with every /chat request
          → LangGraph SQLite checkpointer stores conversation per thread
              → Agent has full context of prior messages in that session
```

## Data Storage

```
auth.db              → user accounts (name, email, hashed password)
research_research.db → conversation memory per session (LangGraph checkpoints)
```
