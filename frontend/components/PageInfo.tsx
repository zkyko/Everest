'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from '@mui/material'
import { Info, X, Database, Zap } from 'lucide-react'

interface PageInfoProps {
  title: string
  description: string
  endpoints?: string[]
  connections?: string[]
  pageType: 'customer' | 'admin'
}

export default function PageInfo({ 
  title, 
  description, 
  endpoints = [], 
  connections = [],
  pageType 
}: PageInfoProps) {
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <Box sx={{ position: 'fixed', bottom: 100, right: 16, zIndex: 1000 }}>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 3
          }}
        >
          <Info size={20} />
        </IconButton>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          position: 'fixed',
          top: 16,
          right: 16,
          m: 0,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info size={20} color="#F4A261" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(false)} size="small">
            <X size={18} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>

          {connections.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Zap size={16} />
                  How This Connects
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {connections.map((conn, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                      • {conn}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </>
          )}

          {endpoints.length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Database size={16} />
                  Backend Endpoints Used
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {endpoints.map((endpoint, idx) => (
                    <Chip
                      key={idx}
                      label={endpoint}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        bgcolor: pageType === 'admin' ? 'primary.main15' : 'secondary.main15',
                        color: pageType === 'admin' ? 'primary.main' : 'secondary.main',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="contained" size="small">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  )
}


