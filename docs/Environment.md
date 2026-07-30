# Environment Variables

## `backend/gateway/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3000` | Gateway port |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service base URL |
| `CHAT_SERVICE_URL` | `http://localhost:3002` | Chat service base URL |
| `AGENT_SERVICE_URL` | `http://localhost:3003` | Agent service base URL |
| `BILLING_SERVICE_URL` | `http://localhost:3004` | Billing service base URL |

## `backend/services/auth/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3001` | Auth service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-auth` | MongoDB connection |
| `REDIS_URL` | `redis://localhost:8081` | Redis connection |

## `backend/services/chat/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3002` | Chat service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-chat` | MongoDB connection |

## `backend/services/billing/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3004` | Billing service port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ciel-billing` | MongoDB connection |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | Auth service base URL |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | `<secret>` | Razorpay key secret |

## `backend/services/agent/.env`

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

## `frontend/.env`

| Variable | Example | Description |
|---|---|---|
| `VITE_SERVER_URL` | `http://localhost:3000` | Gateway base URL |
| `VITE_FIREBASE_API_KEY` | `AIza...` | Firebase web API key |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay key ID (client) |
