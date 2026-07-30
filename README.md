<div align="center">

<img src="docs/images/logo.png" alt="Ciel" width="80" />

# Ciel

**Multi-Agent AI Platform**

One conversation. Eight specialized AI agents. Powered by LangGraph.

[**Live Demo →**](https://dwi6z47ows1mt.cloudfront.net)&nbsp;&nbsp;·&nbsp;&nbsp;[**API**](https://d27rpohugccw7u.cloudfront.net)&nbsp;&nbsp;·&nbsp;&nbsp;[**Docs**](docs/)&nbsp;&nbsp;·&nbsp;&nbsp;[**Architecture**](docs/Architecture.md)

<br />

![Node](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![LangGraph](https://img.shields.io/badge/LangGraph-1.4-FF6B35?style=flat-square)
![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20S3%20%7C%20CloudFront-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

</div>

---

<div align="center">

<!-- Replace with actual screenshot -->
<img src="docs/images/screenshot.png" alt="Ciel Chat Interface" width="900" />

</div>

---

## What is Ciel?

Most AI assistants send every request to a single general-purpose model.

Ciel routes each request to the right specialist. A coding question goes to DeepSeek. An image generation request goes through a cinematic prompt pipeline. A PDF question triggers a full RAG pipeline with Qdrant vector search. A live news query hits Tavily search before the LLM ever sees it.

The router is a LangGraph `StateGraph`. Every agent is a node. The graph decides the path.

---

## Agents

<table>
<tr>
<td width="50%">

**🧠 Auto Router**
LangGraph LLM router. Reads conversation history and current prompt. Selects the best agent automatically. Explicit selection always overrides.

</td>
<td width="50%">

**💬 Chat**
General conversation, Q&A, summarization, math, translation.
`Groq` · Redis memory (20 msg / 24h TTL)

</td>
</tr>
<tr>
<td>

**💻 Coding**
Intent-classified. Generates full `HTML/CSS/JS` projects rendered in Monaco editor with live preview, or streams markdown for reviews, debugging, and explanations.
`DeepSeek via OpenRouter` · SSE streaming

</td>
<td>

**🎨 Vision**
Text-to-image generation. Groq engineers a cinematic prompt → Pollinations renders → S3 stores → signed URL returned.
`Groq + Pollinations` · SSE streaming

</td>
</tr>
<tr>
<td>

**🖼 Image Analyzer**
Upload any image. Ask any question. Answers grounded strictly in the image content.
`Gemini 2.5 Flash` · Auto-routed on image upload

</td>
<td>

**📄 PDF Generator**
Prompt → structured JSON → pdfkit renders → S3 upload → download link.
`Groq + pdfkit` · 24h signed URL

</td>
</tr>
<tr>
<td>

**📊 PPT Generator**
Prompt → structured JSON → pptxgenjs renders → S3 upload → `.pptx` download.
`Groq + pptxgenjs` · 24h signed URL

</td>
<td>

**🔍 Search**
Live web results via Tavily injected into chat context before LLM responds.
`Tavily + Groq` · Real-time grounding

</td>
</tr>
<tr>
<td colspan="2">

**📚 PDF RAG**
Upload a PDF. Ask questions. pdf-parse extracts text → chunked (1000/200) → embedded with `gemini-embedding-001` → stored in Qdrant → top-5 similarity search → Groq answers strictly from the document.
Auto-routed on PDF upload.

</td>
</tr>
</table>

---

## Architecture

```mermaid
flowchart TD
    Browser["🌐 Browser\nReact 19 + Redux"] -->|HTTPS| CF["☁️ CloudFront CDN"]
    CF -->|Proxy| GW["🔀 API Gateway\nExpress 5 · Auth · CORS · x-user-id"]
    GW --> Redis1["🔴 Redis\nSessions · 7d TTL"]
    GW -->|/api/agent| Agent["⚙️ Agent Service"]
    GW -->|/api/auth| Auth["🔐 Auth Service\nFirebase Admin"]
    GW -->|/api/chat| Chat["💬 Chat Service\nMongoDB"]
    GW -->|/api/billing| Billing["💳 Billing Service\nRazorpay"]

    Agent --> LG["🕸 LangGraph Router\nStateGraph"]

    LG --> ChatA["chat"]
    LG --> CodingA["coding"]
    LG --> VisionA["vision"]
    LG --> PDFA["pdf"]
    LG --> PPTA["ppt"]
    LG --> SearchA["search"]
    LG --> RagA["pdfRag"]
    LG --> ImgA["imageAnalyzer"]

    SearchA --> ChatA
    ChatA --> Groq["Groq LLM"]
    CodingA --> DS["DeepSeek\nOpenRouter"]
    VisionA --> Groq
    PDFA --> Groq
    PPTA --> Groq
    ImgA --> Gemini["Gemini 2.5 Flash"]
    RagA --> Qdrant["Qdrant\nVector DB"]
    RagA --> Groq

    VisionA --> S3["AWS S3"]
    PDFA --> S3
    PPTA --> S3

    Agent --> Redis2["🔴 Redis\nMemory · Rate Limits"]
    Agent --> MongoDB["🍃 MongoDB"]
```

---

## Engineering Decisions

**Why LangGraph instead of a plain if/else router?**
LangGraph models the agent pipeline as a directed graph with typed state. Adding a new agent is one `addNode` + one `addEdge`. The state flows through every node without manual passing. Conditional edges handle routing declaratively.

**Why SSE instead of WebSockets?**
The coding and vision agents can run for 60–120 seconds. AWS ALB has a hard 60s idle timeout. SSE lets the server push bytes continuously — each token chunk resets the ALB timer. A `setInterval` heartbeat every 15s acts as a safety net. WebSockets would require a separate upgrade path and NLB configuration.

**Why an API Gateway service?**
All five backend services are internal. The gateway is the only public surface. It validates the session cookie, injects `x-user-id` into every proxied request, and centralizes CORS. No service trusts the client directly.

**Why Redis for session storage instead of JWTs?**
Sessions can be invalidated instantly by deleting the Redis key. JWTs cannot be revoked without a blocklist — which is just Redis anyway. Redis also stores conversation memory (last 20 messages, 24h TTL) and per-user rate limit counters, so the infrastructure is already there.

**Why Qdrant for PDF RAG instead of in-memory vectors?**
Qdrant is a purpose-built vector database with HNSW indexing. In-memory approaches don't survive process restarts and don't scale. Qdrant runs as a separate service and can be swapped for Qdrant Cloud with one env var change.

**Why ECS Fargate instead of EC2?**
No instance management. Each service scales independently. The CI/CD pipeline fires `update-service` for all five services in parallel background processes — total deploy time is bounded by the slowest single service, not the sum.

**Why path-based CI/CD?**
`dorny/paths-filter` detects which service directories changed. A frontend-only commit never rebuilds any backend Docker image. A chat service change never triggers an agent rebuild. This keeps CI fast and ECR pull costs low.

---

## Tech Stack

**Frontend**

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Monaco](https://img.shields.io/badge/Monaco_Editor-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)

**Backend**

![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

**AI / Orchestration**

![LangGraph](https://img.shields.io/badge/LangGraph-FF6B35?style=flat-square)
![Groq](https://img.shields.io/badge/Groq-F55036?style=flat-square)
![DeepSeek](https://img.shields.io/badge/DeepSeek-4D6BFE?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-FF3366?style=flat-square)
![Tavily](https://img.shields.io/badge/Tavily_Search-00B4D8?style=flat-square)

**Cloud / DevOps**

![ECS](https://img.shields.io/badge/ECS_Fargate-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![S3](https://img.shields.io/badge/S3-569A31?style=flat-square&logo=amazons3&logoColor=white)
![CloudFront](https://img.shields.io/badge/CloudFront-8C4FFF?style=flat-square&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

---

## System Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant GW as Gateway
    participant AG as Agent Service
    participant LG as LangGraph
    participant LLM as LLM
    participant ST as Storage

    U->>FE: types prompt
    FE->>GW: POST /api/agent/chat/stream (SSE)
    GW->>GW: validate session cookie
    GW->>AG: proxy + inject x-user-id
    AG->>AG: flushHeaders() → ALB timer reset
    AG->>LG: graph.invoke(state)
    LG->>LG: router selects agent
    LG->>LLM: invoke / stream
    LLM-->>AG: token chunks
    AG-->>FE: SSE: ": generating" (heartbeat)
    AG-->>FE: SSE: data: {text, artifacts, images}
    AG-->>FE: SSE: data: [DONE]
    AG->>ST: save to MongoDB + Redis
    FE->>FE: dispatch to Redux → render
```

---

## Project Structure

```
Ciel/
├── .github/workflows/deploy.yml   # Path-filtered parallel CI/CD
├── backend/
│   ├── gateway/                   # Auth middleware, reverse proxy, CORS
│   ├── shared/redis/              # Shared Redis client
│   └── services/
│       ├── auth/                  # Firebase verify, sessions, credits
│       ├── billing/               # Razorpay orders + verification
│       ├── chat/                  # Conversation + message persistence
│       └── agent/
│           ├── agents/            # 8 agent implementations
│           ├── graph/             # LangGraph state, router, compiled graph
│           ├── config/            # LLMs, embeddings, Redis, S3, rate limits
│           └── util/              # S3, PDF/PPT generators, credit deduction
└── frontend/src/
    ├── component/                 # Chat UI, Artifact panel, Sidebar, Billing
    ├── pages/landing/             # Hero, Features, Pricing, FAQ, Workflow
    ├── redux/                     # conversationSlice, messageSlice, userSlice
    └── features/                  # API wrappers
```

---

## Getting Started

**Prerequisites:** Node.js 18+, Docker, MongoDB, Redis, Qdrant, Firebase project, AWS account, Groq / OpenRouter / Google AI / Tavily / Razorpay API keys.

```bash
# 1. Clone
git clone <your-repo-url> && cd Ciel

# 2. Start Redis locally
cd backend && docker compose up -d && cd ..

# 3. Install all services
for dir in backend/gateway backend/services/auth backend/services/billing \
           backend/services/chat backend/services/agent frontend; do
  (cd $dir && npm install)
done

# 4. Add .env files — see docs/Environment.md

# 5. Run (six terminals)
cd backend/gateway          && npm run dev   # :3000
cd backend/services/auth    && npm run dev   # :3001
cd backend/services/chat    && npm run dev   # :3002
cd backend/services/billing && npm run dev   # :3004
cd backend/services/agent   && npm run dev   # :3003
cd frontend                 && npm run dev   # :5173
```

> Full environment variable reference → [`docs/Environment.md`](docs/Environment.md)
>
> Full API reference → [`docs/API.md`](docs/API.md)

---

## Deployment

| Layer | Service |
|---|---|
| Frontend | S3 + CloudFront |
| Backend | ECS Fargate — one task per service |
| Registry | ECR — one repo per service |
| Database | MongoDB Atlas |
| Cache | Redis (ElastiCache or external) |
| Vectors | Qdrant Cloud |
| Files | S3 |

Push to `main` → GitHub Actions detects changed paths → builds only affected services in parallel → deploys all 5 ECS services simultaneously.

Full deployment guide → [`docs/Deployment.md`](docs/Deployment.md)

---

## Performance

| Optimization | Detail |
|---|---|
| SSE + ALB heartbeat | Token chunks reset ALB's 60s idle timer. `setInterval` every 15s as safety net. |
| Redis conversation cache | Last 20 messages cached per conversation, 24h TTL. No MongoDB read on every turn. |
| Context window trimming | Only last 6 messages injected into LLM prompt. Keeps latency and cost low. |
| Per-user rate limiting | Redis sliding window counters per agent. Enforced before any LLM call. |
| Docker layer cache | `type=gha` GHA cache. `npm install` layer reused when only source files change. |
| Path-based CI | `dorny/paths-filter` — unchanged services never rebuild or redeploy. |
| Parallel ECS deploy | All 5 `update-service` calls fire as bash background processes simultaneously. |
| S3 signed URLs | 24h expiry. No public bucket. Files served directly from S3, not through the API. |

---

## Roadmap

- [ ] Streaming for PDF and PPT agents
- [ ] Persistent Qdrant collections per user (multi-session PDF RAG)
- [ ] WebSocket upgrade path
- [ ] Conversation search in sidebar
- [ ] Multi-file upload
- [ ] Token usage tracking per conversation
- [ ] Admin usage dashboard
- [ ] Integration test suite for gateway and agent routes

---

## Contributing

1. Branch from `main`.
2. Preserve service boundaries — gateway, auth, chat, billing, agent stay separated.
3. New agent? Update `graph.js`, `router.js`, `state.js`, `llmModels.js`, `agentlimit.js`, and this README.
4. `npm run lint && npm run build` before opening a PR.

---

## License

MIT © [TANMAY KUMAR]

---

<div align="center">

[Live Demo](https://dwi6z47ows1mt.cloudfront.net) · [API](https://d27rpohugccw7u.cloudfront.net) · [Docs](docs/) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>
