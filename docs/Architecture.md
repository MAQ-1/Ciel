# Architecture

## High-Level Overview

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

## LangGraph State

Every agent receives and returns the same typed state object:

```js
{
  prompt, conversationId, agent, userId,
  file, streamRes,          // inputs
  aiResponse, images,       // outputs
  artifacts, searchResults  // agent-specific outputs
}
```

## SSE Streaming

Agents that can exceed 60s (coding, vision, auto) use the SSE route:

1. `flushHeaders()` called immediately — sends HTTP headers to ALB, resetting the idle timer
2. `setInterval` heartbeat every 15s writes `: heartbeat\n\n`
3. Coding agent writes `: generating\n\n` per token chunk during generation
4. Final event: `data: { text, artifacts, images }\n\n`
5. Termination: `data: [DONE]\n\n`

## Service Boundaries

- **Gateway** — only public service. Validates session cookie, injects `x-user-id`, proxies.
- **Auth** — Firebase token verification, session management, credit deduction.
- **Chat** — conversation and message CRUD. No LLM logic.
- **Agent** — all LLM orchestration. Calls auth service for credit deduction.
- **Billing** — Razorpay integration. Calls auth service to update credits after payment.
