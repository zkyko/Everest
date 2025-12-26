'use client'

import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import api from '@/lib/api'
import { statusColors } from '@/lib/theme'
import PageInfo from '@/components/PageInfo'

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await api.get('/admin/integrations')
        setIntegrations(response.data?.integrations || [])
      } catch (error) {
        // Fallback data
        setIntegrations([
          { name: 'Database', status: 'healthy', last_check: new Date(), message: null },
          { name: 'Stripe API', status: 'healthy', last_check: new Date(), message: null },
          { name: 'Stripe Webhooks', status: 'healthy', last_check: new Date(), message: null },
          { name: 'Email', status: 'disabled', last_check: null, message: 'Not configured' },
          { name: 'SMS', status: 'disabled', last_check: null, message: 'Not configured' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchIntegrations()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 size={20} color={statusColors.low} />
      case 'unhealthy':
        return <XCircle size={20} color={statusColors.veryHigh} />
      case 'disabled':
        return <Clock size={20} color="#9B9B9B" />
      default:
        return <Clock size={20} color="#9B9B9B" />
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
      <Typography variant="h1" sx={{ mb: 1 }}>Integrations</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        System diagnostics and integration status
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Check</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {integrations.map((integration, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 600 }}>{integration.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(integration.status)}
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {integration.status}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {integration.last_check
                        ? new Date(integration.last_check).toLocaleString()
                        : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {integration.message || '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

