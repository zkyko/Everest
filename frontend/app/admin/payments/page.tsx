'use client'

import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Grid, Button,
  CircularProgress, Chip
} from '@mui/material'
import { CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react'
import api from '@/lib/api'
import { statusColors } from '@/lib/theme'

export default function AdminPayments() {
  const [status, setStatus] = useState({
    connected: true,
    mode: 'test',
    lastPayment: null as any,
    lastWebhook: null as any
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/admin/payments')
        setStatus(prev => response.data || prev)
      } catch (error) {
        console.log('Using default status')
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h1" sx={{ mb: 3 }}>Payments</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h2">Stripe Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {status.connected ? (
                <CheckCircle2 size={24} color={statusColors.low} />
              ) : (
                <AlertCircle size={24} color={statusColors.veryHigh} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {status.connected ? 'Connected' : 'Disconnected'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Mode:</Typography>
            <Chip
              label={status.mode === 'test' ? 'Test' : 'Live'}
              color={status.mode === 'test' ? 'warning' : 'success'}
              size="small"
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<ExternalLink size={18} />}
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
          >
            Open Stripe Dashboard
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Last Payment Received
              </Typography>
              {status.lastPayment ? (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    ${status.lastPayment.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(status.lastPayment.date).toLocaleString()}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No payments yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Last Webhook Received
              </Typography>
              {status.lastWebhook ? (
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    {status.lastWebhook.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(status.lastWebhook.date).toLocaleString()}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No webhooks yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

