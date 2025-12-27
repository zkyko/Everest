// Dummy data for demo purposes

export const dummyOrders = [
  {
    id: '101',
    customer_name: 'Sarah J.',
    items: [
      {
        id: '1',
        name: 'Chicken Chow Mein',
        quantity: 1,
        price: 12.99,
        modifiers: { spice_level: 'Hot', extras: ['Extra Rice', 'Extra Meat'] }
      },
      {
        id: '2',
        name: 'Chicken Momo',
        quantity: 1,
        price: 12.99,
        modifiers: { spice_level: 'Medium', extras: [] }
      }
    ],
    total_amount: 32.50,
    status: 'NEW',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    payment_status: 'paid'
  },
  {
    id: '102',
    customer_name: 'Mike R.',
    items: [
      {
        id: '3',
        name: 'Chatpate',
        quantity: 1,
        price: 6.99,
        modifiers: { spice_level: 'Extra Hot', extras: ['Extra Sauce'] }
      },
      {
        id: '4',
        name: 'Chiya',
        quantity: 1,
        price: 3.50,
        modifiers: { spice_level: null, extras: [] }
      }
    ],
    total_amount: 14.50,
    status: 'PREP',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    payment_status: 'paid'
  },
  {
    id: '103',
    customer_name: 'Jane C.',
    items: [
      {
        id: '5',
        name: 'Chicken Curry',
        quantity: 2,
        price: 13.99,
        modifiers: { spice_level: 'Mild', extras: ['Extra Vegetables'] }
      },
      {
        id: '6',
        name: 'Paneer Tikka Masala',
        quantity: 1,
        price: 13.00,
        modifiers: { spice_level: 'Medium', extras: [] }
      }
    ],
    total_amount: 48.00,
    status: 'READY',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    payment_status: 'paid'
  },
  {
    id: '104',
    customer_name: 'David K.',
    items: [
      {
        id: '7',
        name: 'Mix Buff Sukuti & Fried Chicken Momo (5 pcs)',
        quantity: 1,
        price: 15.99,
        modifiers: { spice_level: 'Hot', extras: ['Extra Sauce'] }
      },
      {
        id: '8',
        name: 'Veg Momos',
        quantity: 1,
        price: 11.99,
        modifiers: { spice_level: 'Medium', extras: [] }
      }
    ],
    total_amount: 27.98,
    status: 'NEW',
    created_at: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    payment_status: 'paid'
  },
  {
    id: '105',
    customer_name: 'Emily T.',
    items: [
      {
        id: '9',
        name: 'Chicken Jhol Momo',
        quantity: 1,
        price: 12.99,
        modifiers: { spice_level: 'Medium', extras: ['Extra Rice'] }
      },
      {
        id: '10',
        name: 'Samosa',
        quantity: 2,
        price: 5.99,
        modifiers: { spice_level: null, extras: [] }
      }
    ],
    total_amount: 18.98,
    status: 'PREP',
    created_at: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
    payment_status: 'paid'
  },
  {
    id: '106',
    customer_name: 'Robert L.',
    items: [
      {
        id: '11',
        name: 'Mutton Bhutuwa',
        quantity: 1,
        price: 15.99,
        modifiers: { spice_level: 'Hot', extras: ['Extra Meat'] }
      },
      {
        id: '12',
        name: 'Basmati Rice',
        quantity: 1,
        price: 7.99,
        modifiers: { spice_level: null, extras: [] }
      }
    ],
    total_amount: 23.98,
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    payment_status: 'paid'
  },
  {
    id: '107',
    customer_name: 'Lisa M.',
    items: [
      {
        id: '13',
        name: 'Sukuti Chow Mein (Buff)',
        quantity: 1,
        price: 14.99,
        modifiers: { spice_level: 'Extra Hot', extras: ['Extra Rice', 'Extra Meat'] }
      }
    ],
    total_amount: 14.99,
    status: 'NEW',
    created_at: new Date(Date.now() - 1 * 60000).toISOString(), // 1 minute ago
    payment_status: 'paid'
  },
  {
    id: '108',
    customer_name: 'James P.',
    items: [
      {
        id: '14',
        name: 'Chilli Chicken (6 oz)',
        quantity: 1,
        price: 12.99,
        modifiers: { spice_level: 'Hot', extras: [] }
      },
      {
        id: '15',
        name: 'Veg Thuppa (3 oz)',
        quantity: 1,
        price: 10.99,
        modifiers: { spice_level: 'Mild', extras: ['Extra Vegetables'] }
      }
    ],
    total_amount: 23.98,
    status: 'READY',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    payment_status: 'paid'
  }
]

// Calculate metrics from dummy orders
export const getDummyMetrics = () => {
  const today = new Date().toDateString()
  const ordersToday = dummyOrders.filter((o: any) => {
    const orderDate = new Date(o.created_at).toDateString()
    return orderDate === today
  })

  const activeOrders = dummyOrders.filter((o: any) => o.status !== 'COMPLETED').length
  const revenue = ordersToday.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0)

  // Determine wait time based on active orders
  let waitTime = '12-15 min'
  let waitTimeLevel = 'LOW'
  
  if (activeOrders >= 5) {
    waitTime = '25-30 min'
    waitTimeLevel = 'HIGH'
  } else if (activeOrders >= 3) {
    waitTime = '18-22 min'
    waitTimeLevel = 'MEDIUM'
  }

  return {
    ordersToday: ordersToday.length,
    activeOrders,
    revenue,
    waitTime,
    waitTimeLevel
  }
}


