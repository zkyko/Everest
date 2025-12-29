'use client'

import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel,
  Grid, CircularProgress
} from '@mui/material'
import { Save } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'
import PageInfo from '@/components/PageInfo'

export default function AdminSettings() {
  const { addToast } = useToast()
  const [settings, setSettings] = useState({
    kitchenLoad: 'LOW',
    deliveryTraffic: 'OFF',
    avgPrepTime: 15,
    pickupBuffer: 5,
    hours: '1:00 PM – 12:00 AM',
    isClosed: false
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings')
        setSettings(prev => response.data || prev)
      } catch (error) {
        console.log('Using default settings')
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/admin/settings', settings)
      addToast('success', 'Settings saved!')
    } catch (error: any) {
      addToast('error', error.response?.data?.detail || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h1" sx={{ mb: 3 }}>Settings</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Order Volume */}
        <Card>
          <CardContent>
            <Typography variant="h2" sx={{ mb: 3 }}>Order Volume</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Walk-in Traffic</InputLabel>
                <Select
                  value={settings.kitchenLoad}
                  label="Walk-in Traffic"
                  onChange={(e) => setSettings({ ...settings, kitchenLoad: e.target.value })}
                >
                  <MenuItem value="LOW">LOW</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HIGH">HIGH</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Delivery Traffic</InputLabel>
                <Select
                  value={settings.deliveryTraffic}
                  label="Delivery Traffic"
                  onChange={(e) => setSettings({ ...settings, deliveryTraffic: e.target.value })}
                >
                  <MenuItem value="OFF">OFF</MenuItem>
                  <MenuItem value="LIGHT">LIGHT</MenuItem>
                  <MenuItem value="HEAVY">HEAVY</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Prep Defaults */}
        <Card>
          <CardContent>
            <Typography variant="h2" sx={{ mb: 3 }}>Prep Defaults</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Avg Prep Time (minutes)"
                  type="number"
                  value={settings.avgPrepTime}
                  onChange={(e) => setSettings({ ...settings, avgPrepTime: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pickup Buffer (minutes)"
                  type="number"
                  value={settings.pickupBuffer}
                  onChange={(e) => setSettings({ ...settings, pickupBuffer: parseInt(e.target.value) })}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardContent>
            <Typography variant="h2" sx={{ mb: 3 }}>Business Info</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Hours"
                value={settings.hours}
                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                placeholder="1:00 PM – 12:00 AM"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.isClosed}
                    onChange={(e) => setSettings({ ...settings, isClosed: e.target.checked })}
                  />
                }
                label="Currently Closed"
              />
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : <Save size={20} />}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  )
}

