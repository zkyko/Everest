'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Chip, IconButton,
  CircularProgress, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { Package, Clock, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import OrderDetailModal from '@/components/OrderDetailModal'
import OrderAlert from '@/components/OrderAlert'
import { statusColors } from '@/lib/theme'
import { supabasePublic } from '@/lib/supabase-public'

export default function AdminOrders() {
  const { addToast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [alertOrder, setAlertOrder] = useState<any>(null)
  const acknowledgedOrders = useRef<Set<string>>(new Set())

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/admin/orders')
      const fetchedOrders = response.data || []
      setOrders(fetchedOrders)
      
      // Check for new unacknowledged orders
      const newOrders = fetchedOrders.filter((o: any) => 
        o.status === 'NEW' && 
        !acknowledgedOrders.current.has(o.id)
      )
      
      // Show alert for first unacknowledged order
      if (newOrders.length > 0 && !alertOrder) {
        setAlertOrder(newOrders[0])
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      const errorMessage = err?.response?.data?.error || err?.response?.data?.detail || err?.message || 'Failed to load orders'
      addToast('error', errorMessage)
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [alertOrder, addToast])

  useEffect(() => {
    fetchData()
    
    // Set up Supabase Realtime subscription for instant updates
    const channel = supabasePublic
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('🔥 Realtime order update:', payload)
          // Refresh data when any order changes
          fetchData()
        }
      )
      .subscribe()

    // Keep polling as fallback (every 30 seconds instead of 10)
    const interval = setInterval(fetchData, 30000)
    
    return () => {
      channel.unsubscribe()
      clearInterval(interval)
    }
  }, [fetchData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
    addToast('info', 'Refreshing orders...')
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await api.post(`/admin/orders/${orderId}/status`, { status: newStatus })
      addToast('success', 'Order status updated!')
      fetchData()
    } catch (error: any) {
      addToast('error', error.response?.data?.detail || 'Failed to update status')
    }
  }

  const handleAcknowledgeAlert = () => {
    if (alertOrder) {
      acknowledgedOrders.current.add(alertOrder.id)
      setAlertOrder(null)
      addToast('success', 'Order acknowledged')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'primary'
      case 'PREP': return 'info'
      case 'READY': return 'success'
      case 'COMPLETED': return 'default'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return <Package size={16} />
      case 'PREP': return <Clock size={16} />
      case 'READY': return <CheckCircle2 size={16} />
      default: return <Package size={16} />
    }
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter((o: any) => o.status === statusFilter)

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Order Alert Modal */}
      <OrderAlert 
        open={!!alertOrder} 
        order={alertOrder} 
        onAcknowledge={handleAcknowledgeAlert}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h1" sx={{ mb: 1 }}>Orders</Typography>
          <Typography variant="body2" color="text.secondary">Kitchen-style order view</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="NEW">New</MenuItem>
              <MenuItem value="PREP">In Prep</MenuItem>
              <MenuItem value="READY">Ready</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={20} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Package size={48} color={statusColors.medium} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <Typography color="text.secondary">No orders found</Typography>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order: any, idx: number) => {
            const itemCount = order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 1
            return (
              <Card 
                key={order.id} 
                sx={{ 
                  borderLeft: `4px solid`, 
                  borderColor: `${getStatusColor(order.status)}.main`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animationDelay: `${idx * 0.05}s`,
                  animationFillMode: 'both',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                      <Box sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2, 
                        bgcolor: `${getStatusColor(order.status)}.main15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: `${getStatusColor(order.status)}.main`
                      }}>
                        {getStatusIcon(order.status)}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          #{String(order.id).slice(-6)} • {order.customer_name || 'Guest'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'} • ${parseFloat(order.total_amount || 0).toFixed(2)}
                        </Typography>
                        {order.created_at && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.created_at).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          sx={{ 
                            '& .MuiSelect-select': { 
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              fontSize: '0.75rem'
                            }
                          }}
                        >
                          <MenuItem value="NEW">NEW</MenuItem>
                          <MenuItem value="PREP">PREP</MenuItem>
                          <MenuItem value="READY">READY</MenuItem>
                          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        onClick={() => {
                          setSelectedOrder(order)
                          setDetailModalOpen(true)
                        }}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                          }
                        }}
                      >
                        <ChevronRight size={20} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )
          })
        )}
      </Box>

      {/* Order Detail Modal */}
      <OrderDetailModal
        open={detailModalOpen}
        order={selectedOrder}
        onClose={() => {
          setDetailModalOpen(false)
          setSelectedOrder(null)
        }}
      />
    </Box>
  )
}

