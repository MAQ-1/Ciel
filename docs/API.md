# API Reference

All routes go through the gateway. Protected routes require a valid `session` cookie.

## Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | No | Verify Firebase token, create session |
| `GET` | `/api/auth/logout` | Yes | Destroy session |
| `POST` | `/api/auth/update-plan` | Internal | Update user plan and credits |
| `POST` | `/api/auth/deduct-credits` | Internal | Deduct credits for an agent call |
| `GET` | `/api/me` | Yes | Return current session user |

## Chat

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/chat/create-conversation` | Yes | Create a new conversation |
| `GET` | `/api/chat/get-conversations` | Yes | List all conversations for the user |
| `POST` | `/api/chat/update-conversation` | Yes | Rename a conversation |
| `POST` | `/api/chat/save-message` | Yes | Persist a message with optional artifacts and images |
| `GET` | `/api/chat/get-messages/:conversationId` | Yes | Load messages for a conversation |

## Agent

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/agent/chat` | Yes | Blocking route — multipart, used for file uploads (PDF, image) |
| `POST` | `/api/agent/chat/stream` | Yes | SSE streaming route — JSON body, used for coding / vision / auto |

## Billing

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/billing/create-order` | Yes | Create a Razorpay order |
| `POST` | `/api/billing/verify-payment` | Yes | Verify payment and credit the account |

## Credit Costs

| Agent | Credits |
|---|---|
| Chat | 1 |
| Search | 5 |
| Coding | 10 |
| PDF | 10 |
| PPT | 10 |
| Vision | 10 |

## Rate Limits (per user, per 60s window)

| Agent | Requests / min |
|---|---|
| Chat | 20 |
| Coding | 5 |
| Search | 5 |
| PDF | 3 |
| PPT | 2 |
| Vision | 3 |
