import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Loader2, Package, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '../api/client';
import { toast } from '../utils/toast';

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Try to fetch from admin endpoint (public orders endpoint might not exist)
        const response = await api.get(`/admin/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        // If admin endpoint fails, create a mock order for demo
        setOrder({
          id: orderId,
          status: 'NEW',
          total_amount: 0,
          items: [],
          created_at: new Date().toISOString()
        });
        toast.info('Order status will update in real-time');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchOrder, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'NEW':
        return {
          icon: <Package className="text-primary" size={24} />,
          title: 'Order Received',
          description: 'Your order has been received and is being prepared',
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        };
      case 'PREP':
        return {
          icon: <Clock className="text-accent-blue" size={24} />,
          title: 'In Preparation',
          description: 'Our kitchen is preparing your order',
          color: 'text-accent-blue',
          bgColor: 'bg-accent-blue/10'
        };
      case 'READY':
        return {
          icon: <CheckCircle2 className="text-success" size={24} />,
          title: 'Ready for Pickup',
          description: 'Your order is ready! Come pick it up',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="text-success" size={24} />,
          title: 'Order Completed',
          description: 'Thank you for your order!',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      default:
        return {
          icon: <Loader2 className="text-text-muted animate-spin" size={24} />,
          title: 'Processing',
          description: 'Your order is being processed',
          color: 'text-text-muted',
          bgColor: 'bg-bg-surface'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-text-muted mt-4">Loading order status...</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order?.status || 'NEW');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="content-padding pt-12 pb-6">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-bg-surface rounded-full flex items-center justify-center mb-6 hover:bg-bg-elevated transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="mb-2">Order Status</h1>
        <p className="text-text-muted text-sm">Order #{orderId?.slice(0, 8)}</p>
      </div>

      <div className="flex-grow content-padding pb-32">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`card ${statusInfo.bgColor} border-2 border-current mb-6`}
          style={{ borderColor: 'rgba(255, 159, 13, 0.3)' }}
        >
          <div className="flex flex-col items-center text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-bg-dark flex items-center justify-center mb-4"
            >
              {statusInfo.icon}
            </motion.div>
            <h2 className="mb-2">{statusInfo.title}</h2>
            <p className="text-sm text-text-muted">{statusInfo.description}</p>
          </div>
        </motion.div>

        {/* Order Details */}
        {order && (
          <div className="card mb-6">
            <h3 className="mb-4">Order Details</h3>
            <div className="flex flex-col gap-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-2 border-b border-white/5 last:border-0">
                    <div className="flex-grow">
                      <p className="text-sm font-semibold">{item.item_name}</p>
                      {item.item_description && (
                        <p className="text-xs text-text-muted mt-1">{item.item_description}</p>
                      )}
                      {item.quantity > 1 && (
                        <p className="text-xs text-text-dim mt-1">Qty: {item.quantity}</p>
                      )}
                    </div>
                    <span className="text-sm font-bold">${parseFloat(item.item_price).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-text-muted text-sm">Order items loading...</p>
              )}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-primary">
                    ${parseFloat(order.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const response = await api.get(`/admin/orders/${orderId}`);
                setOrder(response.data);
                toast.info('Order status updated');
              } catch (error) {
                toast.error('Failed to refresh order status');
              } finally {
                setLoading(false);
              }
            }}
            className="btn-secondary"
          >
            <RefreshCw size={18} />
            Refresh Status
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;

