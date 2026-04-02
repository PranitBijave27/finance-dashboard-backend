# Finance Dashboard Backend

A backend system for a finance dashboard built with **Node.js**, **Express**, and **MongoDB**. It supports role-based access control, financial records management, and dashboard analytics.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Password Hashing:** bcryptjs
- **Rate Limiting:** express-rate-limit

---

## Folder Structure

```
finance-dashboard/
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── seeder.js           # First admin seeder
│   ├── models/
│   │   ├── user.model.js       # User schema
│   │   └── record.model.js     # Financial record schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── rbac.middleware.js        # Role-based access control
│   │   ├── validate.middleware.js    # Joi validation
│   │   └── rateLimiter.middleware.js # Rate limiting
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── record.validator.js
│   └── utils/
│       └── ApiError.js         # Custom error class
├── .env
├── app.js
└── server.js
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd finance-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/finance-dashboard
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 4. Seed the first admin

Run this once to create the first admin user:

```bash
npm run seed
```

This creates:
- **Email:** admin@finance.com
- **Password:** admin123

### 5. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## Roles & Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| View records | ✅ | ✅ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View category totals | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| Create / Update / Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## API Endpoints

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Routes

#### POST `/api/auth/register`
Register a new user. Role is always set to `viewer` by default.

**Body:**
```json
{
  "name": "Pranit",
  "email": "pranit@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "name": "Pranit",
    "email": "pranit@example.com",
    "role": "viewer",
    "status": "active"
  }
}
```

---

#### POST `/api/auth/login`
Login and receive a JWT token.

**Body:**
```json
{
  "email": "admin@finance.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "<jwt_token>",
  "user": { ... }
}
```

---

### User Routes *(Admin only)*

#### GET `/api/users`
Get all users. Optionally filter by status.

**Query params:** `?status=active` or `?status=inactive`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [ ... ]
}
```

---

#### PATCH `/api/users/:id/role`
Update a user's role.

**Body:**
```json
{ "role": "analyst" }
```

---

#### PATCH `/api/users/:id/status`
Activate or deactivate a user. Admin cannot deactivate themselves.

**Body:**
```json
{ "status": "inactive" }
```

---

### Financial Record Routes

#### GET `/api/records` *(All roles)*
Get all financial records. Supports filtering.

**Query params:**
```
?type=income
?category=salary
?startDate=2024-01-01&endDate=2024-03-31
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "records": [ ... ]
}
```

---

#### GET `/api/records/:id` *(All roles)*
Get a single record by ID.

---

#### POST `/api/records` *(Admin only)*
Create a new financial record.

**Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "date": "2024-04-01",
  "notes": "April salary"
}
```

---

#### PATCH `/api/records/:id` *(Admin only)*
Update any field of a record. At least one field required.

**Body:**
```json
{
  "amount": 6000,
  "notes": "revised salary"
}
```

---

#### DELETE `/api/records/:id` *(Admin only)*
Soft delete a record. Record is not removed from the database — `isDeleted` is set to `true` and the record is excluded from all future queries automatically.

---

### Dashboard Routes

#### GET `/api/dashboard/summary` *(All roles)*
Get total income, expenses, net balance, and record count.

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalIncome": 50000,
    "totalExpenses": 20000,
    "netBalance": 30000,
    "totalRecords": 15
  }
}
```

---

#### GET `/api/dashboard/recent` *(All roles)*
Get the 5 most recent financial records.

---

#### GET `/api/dashboard/categories` *(Analyst, Admin)*
Get totals grouped by category and type.

**Response:**
```json
{
  "success": true,
  "categories": [
    { "category": "salary", "type": "income", "total": 40000, "count": 4 },
    { "category": "rent", "type": "expense", "total": 15000, "count": 3 }
  ]
}
```

---

#### GET `/api/dashboard/trends` *(Analyst, Admin)*
Get monthly income vs expense breakdown for the current year.

**Response:**
```json
{
  "success": true,
  "year": 2024,
  "trends": [
    { "month": "January", "income": 10000, "expenses": 6000 },
    { "month": "February", "income": 12000, "expenses": 7000 }
  ]
}
```

---

## Rate Limiting

| Limiter | Routes | Window | Max Requests |
|---------|--------|--------|--------------|
| Global | All routes | 15 mins | 100 requests |
| Auth | `/api/auth` only | 15 mins | 10 requests |

---

## Assumptions Made

- Every new user registers as a `viewer` by default. Only an admin can promote them to `analyst` or `admin`.
- The first admin is created via the seeder script (`npm run seed`) since there is no admin initially.
- Deleting a record is a soft delete — the record remains in the database with `isDeleted: true` and is excluded from all queries automatically.
- An admin cannot deactivate their own account to prevent accidental lockout.
- Dashboard trends are calculated for the current year only.
- The `createdBy` field on records always stores the admin who created it.

---

## Design Decisions

- **Custom ApiError class** — instead of scattering `res.status().json()` calls everywhere, all errors are thrown as `ApiError` instances and caught by a single global error handler in `app.js`.
- **Joi validation** — all request bodies are validated before reaching the controller, keeping controllers clean.
- **RBAC middleware** — `authorize(...roles)` is a reusable middleware that accepts any number of roles, making it easy to apply fine-grained access control on any route.
- **Mongoose pre-hooks** — password hashing is handled automatically on the model level via `pre("save")` so no controller ever deals with raw passwords. Soft delete filtering is also handled at the model level via `pre(/^find/)`.
- **Seeder script** — avoids the chicken-and-egg problem of needing an admin to create the first admin.
- **Two rate limiters** — a strict limiter on auth routes prevents brute force attacks while a relaxed global limiter protects the rest of the API.