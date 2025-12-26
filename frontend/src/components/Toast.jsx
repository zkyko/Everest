import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none w-full max-w-[500px] px-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="pointer-events-auto mb-3"
          >
            <div className={`card flex items-center gap-3 p-4 ${
              toast.type === 'success' ? 'border-success/30 bg-success/5' :
              toast.type === 'error' ? 'border-danger/30 bg-danger/5' :
              'border-accent-blue/30 bg-accent-blue/5'
            } border`}>
              {toast.type === 'success' && <CheckCircle2 size={20} className="text-success flex-shrink-0" />}
              {toast.type === 'error' && <XCircle size={20} className="text-danger flex-shrink-0" />}
              {toast.type === 'info' && <AlertCircle size={20} className="text-accent-blue flex-shrink-0" />}
              <p className="flex-grow text-sm font-semibold">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-dim hover:text-text-main transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;

