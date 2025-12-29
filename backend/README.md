# Food Truck OS Backend

FastAPI backend for the Food Truck OS multi-tenant SaaS platform.

## Demo Mode

This backend is seeded with a single tenant (Everest Food Truck) for demo purposes. The system is fully multi-tenant internally and can support additional food trucks without architectural changes.

**Key Principle:** This demo is configured for a single tenant (Everest Food Truck), but the backend is fully multi-tenant and SaaS-ready by design.

## Setup

### Prerequisites

- Python 3.11+
- Database: PostgreSQL 14+ (local) or Supabase (recommended for Vercel)
- Stripe account (for payments)

### Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Update `.env` with your database and Stripe credentials.

### Database Setup

#### Option 1: Supabase (Recommended for Vercel)

1. Create a Supabase project at https://supabase.com
2. Get your connection string from **Settings → Database**
3. Convert to asyncpg format: `postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres`
4. Update `DATABASE_URL` in `.env` with your Supabase connection string

See `SUPABASE_SETUP.md` for detailed instructions.

#### Option 2: Local PostgreSQL

1. Create a PostgreSQL database:

```sql
CREATE DATABASE foodtruckos;
```

2. Update `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/foodtruckos
```

3. Run migrations:

```bash
alembic upgrade head
```

4. Seed the database with demo data:

```bash
python -m app.scripts.seed
```

This will create:
- Everest Food Truck tenant (slug: "everest")
- Admin user: `admin@everest.com` / `admin123`
- Sample menu items

## Running the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string (use `postgresql+asyncpg://`)
  - For Supabase: `postgresql+asyncpg://postgres:password@db.xxxxx.supabase.co:5432/postgres`
  - For local: `postgresql+asyncpg://user:password@localhost:5432/dbname`
- `SECRET_KEY`: JWT secret key (generate a secure random string)
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret

## API Endpoints

### Public Endpoints

All public endpoints require tenant resolution via:
- Subdomain: `everest.foodtruckos.local`
- Header: `X-Tenant-Slug: everest`

- `GET /api/menu` - Get menu
- `POST /api/orders` - Create order
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/metrics/volume` - Get kitchen volume metrics

### Admin Endpoints

Require JWT authentication (Bearer token):

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/{id}` - Get order
- `POST /api/admin/orders/{id}/status` - Update order status
- `POST /api/admin/menu/menu-item/{id}/soldout` - Mark item as sold out
- `POST /api/admin/menu/menu-item/{id}/available` - Mark item as available

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler

## Architecture

- **Multi-tenant by design**: All models include `tenant_id`
- **Tenant isolation**: Middleware resolves tenant from subdomain/header
- **Service layer**: All services require explicit `tenant_id` parameter
- **Order snapshots**: Prices and item names are snapshotted for historical accuracy

## Development

### Running Migrations

Create a new migration:

```bash
alembic revision --autogenerate -m "description"
```

Apply migrations:

```bash
alembic upgrade head
```

### Database Models

All models are in `app/models/`:
- `tenant.py` - Tenant model
- `user.py` - Admin users
- `menu.py` - Menu categories, items, modifiers
- `order.py` - Orders with snapshots
- `payment.py` - Payment records

## Notes

- The system is designed to support multiple tenants but is configured for a single-tenant demo
- Stripe Connect is designed into the schema (nullable `stripe_account_id` on Tenant)
- All service methods explicitly require `tenant_id` to enforce SaaS discipline

