'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Box, Container, Typography, TextField, Button, Card, CardContent,
  InputAdornment, IconButton
} from '@mui/material'
import { keyframes } from '@emotion/react'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
import { Lock, Mail, Shield, ChevronLeft, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { useToast } from '@/components/Toast'

export default function AdminLogin() {
  const router = useRouter()
  const { setAdmin } = useAuthStore()
  const { addToast } = useToast()
  const [email, setEmail] = useState('admin@everesthoward.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/admin/auth', { email, password })
      if (response.data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', response.data.token)
        }
        setAdmin(true)
        addToast('success', 'Login successful!')
        router.push('/admin')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.error || 'Authentication failed. Please check your credentials.'
      addToast('error', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 500 }, mx: 'auto', minHeight: '100vh', bgcolor: 'background.default', px: 3, py: 6 }}>
      <Button
        startIcon={<ChevronLeft size={20} />}
        onClick={() => router.push('/home')}
        sx={{ mb: 4 }}
      >
        Back
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Box sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: 3, 
          bgcolor: '#F4A26115',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}>
          <Shield size={40} color="#F4A261" />
        </Box>
        <Typography variant="h1" sx={{ mb: 1, textAlign: 'center' }}>
          Admin Access
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 280 }}>
          Elevate your operations. Login to Command Center.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email / Callsign"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@everesthoward.com"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password / Keycode"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <Box component="span" sx={{ display: 'inline-flex', animation: `${spin} 1s linear infinite` }}><Loader2 size={20} /></Box> : <Shield size={20} />}
              >
                {loading ? 'Authenticating...' : 'Initiate Login'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                color="secondary"
                fullWidth
                size="medium"
                onClick={handleLogin}
                disabled={loading}
                sx={{ mt: -1 }}
              >
                Quick Login (Auto-filled)
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Shield size={12} />
          Secure Terminal • V1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Demo: admin@everesthoward.com / admin123
        </Typography>
      </Box>
    </Box>
  )
}

