# Ciel

**One interface. Eight specialized AI agents.**

Ciel is a full-stack, production-deployed AI platform that routes every user request to the right specialist instead of forcing a single model to do everything. It supports general conversation, coding assistance, live web search, PDF generation, PowerPoint generation, PDF question-answering with RAG, image generation, and image analysis — all inside a single chat interface with streaming responses, credit-based access control, and persistent conversation history.

---

## Live Demo

| | |
|---|---|
| **Frontend** | [dwi6z47ows1mt.cloudfront.net](https://dwi6z47ows1mt.cloudfront.net) |
| **Backend API** | [d27rpohugccw7u.cloudfront.net](https://d27rpohugccw7u.cloudfront.net) |
| **Demo Video** | `<ADD_VIDEO_LINK>` |

> Screenshots: see [`docs/images/`](docs/images/) — add your own after deployment.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Available Agents](#available-agents)
- [System Workflow](#system-workflow)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Performance](#performance)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### AI Capabilities
- **Intent-aware routing** — LangGraph router classifies every prompt and dispatches to the correct agent
- **Chat agent** — conversational AI with Redis-backed memory (last 20 messages, 24h TTL)
- **Coding agent** — intent-classified: generates full HTML/CSS/JS projects or returns markdown explanations, reviews, and optimizations via token streaming
- **Vision agent** — converts a text prompt into a cinematic image via Pollinations, stores it in S3, returns a signed URL
- **Image analyzer** — reads an uploaded image as base64 and answers questions using Gemini
- **PDF generator** — produces structured PDFs from a prompt using pdfkit, stored in S3
- **PPT generator** — produces multi-slide PowerPoint files from a prompt using pptxgenjs, stored in S3
- **Search agent** — fetches live web results via Tavily and feeds them into the chat response
- **PDF RAG** — chunks an uploaded PDF, embeds with `gemini-embedding-001`, stores in Qdrant, retrieves top-5 chunks, answers grounded questions

### User Experience
- Google Sign-In via Firebase
- Persistent conversation history with rename support
- Markdown rendering with GFM, syntax highlighting, and copy-to-clipboard
- Artifact panel — Monaco editor with live preview for generated HTML/CSS/JS projects
- Image lightbox for generated and analyzed images
- File attachment (PDF or image) from the chat composer
- Voice input via Web Speech API
- Credit balance display and in-app upgrade flow (Razorpay)
- Responsive layout

### Engineering
- SSE streaming with ALB heartbeat — eliminates 504 timeouts on long-running agents
- LangGraph `StateGraph` orchestration with conditional routing
- Redis session store (7-day TTL) and conversation memory cache
- Per-user, per-agent rate limiting enforced in Redis (sliding 60s window)
- API gateway centralizes auth, CORS, and request enrichment (`x-user-id` injection)
- Path-based CI/CD — only changed services are rebuilt and redeployed
- Docker layer caching via GitHub Actions GHA cache

---

## Architecture

```
User / Browser
      │
      ▼
React Frontend (CloudFront / S3)
      │
      ▼
API Gateway (Express)  ──── Redis (sessions)
      │
      ├── /api/auth   ──► Auth Service   ──► MongoDB  ◄── Firebase Admin
      ├── /api/chat   ──► Chat Service   ──► MongoDB
      ├── /api/billing ─► Billing Service ─► MongoDB  ◄── Razorpay
      └── /api/agent  ──► Agent Service
                              │
                         LangGraph Router
                              │
              ┌───────────────┼───────────────┐
              │               │               │
           chat            coding          vision
           search           pdf             ppt
           pdfRag       imageAnalyzer
              │               │               │
           Groq LLM     DeepSeek (OpenRouter)  Gemini
              │
         ┌────┴────┐
       Redis     Qdrant     AWS S3     Tavily
     (memory)  (vectors)  (files)    (search)
```

```mermaid
flowchart TD
  START([start]) --> ROUTER[router]
  ROUTER --> CHAT[chat]
  ROUTER --> CODING[coding]
  ROUTER --> VISION[vision]
  ROUTER --> PDF[pdf]
  ROUTER --> PPT[ppt]
  ROUTER --> SEARCH[search]
  ROUTER --> PDFRAG[pdfRag]
  ROUTER --> IMG[imageAnalyzer]
  SEARCH --> CHAT
  CHAT --> END([end])
  CODING --> END
  VISION --> END
  PDF --> END
  PPT --> END
  PDFRAG --> END
  IMG --> END
```

---

## Tech Stack

### Frontend
| Package | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool |
| Redux Toolkit | Global state (conversations, messages, user) |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Styling |
| @monaco-editor/react | Code editor in artifact panel |
| react-markdown + remark-gfm | Markdown rendering |
| react-syntax-highlighter | Code block highlighting |
| motion | Animations |
| GSAP | Landing page animations |
| lucide-react | Icons |
| Firebase | Google Sign-In |
| axios | HTTP client |

### Backend
| Package | Purpose |
|---|---|
| Node.js 22 | Runtime |
| Express 5 | HTTP framework (ESM) |
| express-http-proxy | Gateway reverse proxy |
| morgan | Request logging |
| multer | File upload handling |
| cookie-parser | Session cookie parsing |

### AI / Orchestration
| Package | Purpose |
|---|---|
| @langchain/langgraph | Agent graph orchestration |
| @langchain/groq | Groq LLM (chat, search, vision prompt, pdf, ppt, router) |
| @langchain/openrouter (DeepSeek) | Coding agent LLM |
| @langchain/google-genai (Gemini 2.5 Flash) | Image analysis |
| @langchain/google-genai (gemini-embedding-001) | PDF chunk embeddings |
| @langchain/tavily | Live web search |
| @langchain/qdrant | Vector store for PDF RAG |
| @langchain/textsplitters | Recursive character text splitter |
| pdf-parse | PDF text extraction |
| pdfkit | PDF generation |
| pptxgenjs | PowerPoint generation |

### Data & Infrastructure
| Service | Purpose |
|---|---|
| MongoDB | Conversations, messages, users, payments |
| Redis | Sessions, conversation memory cache, rate limiting |
| Qdrant | Vector embeddings for PDF RAG |
| AWS S3 | Generated PDF, PPT, and image file storage |
| AWS CloudFront | Frontend CDN + backend API distribution |
| AWS ECS (Fargate) | Container hosting for all backend services |
| AWS ECR | Docker image registry |
| Firebase Auth | Google Sign-In |
| Razorpay | Payment processing |

---

## Project Structure

```
Ciel/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Parallelized CI/CD — path-filtered, 5 ECS services
├── backend/
│   ├── docker-compose.yml          # Redis for local development
│   ├── gateway/                    # Public entry point — auth middleware, proxy routing
│   └── services/
│       ├── auth/                   # Firebase token verification, sessions, credit management
│       ├── billing/                # Razorpay order creation and payment verification
│       ├── chat/                   # Conversation and message persistence
│       └── agent/
│           ├── agents/             # One file per agent (chat, coding, vision, pdf, ppt, search, pdfRag, imageAnalyzer)
│           ├── config/             # LLM models, embeddings, vector DB, memory, rate limits, multer, S3
│           ├── graph/              # LangGraph state, router, compiled graph
│           ├── util/               # S3 upload/download, PDF/PPT generators, credit deduction, message helpers
│           ├── controller/         # agent (axios route) + agentStream (SSE route)
│           └── route/              # POST /chat and POST /chat/stream
├── backend/shared/
│   └── redis/redis.js              # Shared Redis client
└── frontend/
    └── src/
        ├── component/              # ChatArea, Chatinput, MessageBubble, Messagelist, Artifact, Sidebar, Nav, BillingDrawer
        ├── features/               # API wrappers (sendMessage, createConversation, getMessages, etc.)
        ├── pages/
        │   ├── landing/            # Hero, Features, Pricing, FAQ, Workflow, ScrollBand, Footer
        │   └── Home.jsx            # Authenticated chat shell
        ├── redux/                  # conversationSlice, messageSlice, userSlice, store
        ├── ui/                     # Reusable UI primitives (Button, Orb, ScrollVelocity)
        └── utils/                  # axios instance, Firebase client
```

---

## Available Agents

### Auto
The default mode. The LangGraph router reads the conversation history and the current prompt, then selects the best agent automatically. Explicit agent selection always overrides it.

### Chat
- **Purpose**: General conversation, explanations, Q&A, summarization, translation, math
- **Input**: Text prompt
- **Output**: Markdown or plain text
- **LLM**: Groq (`openai/gpt-oss-120b`)
- **Memory**: Last 20 messages from Redis, rehydrates last 6 into the model context

### Coding
- **Purpose**: Software development assistance
- **Input**: Text prompt (optionally referencing conversation history)
- **Output (CODE_GENERATION)**: JSON artifact with `index.html`, `style.css`, `script.js` — rendered in Monaco editor with live preview
- **Output (other intents)**: Streamed markdown — code review, explanation, debugging, optimization, documentation
- **LLM**: DeepSeek via OpenRouter
- **Streaming**: Token-by-token SSE with ALB heartbeat

### Vision
- **Purpose**: AI image generation
- **Input**: Text description
- **Output**: Generated image rendered inline + S3 signed download URL (24h expiry)
- **Pipeline**: Groq generates a cinematic prompt → Pollinations renders the image → uploaded to S3
- **Streaming**: SSE route (image download + S3 upload can exceed 60s)

### Image Analyzer
- **Purpose**: Answer questions about an uploaded image
- **Input**: Image file (any `image/*`) + text question
- **Output**: Markdown answer grounded in the image
- **LLM**: Gemini 2.5 Flash (multimodal)
- **Routing**: Triggered automatically when an image file is attached

### PDF Generator
- **Purpose**: Generate a structured PDF document from a prompt
- **Input**: Text prompt
- **Output**: Formatted PDF stored in S3, download link in chat (24h expiry)
- **Pipeline**: Groq generates structured JSON → pdfkit renders → S3 upload

### PPT Generator
- **Purpose**: Generate a PowerPoint presentation from a prompt
- **Input**: Text prompt
- **Output**: `.pptx` file stored in S3, download link in chat (24h expiry)
- **Pipeline**: Groq generates structured JSON → pptxgenjs renders → S3 upload

### Search
- **Purpose**: Answer questions requiring current or live information
- **Input**: Text prompt
- **Output**: Chat response grounded in live Tavily search results
- **Pipeline**: Tavily fetches results → results injected into chat agent context → Groq responds

### PDF RAG
- **Purpose**: Answer questions about an uploaded PDF
- **Input**: PDF file + text question
- **Output**: Answer grounded strictly in the PDF content
- **Pipeline**: pdf-parse extracts text → RecursiveCharacterTextSplitter (1000 chars / 200 overlap) → `gemini-embedding-001` embeds chunks → stored in Qdrant → top-5 similarity search → Groq answers
- **Routing**: Triggered automatically when a PDF file is attached

---

## System Workflow

```
User types a prompt
        │
        ▼
Chatinput.jsx — selects transport:
  coding / auto / vision → SSE fetch (/api/agent/chat/stream)
  all others             → axios POST (/api/agent/chat)
        │
        ▼
Gateway — validates session cookie → injects x-user-id → proxies request
        │
        ▼
agentStream controller:
  1. flushHeaders() immediately (resets ALB 60s idle timer)
  2. setInterval heartbeat every 15s (safety net)
  3. saves user message to MongoDB + Redis
  4. graph.invoke({ prompt, conversationId, agent, userId, streamRes })
        │
        ▼
LangGraph Router:
  explicit agent?  → pass through
  PDF attached?    → pdfRag
  image attached?  → imageAnalyzer
  otherwise        → LLM classifies intent → selects agent
        │
        ▼
Selected Agent executes
  (LLM call / S3 upload / Qdrant search / Tavily fetch)
        │
        ▼
agentStream controller:
  sends final SSE event: { text, artifacts, images }
  sends [DONE]
  saves assistant message to MongoDB + Redis
        │
        ▼
Frontend SSE parser:
  extracts text, artifacts, images
  dispatches addMessage + setArtifacts to Redux
        │
        ▼
MessageBubble renders text + images
Artifact panel renders code files + live preview
```

---

## Installation

### Prerequisites

- Node.js 18+
- Docker (for Redis)
- MongoDB connection string
- Redis instance
- Qdrant instance
- Firebase project with Google Auth enabled
- AWS account (S3 bucket + IAM credentials)
- Razorpay account
- Groq API key
- OpenRouter API key (DeepSeek access)
- Google Generative AI API key
- Tavily API key

### 1. Clone

```bash
git clone <your-repo-url>
cd Ciel
```

### 2. Start Redis

```bash
cd backend
docker compose up -d
```

### 3. Install dependencies

```bash
cd backend/gateway          && npm install && cd ../..
cd backend/services/auth    && npm install && cd ../../..
cd backend/services/billing && npm install && cd ../../..
cd backend/services/chat    && npm install && cd ../../..
cd backend/services/agent   && npm install && cd ../../..
cd frontend                 && npm install && cd ..
```

### 4. Add environment files

See [Environment Variables](#environment-variables) below.

### 5. Run all services

Open six terminals:

```bash
# Terminal 1
cd backend/gateway && npm run dev

# Terminal 2
cd backend/services/auth && npm run dev

# Terminal 3
cd backend/services/chat && npm run dev

# Terminal 4
cd backend/services/billing && npm run dev

# Terminal 5
cd backend/services/agent && npm run dev

# Terminal 6
cd frontend && npm run dev
```

Frontend: `http://localhost:5173`  
Gateway: `http://localhost:3000`

---

## Environment Variables

### `backend/gateway/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3000` | Gateway port |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service base URL |
| `CHAT_SERVICE_URL` | `http://localhost:3002` | Chat service base URL |
| `AGENT_SERVICE_URL` | `http://localhost:3003` | Agent service base URL |
| `BILLING_SERVICE_URL` | `http://localhost:3004` | Billing service base URL |

### `backend/services/auth/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3001` | Auth service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-auth` | MongoDB connection |
| `REDIS_URL` | `redis://localhost:8081` | Redis connection |

### `backend/services/chat/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3002` | Chat service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-chat` | MongoDB connection |

### `backend/services/billing/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3004` | Billing service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-billing` | MongoDB connection |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service base URL |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | `<secret>` | Razorpay key secret |

### `backend/services/agent/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3003` | Agent service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-agent` | MongoDB connection |
| `REDIS_URL` | `redis://localhost:8081` | Redis connection |
| `CHAT_SERVICE_URL` | `http://localhost:3002` | Chat service base URL |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service base URL |
| `AWS_REGION` | `ap-south-1` | S3 region |
| `AWS_ACCESS_KEY_ID` | `<key>` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | `<secret>` | IAM secret key |
| `AWS_BUCKET_NAME` | `your-bucket` | S3 bucket name |
| `GROQ_API_KEY` | `gsk_...` | Groq API key |
| `GOOGLE_API_KEY` | `AIza...` | Google Generative AI key |
| `QDRANT_URL` | `http://localhost:6333` | Qdrant instance URL |
| `QDRANT_API_KEY` | `<key>` | Qdrant API key |
| `TAVILY_API_KEY` | `tvly-...` | Tavily search API key |

### `frontend/.env`

| Variable | Example | Description |
|---|---|---|
| `VITE_SERVER_URL` | `http://localhost:3000` | Gateway base URL |
| `VITE_FIREBASE_API_KEY` | `AIza...` | Firebase web API key |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay key ID (client) |

---

## API Reference

All routes go through the gateway at port `3000`. Protected routes require a valid `session` cookie.

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | No | Gateway health check |
| `GET` | `/api/me` | Yes | Return current session user |
| `POST` | `/api/auth/login` | No | Verify Firebase token, create session |
| `GET` | `/api/auth/logout` | Yes | Destroy session |
| `POST` | `/api/auth/update-plan` | Internal | Update user plan and credits |
| `POST` | `/api/auth/deduct-credits` | Internal | Deduct credits for an agent call |
| `GET` | `/api/chat/create-conversation` | Yes | Create a new conversation |
| `GET` | `/api/chat/get-conversations` | Yes | List all conversations for the user |
| `POST` | `/api/chat/update-conversation` | Yes | Rename a conversation |
| `POST` | `/api/chat/save-message` | Yes | Persist a message with optional artifacts and images |
| `GET` | `/api/chat/get-messages/:conversationId` | Yes | Load messages for a conversation |
| `POST` | `/api/agent/chat` | Yes | Blocking agent route (multipart — for file uploads) |
| `POST` | `/api/agent/chat/stream` | Yes | SSE streaming route (JSON — coding, vision, auto) |
| `POST` | `/api/billing/create-order` | Yes | Create a Razorpay order |
| `POST` | `/api/billing/verify-payment` | Yes | Verify payment and credit the account |

### Credit costs per agent call

| Agent | Credits |
|---|---|
| Chat | 1 |
| Search | 5 |
| Coding | 10 |
| PDF | 10 |
| PPT | 10 |
| Vision | 10 |

### Rate limits (per user, per 60s window)

| Agent | Requests / min |
|---|---|
| Chat | 20 |
| Coding | 5 |
| Search | 5 |
| PDF | 3 |
| PPT | 2 |
| Vision | 3 |

---

## Performance

| Area | Implementation |
|---|---|
| SSE streaming | Coding, vision, and auto agents stream tokens continuously, preventing ALB 504 timeouts |
| ALB heartbeat | `setInterval` writes `: heartbeat\n\n` every 15s as a safety net |
| Redis memory | Conversation messages cached with 24h TTL — avoids repeated MongoDB reads |
| Context window | Only the last 6 messages are injected into the LLM prompt |
| Rate limiting | Per-user, per-agent counters in Redis with a 60s sliding window |
| S3 signed URLs | Generated with a 24h expiry for PDF, PPT, and image artifacts |
| Docker layer cache | `type=gha` cache in CI — npm install layer reused when only source files change |
| Path-based CI | `dorny/paths-filter` skips unchanged services — only modified services rebuild and redeploy |
| Parallel ECS deploy | All 5 ECS `update-service` calls fire as background processes simultaneously |

---

## Deployment

The project is deployed on AWS.

| Layer | Service |
|---|---|
| Frontend | S3 static hosting + CloudFront CDN |
| Backend services | ECS Fargate (one task per service) |
| Container registry | ECR (one repository per service) |
| Database | MongoDB Atlas (external) |
| Cache | Redis (external or ElastiCache) |
| Vector DB | Qdrant Cloud (external) |
| File storage | S3 |

### CI/CD

Push to `main` triggers `.github/workflows/deploy.yml`:

1. `changes` job detects which paths changed using `dorny/paths-filter`
2. Five backend build jobs run in parallel — each only runs if its path changed
3. Frontend build + S3 sync + CloudFront invalidation runs in parallel with backend builds
4. `deploy-backend` waits for all build jobs, then fires all five ECS `update-service` calls simultaneously

No manual deployment steps are required after the initial infrastructure setup.

### Required GitHub Secrets

```
AWS_REGION
AWS_ACCOUNT_ID
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
ECS_CLUSTER
GATEWAY_SERVICE
AGENT_SERVICE
AUTH_SERVICE
CHAT_SERVICE
BILLING_SERVICE
S3_BUCKET_NAME
CLOUDFRONT_DISTRIBUTION_ID
VITE_FIREBASE_API_KEY
VITE_RAZORPAY_KEY_ID
VITE_SERVER_URL
```

---

## Future Improvements

- [ ] Streaming support for PDF and PPT agents (currently blocking)
- [ ] Persistent Qdrant collections per user for multi-session PDF RAG
- [ ] WebSocket upgrade path for lower-latency streaming
- [ ] Conversation search and filtering in the sidebar
- [ ] Multi-file upload support in the composer
- [ ] Token usage and cost tracking per conversation
- [ ] Admin dashboard for usage metrics
- [ ] Automated integration tests for gateway and agent routes

---

## Contributing

1. Fork the repository and create a feature branch from `main`.
2. Keep changes aligned with the existing ESM + Express + React architecture.
3. Preserve service boundaries — gateway, auth, chat, billing, and agent logic must remain separated.
4. Use the existing Redux slices and feature modules instead of inlining API calls inside components.
5. If you add a new agent, update `graph.js`, `router.js`, `state.js`, `llmModels.js`, `agentlimit.js`, and this README together.
6. Run `npm run lint` and `npm run build` in the frontend before opening a pull request.
7. Describe any new environment variables or external service dependencies in your PR description.

---

## License

MIT

---

## Contact

| | |
|---|---|
| GitHub | `<ADD_GITHUB_PROFILE_URL>` |
| LinkedIn | `<ADD_LINKEDIN_URL>` |
| Email | `<ADD_EMAIL>` |
