'use client'

import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Grid, IconButton,
  CircularProgress, LinearProgress, Chip
} from '@mui/material'
import { Package, TrendingUp, Activity, Clock, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import { statusColors } from '@/lib/theme'
import { getDummyMetrics } from '@/lib/dummyData'
import PageInfo from '@/components/PageInfo'

export default function AdminOverview() {
  const { addToast } = useToast()
  const [metrics, setMetrics] = useState({
    ordersToday: 0,
    activeOrders: 0,
    revenue: 0,
    waitTime: '12-15 min',
    waitTimeLevel: 'LOW'
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const [ordersRes, volumeRes] = await Promise.all([
        api.get('/admin/orders').catch(() => ({ data: [] })),
        api.get('/metrics/volume').catch(() => ({ data: { load_state: 'LOW' } }))
      ])

      const orders = ordersRes.data || []
      const loadState = volumeRes.data?.load_state || 'LOW'

      const today = new Date().toDateString()
      const ordersToday = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at || Date.now()).toDateString()
        return orderDate === today
      })

      const activeOrders = orders.filter((o: any) => o.status !== 'COMPLETED').length
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

      setMetrics({
        ordersToday: ordersToday.length,
        activeOrders,
        revenue,
        waitTime,
        waitTimeLevel
      })
    } catch (err) {
      // Use dummy data
      const dummyMetrics = getDummyMetrics()
      setMetrics(dummyMetrics)
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
    addToast('info', 'Refreshing data...')
  }

  const getWaitTimeColor = (level: string) => {
    switch (level) {
      case 'LOW': return statusColors.low
      case 'MEDIUM': return statusColors.medium
      case 'HIGH': return statusColors.high
      default: return statusColors.low
    }
  }

  const getWaitTimePercentage = (level: string) => {
    switch (level) {
      case 'LOW': return 25
      case 'MEDIUM': return 50
      case 'HIGH': return 75
      default: return 25
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <PageInfo
        title="Admin Overview Dashboard"
        description="This is the main control center for the food truck owner. It shows real-time metrics like today's orders, active orders in the kitchen, revenue, and estimated wait times. The wait time automatically adjusts based on how many orders are currently being prepared."
        endpoints={['GET /admin/orders', 'GET /metrics/volume']}
        connections={[
          'Orders page: Click to see detailed order list and manage order statuses',
          'Menu page: Manage menu items, prices, and availability',
          'Payments page: View payment transactions and Stripe integration status',
          'Settings page: Configure wait times, hours, and business info'
        ]}
        pageType="admin"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h1" sx={{ mb: 1 }}>Overview</Typography>
          <Typography variant="body2" color="text.secondary">How busy am I right now?</Typography>
        </Box>
        <IconButton
          onClick={handleRefresh}
          disabled={refreshing}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'action.selected' },
            '&.Mui-disabled': { opacity: 0.5 }
          }}
        >
          <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Package size={24} color={statusColors.low} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                {metrics.ordersToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Orders Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Activity size={24} color={statusColors.medium} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                {metrics.activeOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <TrendingUp size={24} color={statusColors.low} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, color: 'secondary.main' }}>
                ${metrics.revenue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue (Web)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Clock size={24} color={getWaitTimeColor(metrics.waitTimeLevel)} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                {metrics.waitTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wait Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h2" sx={{ mb: 3 }}>Wait Time</Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Current Wait Time
              </Typography>
              <Chip
                label={metrics.waitTimeLevel}
                size="small"
                sx={{
                  bgcolor: `${getWaitTimeColor(metrics.waitTimeLevel)}15`,
                  color: getWaitTimeColor(metrics.waitTimeLevel),
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 32,
                bgcolor: 'action.hover',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${getWaitTimePercentage(metrics.waitTimeLevel)}%`,
                  bgcolor: getWaitTimeColor(metrics.waitTimeLevel),
                  transition: 'width 0.5s ease-in-out',
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={16} color={statusColors.medium} />
            <Typography variant="body2" color="text.secondary">
              Estimated wait time:{' '}
              <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {metrics.waitTime}
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
