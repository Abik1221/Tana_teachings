# 🎓 Mentorship Platform - Backend API Documentation

A comprehensive backend system for a mentorship platform connecting students, mentors, and families with robust admin management capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Admin Features](#admin-features)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [Development](#development)
- [Deployment](#deployment)

## 🚀 Overview

This is a **three-sided mentorship platform** that facilitates meaningful educational relationships between:
- **Students** seeking academic guidance
- **Mentors** offering tutoring services  
- **Families** managing student profiles and mentorship requests
- **Admins** overseeing platform quality and operations

### Core Problem We Solve

1. **Students Struggle** to find reliable, qualified mentors
2. **Parents Waste Time** searching through unvetted tutors
3. **Mentors Lack Access** to serious, committed students
4. **No Centralized System** for structured matching with oversight

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Mentor, Family, Student)
- Secure password hashing with bcrypt
- Email verification system

### 👥 User Management
- Multi-role user system
- Profile management for each role
- User status management (active, suspended, inactive)
- Comprehensive user analytics

### 📋 Job Posting System
- Family-initiated mentorship requests
- Admin approval workflow for job posts
- Advanced filtering and search capabilities
- Budget and scheduling management

### 📝 Application & Vetting
- Mentor applications with detailed proposals
- Double-vetting system (Admin → Family)
- Application status tracking
- Quality control mechanisms

### ⚡ Admin Dashboard
- **Platform Analytics**: User statistics, growth metrics, performance insights
- **Job Management**: Approve/reject posts, set priorities, track status
- **Application Vetting**: Review, shortlist, and reject mentor applications
- **User Management**: View, suspend, and manage all users
- **Reporting**: Registration trends, mentor performance, platform growth

### 💰 Commission System
- Automated commission calculation (15% platform fee)
- Payment tracking and transaction history
- Financial reporting and analytics

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston/Morgan

### Development
- **Environment Management**: dotenv
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, Supertest
- **Documentation**: API Documentation

## 🏗 Architecture

### Folder Structure

backend/
├── 📁 config/ # Configuration files
├── 📁 models/ # MongoDB schemas
├── 📁 middleware/ # Authentication, validation, error handling
├── 📁 controllers/ # Request handlers
├── 📁 services/ # Business logic layer
├── 📁 routes/ # API endpoints
├── 📁 utils/ # Helpers, constants, validators
├── 📁 tests/ # Test suites
└── server.js # Application entry point


### Database Design

User → Family → Student → Job → Application → Match → Session → Progress → Payment



## ⚙️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mentorship-platform/backend

2. **Install dependencies**
    ```bash
    npm install

3. **Start the application**

    ```bash
    # Development
    npm run dev

#  📚 API Documentation

**Base URL**

        ```bash
        http://localhost:5000/api
        
        ```


## Authentication Endpoints

| Method | Endpoint       | Description       | Access  |
|--------|----------------|-----------------|---------|
| POST   | /auth/register | Register new user | Public  |
| POST   | /auth/login    | User login        | Public  |
| GET    | /auth/me       | Get current user  | Private |

---

## Admin Endpoints

### Dashboard & Analytics

| Method | Endpoint                         | Description                  |
|--------|---------------------------------|------------------------------|
| GET    | /admin/dashboard/overview        | Platform overview metrics    |
| GET    | /admin/stats/platform            | Platform statistics          |
| GET    | /admin/stats/jobs                | Job statistics               |
| GET    | /admin/stats/applications        | Application statistics       |

### User Management

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| GET    | /admin/users                 | Get all users (with filtering)     |
| GET    | /admin/users/:id             | Get user by ID                     |
| PATCH  | /admin/users/:id/status      | Update user status                 |
| DELETE | /admin/users/:id             | Delete user (soft delete)          |
| GET    | /admin/users/:id/profile     | Get user profile with role data    |

### Job Management

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| GET    | /admin/jobs                  | Get all jobs (with filtering)      |
| GET    | /admin/jobs/pending          | Get pending approval jobs          |
| PUT    | /admin/jobs/:id/approve      | Approve job post                    |
| PUT    | /admin/jobs/:id/reject       | Reject job post                     |
| PATCH  | /admin/jobs/:id/priority     | Update job priority                 |

### Application Vetting

| Method | Endpoint                          | Description                          |
|--------|----------------------------------|--------------------------------------|
| GET    | /admin/applications              | Get all applications                  |
| GET    | /admin/applications/pending      | Get pending vetting applications     |
| PUT    | /admin/applications/:id/vet      | Vet application (shortlist/reject)   |
| GET    | /admin/applications/job/:jobId   | Get applications for specific job    |

---

## Environment Variables

| Variable                | Description                   | Default                     |
|-------------------------|-------------------------------|-----------------------------|
| NODE_ENV                | Application environment       | development                 |
| PORT                    | Server port                   | 5000                        |
| MONGODB_URI             | MongoDB connection string     | -                           |
| JWT_SECRET              | JWT signing secret            | -                           |
| JWT_EXPIRES_IN          | JWT expiration time           | 7d                          |
| JWT_REFRESH_SECRET      | Refresh token secret          | -                           |
| JWT_REFRESH_EXPIRES_IN  | Refresh token expiration      | 30d                         |
