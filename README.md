# Job Portal 🚀

A modern and scalable **Job Portal Backend API** built with **Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM** following a clean layered architecture and backend engineering best practices.

This project is designed to simulate a real-world production-ready backend system for job seekers, recruiters, and companies.

---

## ✨ Features

* 🔐 JWT Authentication & Authorization
* 👤 Role-based Access Control (Admin, Recruiter, Candidate)
* 🏢 Company Management
* 💼 Job Posting & Management
* 📄 Job Applications
* ✅ Input Validation using Zod
* 🔒 Password Hashing with bcrypt
* 🗄️ PostgreSQL + Prisma ORM
* ⚡ TypeScript for type safety
* 📁 Layered Backend Architecture
* 🌍 Environment-based Configuration
* 🧹 Clean & Scalable Codebase

---

## 🛠️ Tech Stack

| Technology | Usage                 |
| ---------- | --------------------- |
| Node.js    | Runtime               |
| Express.js | Backend Framework     |
| TypeScript | Type Safety           |
| PostgreSQL | Database              |
| Prisma ORM | Database ORM          |
| JWT        | Authentication        |
| bcrypt     | Password Hashing      |
| Zod        | Validation            |
| dotenv     | Environment Variables |

---

## 📂 Project Structure

```bash
src/
│
├── config/         # Database & environment configuration
├── controller/     # Route controllers
├── middlewares/    # Custom middlewares
├── routes/         # API routes
├── service/        # Business logic
├── validations/    # Zod schemas
├── utils/          # Utility functions
├── types/          # Type definitions
└── index.ts        # Entry point
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Kushalchavan/Job-portal.git
```

### 2️⃣ Navigate into the project

```bash
cd Job-portal
```

### 3️⃣ Install dependencies

```bash
npm install
```

### 4️⃣ Setup environment variables

Create a `.env` file:

```env
PORT=3000

DATABASE_URL="your_postgresql_database_url"

JWT_SECRET="your_jwt_secret"
```

---

## 🗄️ Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

---

## ▶️ Run the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## 🔐 Authentication Flow

* User Registration
* User Login
* JWT Token Generation
* Protected Routes using Middleware
* Role-based Authorization

---

## 📌 API Modules

### Auth

* Register User
* Login User

### Company

* Create Company
* Update Company
* Get Company Details

### Jobs

* Create Job
* Update Job
* Delete Job
* Get All Jobs

### Applications

* Apply for Job
* Track Application Status

---

## 🧠 Backend Concepts Used

* Layered Architecture
* Service Pattern
* JWT Authentication
* RBAC (Role Based Access Control)
* Environment Validation
* Database Relationships
* Prisma Schema Design
* Error Handling Middleware
* Clean Code Principles

---


## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Made with ❤️ by Kushal Chavan

