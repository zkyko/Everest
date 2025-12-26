'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, AppBar, Toolbar, Typography, Divider
} from '@mui/material'
import {
  LayoutDashboard, Package, CreditCard, Settings, Activity, X, Menu as MenuIcon, Home, LogOut
} from 'lucide-react'
import Link from 'next/link'

const drawerWidth = 256

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/integrations', label: 'Integrations', icon: Activity },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/menu', label: 'Menu', icon: MenuIcon },
  ]

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(path)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box>
      <Toolbar sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Everest Admin
        </Typography>
      </Toolbar>
      <List sx={{ p: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            href="/home"
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Home size={20} />
            </ListItemIcon>
            <ListItemText 
              primary="Back to Website"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push(item.path)
                  setMobileOpen(false)
                }}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.contrastText' : 'inherit' }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon size={20} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Everest Admin
          </Typography>
          <IconButton
            color="inherit"
            component={Link}
            href="/home"
            edge="end"
          >
            <Home size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar sx={{ display: { sm: 'none' } }} />
        {children}
      </Box>
    </Box>
  )
}
