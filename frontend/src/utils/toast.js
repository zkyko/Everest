let toastId = 0;
let toastListeners = [];

export const toast = {
  success: (message) => {
    const id = ++toastId;
    toastListeners.forEach(listener => listener({ id, type: 'success', message }));
    setTimeout(() => {
      toastListeners.forEach(listener => listener({ id, type: 'remove' }));
    }, 4000);
  },
  error: (message) => {
    const id = ++toastId;
    toastListeners.forEach(listener => listener({ id, type: 'error', message }));
    setTimeout(() => {
      toastListeners.forEach(listener => listener({ id, type: 'remove' }));
    }, 5000);
  },
  info: (message) => {
    const id = ++toastId;
    toastListeners.forEach(listener => listener({ id, type: 'info', message }));
    setTimeout(() => {
      toastListeners.forEach(listener => listener({ id, type: 'remove' }));
    }, 4000);
  },
  subscribe: (listener) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }
};

