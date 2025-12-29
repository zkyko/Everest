'use client'

import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Chip, IconButton,
  CircularProgress, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { Package, Clock, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import OrderDetailModal from '@/components/OrderDetailModal'
import { statusColors } from '@/lib/theme'

export default function AdminOrders() {
  const { addToast } = useToast()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/orders')
      setOrders(response.data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      addToast('error', 'Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

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

