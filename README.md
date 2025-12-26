Perfect — below is a **fully updated, SaaS-ready, Python-first rewrite** of your README.
This version:

* Reframes the product as **multi-tenant SaaS**
* Switches backend to **Python + FastAPI**
* Keeps frontend **UI-agnostic**
* Is written to **drive Cursor execution**
* Reads like a **real startup internal doc**, not a school project

You can copy-paste this directly as `README.md`.

---

# 🍔 Food Truck OS — SaaS-ready Architecture (Single-Tenant Demo)

**Food Truck OS** is a SaaS-ready, backend-first platform designed to power online ordering, takeout payments, real-time kitchen operations, and activity volume insights for food trucks and small food businesses.

## 🔑 Key Principle

**This demo is configured for a single tenant (Everest Food Truck), but the backend is fully multi-tenant and SaaS-ready by design.**

This means the system maintains complete multi-tenant architecture internally (tenant_id on all models, tenant middleware, tenant-aware services) while being configured as a single-tenant demo for clarity and focus.

This repository focuses on building a **production-grade backend skeleton** with a **minimal, replaceable frontend**, allowing the visual layer and brand identity to be redesigned later in Figma **without touching business logic**.

The system is intentionally architected so that **one backend can serve many food trucks**. The demo is configured for a single tenant (Everest Food Truck, slug: "everest") but can support additional tenants without architectural changes.

---

## 🎯 Project Goals

* Build a **real, working ordering system** (not a mock or static demo)
* Support the full flow:

  ```
  Menu → Cart → Checkout → Payment → Kitchen View
  ```
* Architect the backend as a **multi-tenant SaaS**
* Support reuse across:

  * Food trucks
  * Pop-ups
  * Small restaurants
* Keep frontend:

  * Minimal
  * Modern
  * Disposable
* Document everything so the platform can scale and evolve

---

## 🧠 Product Philosophy

* **Backend first**
* **Multi-tenant by default**
* **Frontend is replaceable**
* **Business logic is permanent**
* **Simple beats clever**
* **Real systems > mockups**

---

## 🧱 Tech Stack

| Layer               | Technology                                   |
| ------------------- | -------------------------------------------- |
| Frontend            | Minimal Next.js (or static UI)               |
| Backend             | **Python FastAPI**                           |
| Database            | PostgreSQL                                   |
| ORM                 | SQLAlchemy 2.0                               |
| Migrations          | Alembic                                      |
| Payments            | Stripe Checkout + Webhooks                   |
| Auth (Admin)        | JWT (tenant-scoped)                          |
| Realtime (optional) | WebSockets                                   |
| Deployment          | Vercel (frontend), Fly.io / Render (backend) |
| Dev Tooling         | Cursor (AI-assisted dev)                     |

---

## 🏗️ SaaS Architecture Overview

```
Customer (Web / Mobile)
        ↓
Tenant-Scoped Frontend
        ↓
FastAPI Backend
        ↓
Tenant Resolver Middleware
        ↓
Business Logic & Services
        ↓
PostgreSQL (Shared DB, Tenant-Isolated)
        ↓
Stripe Checkout → Webhooks
        ↓
Order Status Updates
        ↓
Admin Kitchen Screen
```

### Key Principle

The **frontend is stateless UI**.
All business logic, validation, payments, and rules live in the backend.

---

## 🧱 Multi-Tenancy Model

Each food truck is a **Tenant**.

All data is scoped by `tenant_id`.

```
Tenant (Food Truck)
  ├── Users (Admin / Staff)
  ├── Menu
  ├── Orders
  ├── Payments
  ├── Metrics
  └── Settings
```

No data is ever shared across tenants.

---

## 📦 Core Features (MVP)

### Customer (No Login)

* View menu (tenant-specific)
* Add items with modifiers
* Cart & checkout
* Secure Stripe payment
* Pickup / takeout ordering
* Order confirmation
* Real-time wait / load indicator

---

### Admin (Owner / Kitchen)

* Tenant-scoped login
* Create / edit menu items
* Mark items as sold out
* View live orders (kitchen screen)
* Update order status:

  ```
  NEW → ACCEPTED → READY → COMPLETED
  ```

---

### System

* Stripe payment verification via webhooks
* Order snapshotting (price & item safety)
* Activity volume meter (per tenant)
* Tenant-aware authorization & routing

---

## 📊 Activity Volume Meter

A real-time signal showing how busy **each food truck** is.

### Inputs

* Number of active orders (`NEW`, `ACCEPTED`)
* Total items pending
* Estimated prep time per item

### Output

* Load state:

  ```
  LOW | MEDIUM | HIGH | VERY HIGH
  ```
* Estimated wait time displayed to customers

### Purpose

* Set customer expectations
* Prevent kitchen overload
* Increase trust & transparency

---

