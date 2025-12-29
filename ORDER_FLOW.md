# Order Flow & Real-Time Sync

## Overview
The order system is fully functional with real-time synchronization between clients and admin dashboard.

## Order Creation Flow

### 1. Customer Places Order
**Location**: `frontend/app/checkout/page.tsx`

```typescript
// Step 1: Create order in database
const response = await api.post('/orders', {
  items: orderItems,
  customer_name: formData.customer_name,
  customer_email: formData.customer_email,
  customer_phone: formData.customer_phone || null
})

// Step 2: Create Stripe checkout session
const checkoutResponse = await api.post('/checkout', {
  order_id: response.data.id,
  success_url: `${window.location.origin}/order-status/${response.data.id}`,
  cancel_url: `${window.location.origin}/cart`
})

// Step 3: Redirect to Stripe
window.location.href = checkoutResponse.data.checkout_url
```

### 2. Order Stored in Database
**API**: `POST /api/orders` → `frontend/app/api/orders/route.ts`

Creates:
- Order record with status `NEW`
- Order items (with snapshots of menu items)
- Order item modifiers

## Real-Time Synchronization

### Admin Dashboard → Sees New Orders
**Location**: `frontend/app/admin/orders/page.tsx`

- Polls `/admin/orders` every **10 seconds**
- Automatically displays new orders as they come in
- No page refresh needed

```typescript
useEffect(() => {
  fetchData()
  const interval = setInterval(fetchData, 10000) // Poll every 10s
  return () => clearInterval(interval)
}, [])
```

### Admin Updates Status
**User Action**: Admin clicks status dropdown and selects new status

**API**: `POST /api/admin/orders/[orderId]/status`

```typescript
const handleStatusUpdate = async (orderId: string, newStatus: string) => {
  await api.post(`/admin/orders/${orderId}/status`, { status: newStatus })
  fetchData() // Refresh list
}
```

Valid statuses: `NEW`, `ACCEPTED`, `PREP`, `READY`, `COMPLETED`, `CANCELLED`

### Client → Sees Status Updates
**Location**: `frontend/app/order-status/[orderId]/page.tsx`

- Polls `/orders/[orderId]` every **3 seconds**
- Shows real-time progress with stepper UI
- Updates automatically when admin changes status

```typescript
useEffect(() => {
  if (orderId) {
    fetchOrder()
    const interval = setInterval(fetchOrder, 3000) // Poll every 3s
    return () => clearInterval(interval)
  }
}, [orderId])
```

## Status Flow

```
NEW → PREP → READY → COMPLETED
              ↓
          CANCELLED (any time)
```

### Status Descriptions
- **NEW**: Order received and confirmed
- **PREP**: Kitchen is preparing the order
- **READY**: Order ready for pickup
- **COMPLETED**: Order picked up
- **CANCELLED**: Order cancelled

## API Endpoints

### Client Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders/[orderId]` - Get order details (for tracking)
- `POST /api/checkout` - Create Stripe checkout session

### Admin Endpoints (Requires Auth Token)
- `GET /api/admin/orders` - List all orders (optional status filter)
- `POST /api/admin/orders/[orderId]/status` - Update order status

## Database Tables

### orders
- `id` (uuid)
- `status` (NEW | PREP | READY | COMPLETED | CANCELLED)
- `customer_name`, `customer_email`, `customer_phone`
- `total_amount`
- `created_at`

### order_items
- `id` (uuid)
- `order_id` (fk)
- `menu_item_id` (fk, nullable - for tracking)
- `item_name`, `item_description`, `item_price` (snapshot)
- `quantity`

### order_item_modifiers
- `id` (uuid)
- `order_item_id` (fk)
- `modifier_option_id` (fk, nullable - for tracking)
- `modifier_name`, `modifier_price` (snapshot)

### payments
- `id` (uuid)
- `order_id` (fk)
- `stripe_payment_intent_id`
- `amount`, `currency`, `status`

## Testing the Flow

1. **Create an order**:
   - Add items to cart → Checkout → Fill form → (Payment redirects to Stripe)
   
2. **Admin sees it**:
   - Login to `/login`
   - Go to `/admin/orders`
   - New order appears within 10 seconds

3. **Admin updates status**:
   - Click status dropdown
   - Select "PREP" → "READY"
   
4. **Client sees update**:
   - Customer on `/order-status/[orderId]` page
   - Stepper automatically updates within 3 seconds
   - Shows current status with description

## Future Enhancements (Optional)

- **WebSockets**: Replace polling with real-time WebSocket connections
- **Push Notifications**: Send SMS/email when order is ready
- **Admin Notifications**: Sound/toast when new order arrives
- **Order Queue**: Show estimated pickup time based on queue position

