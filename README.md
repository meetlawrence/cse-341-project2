# Personal Expense Tracker API

A secure, RESTful backend API built with Node.js and Express, designed to help individuals manage their daily finances. The system operates on a cloud-hosted MongoDB database utilizing a dual-collection ecosystem to manage both **Users** and **Expenses**. It features strict server-side input validation, global exception handlers, and an automated interactive API documentation suite via Swagger UI.

## 🚀 Core Features
* **Multi-Collection CRUD Operations:** Full creation, retrieval, modification, and deletion endpoints for both `Expenses` and `Users` collections.
* **Robust Data Validation:** Server-side request parsing that validates missing keys, correct data types (e.g., verifying phone numbers and emails), and logical bounds (e.g., preventing negative transaction amounts).
* **Defensive Error Handling:** Every asynchronous controller route is encapsulated within secure `try/catch` execution blocks to safely intercept database exceptions without crashing the running server instance.
* **Auto-Adaptive Documentation:** Fully interactive documentation exposed at `/api-docs` that dynamically routes requests to local environments or secure cloud instances based on deployment contexts.

---

## 🛠️ Tech Stack & Architecture
* **Runtime Environment:** Node.js
* **Backend Framework:** Express.js
* **Database Engine:** MongoDB (via Native Driver)
* **API Documentation:** Swagger-Autogen & Swagger-UI-Express
* **Hosting Platform:** Render (Production Environment via HTTPS)

---

## 🗺️ API Interface Map

### Users Collection Endpoints
* `GET /users` — Retrieves a list of all registered profile records.
* `GET /users/:id` — Fetches a single user record using their hexadecimal Object ID.
* `POST /users` — Registers a new profile. *Required payload fields: firstName, lastName, email, phoneNumber.*
* `PUT /users/:id` — Modifies an existing profile record using structural verification.
* `DELETE /users/:id` — Permanently removes a target user from the storage collection.

### Expenses Collection Endpoints
* `GET /expenses` — Fetches all logged transactional entries.
* `GET /expenses/:id` — Retreives a specific expense transaction by its Object ID.
* `POST /expenses` — Inserts a new financial record. *Required payload fields: title, amount, category.*
* `PUT /expenses/:id` — Rewrites an existing financial ledger record with validation.
* `DELETE /expenses/:id` — Deletes a transaction entry from the ledger.