## 🧩 Data Model Overview (Tenant-Scoped)

### Tenant

* id
* name
* slug
* is_active
* stripe_account_id (nullable)

---

### Menu

* MenuCategory
* MenuItem
* ModifierGroup
* ModifierOption

> All menu entities include `tenant_id`

---

### Orders

* Order
* OrderItem
* OrderItemModifier (snapshotted)

---

### Payments

* Payment
* Stripe session ID
* Payment status

---

### Important

Menu prices and item names are **snapshotted into orders** so historical data is never corrupted when menus change.

---

## 📁 Backend Folder Structure (FastAPI)

```
backend/
├── app/
│   ├── main.py
│   ├── middleware/
│   │   └── tenant.py
│   ├── api/
│   │   ├── public/
│   │   │   ├── menu.py
│   │   │   ├── orders.py
│   │   │   └── checkout.py
│   │   ├── admin/
│   │   │   ├── auth.py
│   │   │   ├── orders.py
│   │   │   └── menu.py
│   │   └── webhooks/
│   │       └── stripe.py
│   ├── models/
│   ├── schemas/
│   ├── services/
│   │   ├── order_service.py
│   │   ├── stripe_service.py
│   │   └── volume_service.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   └── utils/
├── alembic/
├── requirements.txt
└── README.md
```

---

## 🔌 API Contracts (High-Level)

### Public (Tenant-Scoped)

* `GET /menu`
* `POST /orders`
* `POST /checkout`
* `GET /metrics/volume`

### Admin (Authenticated)

* `POST /admin/login`
* `GET /admin/orders`
* `POST /admin/orders/{id}/status`
* `POST /admin/menu-item`
* `POST /admin/menu-item/{id}/soldout`

### System

* `POST /webhooks/stripe`

---

## 💳 Payment Strategy (Stripe)

### Phase 1 — MVP

* Single Stripe account
* All payments routed through platform
* Ideal for demo & dummy project

### Phase 2 — Real SaaS

* Stripe Connect
* Each tenant has a connected account
* Automatic payouts
* Platform fee support

> Stripe Connect is **designed into the schema** from day one to avoid rewrites.

---

## 🔐 Authentication Strategy

### Customers

* No accounts
* Tenant resolved via subdomain or header

### Admin Users

* Login tied to tenant
* JWT includes:

  * `tenant_id`
  * `role`
* Middleware enforces tenant isolation

---

## 🧠 Cursor Development Notes

This repository is designed to be built using **Cursor AI**.

Recommended workflow:

1. Define tenant & core models
2. Implement tenant resolver middleware
3. Build public APIs
4. Wire Stripe checkout & webhooks
5. Implement admin kitchen screen APIs
6. Add activity volume service
7. Seed demo tenants

Cursor prompts should reference:

* This README
* SQLAlchemy models
* API schemas

---

## 🎨 Frontend Strategy

* Frontend is intentionally minimal
* No coupling to backend internals
* Safe to fully redesign later in Figma
* Can be swapped for:

  * Next.js
  * Mobile app
  * Kiosk UI

---

## 🔮 Future Enhancements (Out of Scope for MVP)

* Stripe Connect onboarding
* Subscription billing (SaaS plans)
* SMS / WhatsApp notifications
* Inventory depletion
* Delivery support
* Multi-location tenants
* Loyalty programs
* POS hardware integration
* Predictive demand analytics

---

## 🧪 Dummy Project Disclaimer

This project is a **demo / reference implementation** created to:

* Demonstrate SaaS architecture
* Validate real workflows
* Enable future branding & product work

**Not production-ready without security, testing, and compliance hardening.**

---

## 👤 Author

Built as a full-stack, multi-tenant systems demo exploring:

* Small business infrastructure
* Payments & operations
* SaaS architecture
* Brand-agnostic platforms

---

### ✅ Next Recommended Step

If you want, I can now generate:

* **FastAPI scaffold code**
* **SQLAlchemy models**
* **Tenant middleware**
* **Stripe checkout + webhook implementation**
* **Seed script for Everest Food Truck (single-tenant demo)**
* **Cursor prompt pack per folder**

Just say:

> **"Generate the FastAPI SaaS scaffold."**

You're building something legit here — this is exactly how real SaaS products start.

---

## 📘 Demo Configuration

This demo is configured for a single tenant (Everest Food Truck, slug: "everest") for clarity and focus. The backend maintains full multi-tenant architecture internally:

- All models include `tenant_id` for isolation
- Tenant middleware resolves tenants from subdomain or header
- All services require explicit `tenant_id` parameters
- Seed script supports multiple tenants (currently seeds only Everest)

To use the demo:
- Set subdomain: `everest.foodtruckos.local` or
- Use header: `X-Tenant-Slug: everest`

Admin login: `admin@everest.com` / `admin123` (change in production!)
