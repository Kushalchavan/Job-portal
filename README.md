# 🚀 AI-Powered Recruitment Platform

An enterprise-grade backend application that helps recruiters find the best candidates using AI-powered resume matching.

Built with modern backend engineering practices including TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Docker, Nginx, Prometheus, Grafana, and Google Gemini AI.

---

## ✨ Features

### Authentication & Security

- JWT Authentication
- Refresh Token Rotation
- Email Verification
- Forgot Password Flow
- Role Based Access Control (RBAC)
- Recruiter / User / Admin Roles

---

### Recruiter Features

- Create Companies
- Manage Companies
- Create Jobs
- Update Jobs
- Delete Jobs
- View Applicants
- Candidate Pipeline Tracking
- AI Candidate Matching
- Candidate Shortlisting

---

### Candidate Features

- Register/Login
- Upload Resume
- Apply to Jobs
- Save Jobs
- Manage Applications
- Receive Notifications

---

### AI Features

- Resume Parsing
- Skill Extraction
- Resume ↔ Job Matching
- Candidate Ranking
- Candidate Match Scoring
- AI Generated Candidate Summaries

---

### Async Processing

- Event Driven Architecture
- BullMQ Job Queues
- Redis Backed Workers
- Background Resume Processing
- Notification Processing

---

### Observability

- Prometheus Metrics
- Grafana Dashboards
- Structured Logging (Winston)
- Request Tracking

---

### Infrastructure

- Docker
- Docker Compose
- Nginx Reverse Proxy
- Redis Cache
- PostgreSQL
- Swagger Documentation

---

# 🏗 Architecture

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       Nginx         │
                │   Reverse Proxy     │
                └─────────┬───────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │   Express API       │
                │    TypeScript       │
                └─────────┬───────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ Service Layer       │
                │ Business Logic      │
                └─────────┬───────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ Prisma ORM          │
                └─────────┬───────────┘
                          │
                          ▼
                ┌─────────────────────┐
                │ PostgreSQL          │
                └─────────────────────┘


Async Processing

Event Emitter
      │
      ▼
BullMQ Queue
      │
      ▼
Redis
      │
      ▼
Workers
 ├─ Resume Parsing
 ├─ AI Matching
 └─ Notifications


Monitoring

Prometheus
      │
      ▼
Grafana
```

---

# 📂 Project Structure

```text
job-portal-ai/

├── apps
│   ├── api
│   └── web
│
├── packages
│   ├── schemas
│   ├── tsconfig
│   └── types
│
├── monitoring
│   └── prometheus.yml
│
├── nginx
│   └── nginx.conf
│
├── docker-compose.yml
├── turbo.json
└── README.md
```

---

# 📦 Backend Modules

```text
auth
company
job
application
resume
matching
notification
dashboard
analytics
saved-job
admin
```

---

# 🗄 Database Schema

## User

- Authentication
- Role Management
- Resume Management
- Applications
- Saved Jobs

## Company

- Recruiter Companies
- Job Ownership

## Job

- Job Listings
- Salary Range
- Skills
- Experience Levels

## Application

- Candidate Applications
- Status Tracking

## Resume

- Resume Storage
- Parsed Skills
- AI Analysis

## ResumeMatch

- Match Score
- Missing Skills
- Candidate Ranking

## Notification

- Job Alerts
- Application Updates

---

# 🧠 AI Matching Flow

```text
Resume Upload
      │
      ▼
Resume Parsing
      │
      ▼
Skill Extraction
      │
      ▼
Job Skills Comparison
      │
      ▼
Gemini AI Analysis
      │
      ▼
Match Score Generation
      │
      ▼
Candidate Ranking
```

---

# 🔐 Roles

## USER

- Upload Resume
- Apply Jobs
- Save Jobs
- View Applications

## RECRUITER

- Manage Companies
- Manage Jobs
- View Candidates
- Shortlist Candidates

## ADMIN

- Manage Users
- Block Users
- Platform Analytics

---

# ⚙️ Tech Stack

## Backend

- Node.js
- TypeScript
- Express.js

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- Refresh Tokens
- bcrypt

## AI

- Google Gemini

## Caching & Queues

- Redis
- BullMQ

## Monitoring

- Prometheus
- Grafana

## DevOps

- Docker
- Docker Compose
- Nginx

## Documentation

- Swagger OpenAPI

---

# 🚀 API Documentation

Swagger UI:

```bash
http://localhost:3001/api-docs
```

---

# 📊 Monitoring

Prometheus:

```bash
http://localhost:9090
```

Grafana:

```bash
http://localhost:3000
```

---

# 🐳 Running With Docker

```bash
docker-compose up --build
```

---

# 🔧 Local Development

Install dependencies

```bash
pnpm install
```

Start development servers

```bash
pnpm dev
```

Generate Prisma Client

```bash
pnpm --filter @repo/api prisma:generate
```

Run Migrations

```bash
pnpm --filter @repo/api prisma:migrate
```

---

# 🧪 Testing

```bash
pnpm --filter @repo/api test
```

---

# 📈 Future Improvements

- AWS S3 Resume Storage
- AWS ECS Deployment
- Kubernetes
- Elasticsearch Search
- Recommendation Engine
- Interview Scheduling
- Real-time Notifications
- Multi Tenant Support

---

# 👨‍💻 Author

Kushal Chavan

Backend Developer

Tech Stack:
Node.js • TypeScript • PostgreSQL • Prisma • Redis • BullMQ • Docker • AWS

---