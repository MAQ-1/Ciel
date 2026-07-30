# Deployment Guide

## Infrastructure Overview

| Layer | Service |
|---|---|
| Frontend | S3 static hosting + CloudFront CDN |
| Backend | ECS Fargate — one task per service |
| Container registry | ECR — one repository per service |
| Database | MongoDB Atlas |
| Cache | Redis (ElastiCache or external) |
| Vector DB | Qdrant Cloud |
| File storage | S3 |

## CI/CD

Push to `main` triggers `.github/workflows/deploy.yml`:

1. `changes` job detects which paths changed via `dorny/paths-filter`
2. Five backend build jobs run in parallel — each only runs if its path changed
3. Frontend build + S3 sync + CloudFront invalidation runs in parallel with backend builds
4. `deploy-backend` waits for all build jobs, then fires all five ECS `update-service` calls simultaneously as bash background processes

## Required GitHub Secrets

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

## ECR Repositories

One repository per service:

- `gateway`
- `agent-service`
- `auth-service`
- `chat-service`
- `billing-service`

## ECS Services

One Fargate task per service. All services are internal except the gateway, which is exposed via an Application Load Balancer behind CloudFront.

## ALB Configuration

The ALB idle timeout must be set to at least 120 seconds to accommodate long-running agent calls. The SSE heartbeat (`setInterval` every 15s) acts as a safety net, but the ALB timeout should be raised from the default 60s.
