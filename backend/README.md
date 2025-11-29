# 🎓 Mentorship Platform - Backend API Documentation

A comprehensive backend system for a mentorship platform connecting students, mentors, and families with robust admin management capabilities.

## 📋 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Installation](#installation)
* [API Documentation](#api-documentation)
* [Environment Variables](#environment-variables)
* [Project Structure](#project-structure)
* [Authentication](#authentication)
* [Role-Based Permissions](#role-based-permissions)
* [Routes](#routes)
* [Admin Features](#admin-features)
* [Database Models](#database-models)
* [Development](#development)
* [Deployment](#deployment)

---

## 🚀 Overview

This is a **three-sided mentorship platform** that connects:

* **Students** looking for academic support
* **Mentors** providing learning assistance
* **Families** managing student profiles
* **Admins** ensuring platform operations

The backend provides a secure, scalable API built with Express.js and MongoDB.

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT login + refresh tokens
* Role-based access (Admin, Mentor, Student, Family)
* Secure password hashing
* Profile completion workflow per role

### 👥 User Management

* Multi-role users with shared base profile
* Extended profiles per role
* Admin full user control

### 📋 Job Posting System

* Families post tutoring needs
* Admin approval workflow
* Filtering & search

### 📝 Mentor Applications

* Mentors submit proposals
* Admin vetting & family review

### ⚡ Admin Dashboard

* Analytics
* User management
* Job + application vetting
* Performance insights

---

## 🛠 Tech Stack

* **Node.js**, **Express.js**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Joi Validation**
* **Winston Logging**

---

## 🏗 Architecture

```
backend/
|-- config/
|-- models/
|-- middleware/
|-- controllers/
|-- services/
|-- routes/
|-- utils/
|-- logs/
`-- server.js
```

### Database Design

User → Family → Student → Job → Application → Match → Session → Progress → Payment

---

## ⚙️ Installation

### Prerequisites

* Node.js v16+
* MongoDB

### Setup

```bash
git clone <repo-url>
cd backend
npm install
npm run dev
```

---

## 🔐 Authentication

### Endpoints

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | /auth/register        | Register new base user   |
| POST   | /auth/login           | Login                    |
| GET    | /auth/me              | Get logged-in user       |
| POST   | /auth/logout          | Logout                   |
| POST   | /auth/profile/family  | Complete family profile  |
| POST   | /auth/profile/student | Complete student profile |
| POST   | /auth/profile/mentor  | Complete mentor profile  |
| PUT    | /auth/profile         | Update common fields     |

---

## 🛡 Role-Based Permissions

| Role    | Access                           |
| ------- | -------------------------------- |
| Admin   | Full system access               |
| Family  | Manage students + jobs           |
| Student | View mentors, sessions           |
| Mentor  | Apply for jobs, manage proposals |

---

## 🛣 Routes

### Base Router (`routes/index.js`)

```
/api/health
/api/auth
/api/users
/api/mentors
/api/admin
```

### Auth Routes (`auth.routes.js`)

* register
* login
* logout
* profile creation per role
* profile update

### User Routes (`user.routes.js`)

* update common profile fields

### Mentor Routes (`mentor.routes.js`)

(Role-specific mentor endpoints can extend this.)

### Admin Routes (`admin.routes.js`)

Admin-only protected endpoints:

* Dashboard stats
* User management
* Job management
* Application vetting
* Reports

---

## 🧭 Admin Features

### Dashboard & Analytics

* /admin/dashboard/overview
* /admin/stats/platform
* /admin/stats/jobs
* /admin/stats/applications

### User Management

* List users
* Get single user
* Update status
* Soft delete user
* Fetch profile by ID

### Job Management

* Approve job
* Reject job
* Set job priority
* Get pending jobs

### Application Vetting

* Get pending applications
* Vet / shortlist
* View job applications

### Reports

* Registration trends
* Mentor performance
* Platform growth

---

## 🌱 Development

### Running Dev Server

```bash
npm run dev
```

### Code Style Tools

* ESLint
* Prettier

---

## 🚀 Deployment

Supported on:

* Docker
* Railway
* Render
* AWS Elastic Beanstalk

Environment variables must be configured before deployment.

---

## 🔧 Environment Variables

| Variable               | Description        |
| ---------------------- | ------------------ |
| PORT                   | Server port        |
| MONGODB_URI            | DB connection URI  |
| JWT_SECRET             | JWT key            |
| JWT_EXPIRES_IN         | Expiration         |
| JWT_REFRESH_SECRET     | Refresh key        |
| JWT_REFRESH_EXPIRES_IN | Refresh expiration |

---

## 📌 Notes

* All admin routes require both **authenticate** and **restrictTo(ADMIN)** middleware.
* Profile completion must happen after registration and login.
* User collection stores base identity; each role has separate model.

---



## API Routes

### Auth Routes

* **POST** `/api/auth/register`
* **POST** `/api/auth/login`
* **POST** `/api/auth/refresh-token`
* **POST** `/api/auth/forgot-password`
* **POST** `/api/auth/reset-password`

### Mentor Routes

* **GET** `/api/mentor/profile`
* **PUT** `/api/mentor/profile`
* **GET** `/api/mentor/jobs`
* **POST** `/api/mentor/jobs/apply`
* **GET** `/api/mentor/sessions`
* **POST** `/api/mentor/sessions`

### Student Routes

* **GET** `/api/student/profile`
* **PUT** `/api/student/profile`
* **GET** `/api/student/applications`
* **POST** `/api/student/apply`
* **GET** `/api/student/saved-jobs`
* **POST** `/api/student/saved-jobs`

### Family Routes

* **GET** `/api/family/profile`
* **PUT** `/api/family/profile`
* **GET** `/api/family/students`

### Admin Routes

* **GET** `/api/admin/users`
* **POST** `/api/admin/users`
* **GET** `/api/admin/jobs`
* **POST** `/api/admin/jobs`
* **GET** `/api/admin/applications`
* **GET** `/api/admin/analytics`

