# 🔍 Order Creation Debugging Guide

## 🚨 What Happened

You got "Order not found" because:
1. The order creation **failed** on the backend
2. The old code created a **dummy order ID** (`order_1234567890`)
3. You were redirected to `/order-status/order_1234567890`
4. That dummy order doesn't exist in the database → "Order not found"

**✅ Fixed:** The new code now shows the **real error** instead of creating dummy orders.

---

## 📊 How to See Logs

### **Method 1: Browser Console (Client-Side)**

1. Open your browser DevTools:
   - **Chrome/Edge:** Press `F12` or `Ctrl+Shift+I`
   - **Safari:** `Cmd+Option+I`
2. Go to the **Console** tab
3. Try placing an order again
4. Look for these logs:

```
🛒 Creating order with items: [...]
📦 Order payload: {...}
✅ Order created: {...}
💳 Checkout session created: {...}
```

**If you see an error:**
```
❌ Checkout error: {...}
Error response: {...}
Error status: 400/500
```

This tells you **exactly what went wrong!**

---

### **Method 2: Vercel Logs (Server-Side)**

1. Go to **Vercel Dashboard**: https://vercel.com/
2. Select your **Everest project**
3. Click **"Logs"** in the sidebar
4. Filter by **"Functions"**
5. Try placing an order again
6. Look for these logs:

```
📥 Received order request: {...}
💰 Calculated total: 12.99
🆔 Generated order ID: abc-123-def
✅ Order created successfully
📦 Creating order items: 2
✅ Order items created successfully
🎉 Order complete! Returning order: abc-123-def
```

**If you see an error:**
```
❌ Error creating order: {...}
Order error details: {...}
```

This shows the **database error** or **validation failure**.

---

## 🔍 Common Issues & Solutions

### **1. Missing Environment Variables**

**Symptoms:**
- Error: "Invalid API key"
- Error: "Unauthorized"
- Logs show `SERVICE_ROLE_KEY exists: false`

**Solution:**
Check Vercel environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these exist (use your actual values from `.env`):
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_YOUR_KEY_HERE
   SUPABASE_SERVICE_ROLE_KEY = sb_secret_YOUR_SECRET_KEY_HERE
   STRIPE_SECRET_KEY = sk_test_YOUR_STRIPE_SECRET_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_STRIPE_PUBLIC_HERE
   JWT_SECRET = your_jwt_secret_here
   ```
3. **Redeploy** after adding/fixing variables

**💡 Tip:** Check your local `.env` file for the correct values!

---

### **2. Database Tables Missing**

**Symptoms:**
- Error: "relation 'orders' does not exist"
- Error: "column 'customer_name' does not exist"

**Solution:**
Run the schema in Supabase SQL Editor:
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `orders`
- `order_items`
- `order_item_modifiers`
- `menu_categories`
- `menu_items`
- `admin_users`
- `payments`

If missing, run `SUPABASE_SCHEMA.sql` from your repo.

---

### **3. RLS (Row Level Security) Blocking Inserts**

**Symptoms:**
- Error: "new row violates row-level security policy"
- Order creation fails silently

**Solution:**
Disable RLS on orders table (since you're using SERVICE_ROLE_KEY):
```sql
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_modifiers DISABLE ROW LEVEL SECURITY;
```

**Or** create RLS policies:
```sql
-- Allow service role to insert
CREATE POLICY "Service role can insert orders" ON orders
  FOR INSERT TO service_role
  USING (true);

CREATE POLICY "Service role can insert order items" ON order_items
  FOR INSERT TO service_role
  USING (true);
```

---

### **4. Cart Items Missing Required Fields**

**Symptoms:**
- Error: "Order must contain at least one item"
- Browser logs show `items_count: 0`

**Solution:**
Check that items in your cart have:
- `id` (menu item ID)
- `name`
- `price`
- `quantity`

Clear your cart and add items again from `/menu`.

---

### **5. Validation Errors**

**Symptoms:**
- Error: "Customer name and email are required"
- Logs show `has_name: false` or `has_email: false`

**Solution:**
Make sure you filled out:
- ✅ Full Name
- ✅ Email
- ✅ Phone (optional)

---

## 🧪 Testing Steps (After Logs Are Deployed)

### **Step 1: Open Browser Console**
1. Press `F12` → Go to **Console** tab
2. Clear old logs (click the 🚫 icon)

### **Step 2: Place a Test Order**
1. Go to https://www.everesthoward.com/menu
2. Add items to cart
3. Click "Checkout"
4. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `512-123-4567`
5. Click "Place Order"

### **Step 3: Check Browser Console**
Look for:
```
🛒 Creating order with items: [...]
📦 Order payload: {...}
```

If you see:
```
✅ Order created: {...}
💳 Checkout session created: {...}
```
**→ SUCCESS! You should be redirected to Stripe checkout.**

If you see:
```
❌ Checkout error: {...}
Error response: {error: "..."}
```
**→ Copy this error and send it to me!**

### **Step 4: Check Vercel Logs**
1. Go to Vercel → Your Project → Logs
2. Look for function logs with timestamps matching your test
3. Check for:
   ```
   📥 Received order request
   ✅ Order created successfully
   ```
   or
   ```
   ❌ Error creating order
   Order error details: {...}
   ```

---

## 📋 What to Send Me

If it still fails, send me:

1. **Browser Console Output** (copy/paste or screenshot)
2. **Vercel Function Logs** (copy the error message)
3. **What you typed in the form:**
   - Name: ?
   - Email: ?
   - Phone: ?
4. **Items in cart:**
   - How many items?
   - Which items?

This will help me pinpoint the exact issue!

---

## 🎯 Expected Flow (When It Works)

```
1. Customer fills form → 🛒 Creating order...
2. API receives request → 📥 Received order request
3. API validates data → ✅ Validation passed
4. API creates order → 💰 Total calculated
5. API inserts to DB → ✅ Order created
6. API creates items → 📦 Order items created
7. API returns order → 🎉 Order complete
8. Frontend gets response → ✅ Order created: {id: "..."}
9. Frontend creates Stripe session → 💳 Checkout session created
10. Redirect to Stripe → (Stripe payment page)
11. Payment complete → Redirect to order status page
12. Customer sees order → 🎉 Order tracking
```

**Every step now has logs!** You'll know exactly where it breaks.

