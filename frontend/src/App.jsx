import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminOverview from './pages/AdminOverview';
import AdminPayments from './pages/AdminPayments';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminSettings from './pages/AdminSettings';
import AdminLayout from './components/AdminLayout';
import Cart from './components/Cart';
import CheckoutPage from './pages/CheckoutPage';
import OrderStatusPage from './pages/OrderStatusPage';
import Toast from './components/Toast';
import { toast as toastUtil } from './utils/toast';

const BottomNav = ({ cartCount, isAdmin }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const hideNavPaths = ['/checkout', '/order-status', '/login'];
  
  // Hide nav on all admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  if (hideNavPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="bottom-nav"
    >
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <Home size={22} />
        <span>Home</span>
      </Link>
      <Link to="/menu" className={`nav-item ${isActive('/menu') ? 'active' : ''}`}>
        <UtensilsCrossed size={22} />
        <span>Menu</span>
      </Link>
      <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''} relative`}>
        <ShoppingBag size={22} />
        <span>Cart</span>
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
          >
            {cartCount}
          </motion.span>
        )}
      </Link>
      {isAdmin ? (
        <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
          <LayoutDashboard size={22} />
          <span>Admin</span>
        </Link>
      ) : (
        <Link to="/login" className={`nav-item ${isActive('/login') ? 'active' : ''}`}>
          <User size={22} />
          <span>Login</span>
        </Link>
      )}
    </motion.div>
  );
};

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastUtil.subscribe((toastData) => {
      if (toastData.type === 'remove') {
        setToasts(prev => prev.filter(t => t.id !== toastData.id));
      } else {
        setToasts(prev => [...prev, toastData]);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, cartId: Date.now() }]);
    toastUtil.success('Added to cart!');
  };

  const removeFromCart = (index) => {
    setCartItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      if (newItems.length < prev.length) {
        toastUtil.info('Item removed from cart');
      }
      return newItems;
    });
  };

  const updateCartItemQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => {
      const newItems = [...prev];
      const item = { ...newItems[index] };
      // For quantity tracking, we'll duplicate items in cart
      // This is a simple approach - in production you'd track quantity differently
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toastUtil.info('Cart cleared');
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <Router>
      <div className="mobile-container overflow-hidden">
        <div className="ios-status-bar" />
        <Toast toasts={toasts} removeToast={removeToast} />

        <main className="flex-grow pb-24">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage addToCart={addToCart} />} />
              <Route path="/admin" element={
                <AdminLayout>
                  <AdminOverview />
                </AdminLayout>
              } />
              <Route path="/admin/orders" element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } />
              <Route path="/admin/payments" element={
                <AdminLayout>
                  <AdminPayments />
                </AdminLayout>
              } />
              <Route path="/admin/integrations" element={
                <AdminLayout>
                  <AdminIntegrations />
                </AdminLayout>
              } />
              <Route path="/admin/settings" element={
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              } />
              <Route path="/admin/menu" element={
                <AdminLayout>
                  <AdminMenuPage />
                </AdminLayout>
              } />
              <Route path="/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
              <Route path="/cart" element={
                <Cart
                  items={cartItems}
                  removeItem={removeFromCart}
                  updateQuantity={updateCartItemQuantity}
                  total={cartTotal}
                  clearCart={clearCart}
                />
              } />
              <Route path="/checkout" element={
                <CheckoutPage
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  clearCart={clearCart}
                />
              } />
              <Route path="/order-status/:orderId" element={<OrderStatusPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <BottomNav cartCount={cartItems.length} isAdmin={isAdmin} />
      </div>
    </Router>
  );
}

export default App;
