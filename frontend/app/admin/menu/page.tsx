'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress,
  Grid, Checkbox, FormControlLabel
} from '@mui/material'
import { Plus, Edit2, Trash2, Tag, CheckCircle2, X, DollarSign, Package } from 'lucide-react'
import api from '@/lib/api'
import { useToast } from '@/components/Toast'

interface MenuItemData {
  name: string
  description: string
  price: number
  category_id: string | null
  is_available: boolean
  display_order: number
}

export default function AdminMenu() {
  const { addToast } = useToast()
  const [menu, setMenu] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)

  const fetchMenu = useCallback(async () => {
    try {
      const response = await api.get('/admin/menu')
      console.log('📋 Menu data received:', response.data)
      setMenu(response.data || [])
    } catch (error) {
      console.error('Failed to fetch menu:', error)
      addToast('error', 'Failed to load menu')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  const handleAddCategory = async (name: string) => {
    try {
      await api.post('/admin/menu/category', {
        name,
        display_order: menu.length
      })
      addToast('success', 'Category added!')
      setShowAddCategory(false)
      fetchMenu()
    } catch (error: any) {
      addToast('error', error.response?.data?.detail || 'Failed to add category')
    }
  }

  const handleAddItem = async (itemData: any) => {
    try {
      await api.post('/admin/menu/item', itemData)
      addToast('success', 'Menu item added!')
      setShowAddItem(false)
      fetchMenu()
    } catch (error: any) {
      addToast('error', error.response?.data?.detail || 'Failed to add item')
    }
  }

  const handleUpdateItem = async (itemId: string, itemData: any) => {
    try {
      await api.put(`/admin/menu/item/${itemId}`, itemData)
      addToast('success', 'Item updated!')
      setEditingItem(null)
      fetchMenu()
    } catch (error: any) {
      addToast('error', error.response?.data?.detail || 'Failed to update item')
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    
    try {
      await api.delete(`/admin/menu/item/${itemId}`)
      addToast('success', 'Item deleted!')
      fetchMenu()
    } catch (error: any) {
      addToast('error', error.response?.data?.detail || 'Failed to delete item')
    }
  }

  const handleToggleAvailability = async (item: any) => {
    try {
      console.log('🔄 Toggling availability for item:', item.id, 'Current status:', item.is_available)
      
      // Use the correct API endpoint with query params
      const action = item.is_available ? 'soldout' : 'available'
      await api.post(`/admin/menu?id=${item.id}&action=${action}`)
      
      addToast('success', item.is_available ? '🚫 Marked as sold out' : '✅ Marked as available')
      fetchMenu()
    } catch (error: any) {
      console.error('Failed to toggle availability:', error)
      addToast('error', error.response?.data?.error || 'Failed to update availability')
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h1" sx={{ mb: 1 }}>Menu Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage your menu items and categories</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Tag size={18} />}
            onClick={() => setShowAddCategory(true)}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setShowAddItem(true)}
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {menu.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <Typography color="text.secondary" sx={{ mb: 2 }}>No menu items yet</Typography>
            <Button variant="contained" onClick={() => setShowAddItem(true)}>
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {menu.map((category) => (
            <Card key={category.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h2">{category.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(category.menu_items || category.items)?.length || 0} items
                  </Typography>
                </Box>
                {(category.menu_items || category.items) && (category.menu_items || category.items).length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {(category.menu_items || category.items).map((item: any) => (
                      <MenuItemRow
                        key={item.id}
                        item={item}
                        onEdit={setEditingItem}
                        onDelete={handleDeleteItem}
                        onToggleAvailability={handleToggleAvailability}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No items in this category
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add Category Dialog */}
      <CategoryDialog
        open={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSave={handleAddCategory}
      />

      {/* Add/Edit Item Dialog */}
      <ItemDialog
        open={showAddItem || !!editingItem}
        item={editingItem}
        categories={menu}
        onClose={() => {
          setShowAddItem(false)
          setEditingItem(null)
        }}
        onSave={(data: MenuItemData) => {
          if (editingItem) {
            handleUpdateItem(editingItem.id, data)
          } else {
            handleAddItem(data)
          }
        }}
      />
    </Box>
  )
}

function MenuItemRow({ item, onEdit, onDelete, onToggleAvailability }: any) {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      p: 2, 
      bgcolor: 'grey.50', 
      borderRadius: 2,
      '&:hover': { bgcolor: 'grey.100' }
    }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {item.name}
          </Typography>
          {!item.is_available && (
            <Chip label="Sold Out" size="small" color="error" />
          )}
        </Box>
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
            {item.description}
          </Typography>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          ${parseFloat(item.price).toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => onToggleAvailability(item)}
          color={item.is_available ? 'success' : 'error'}
          size="small"
        >
          {item.is_available ? <CheckCircle2 size={18} /> : <X size={18} />}
        </IconButton>
        <IconButton onClick={() => onEdit(item)} color="primary" size="small">
          <Edit2 size={18} />
        </IconButton>
        <IconButton onClick={() => onDelete(item.id)} color="error" size="small">
          <Trash2 size={18} />
        </IconButton>
      </Box>
    </Box>
  )
}

function CategoryDialog({ open, onClose, onSave }: any) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async () => {
    if (!name.trim()) {
      addToast('error', 'Category name is required')
      return
    }
    setSaving(true)
    await onSave(name.trim())
    setSaving(false)
    setName('')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Nepalese Food Items"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? 'Saving...' : 'Add Category'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ItemDialog({ open, item, categories, onClose, onSave }: any) {
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price ? parseFloat(item.price).toFixed(2) : '',
    category_id: item?.category_id || (categories[0]?.id || ''),
    is_available: item?.is_available !== undefined ? item.is_available : true,
    display_order: item?.display_order || 0
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price ? parseFloat(item.price).toFixed(2) : '',
        category_id: item.category_id || (categories[0]?.id || ''),
        is_available: item.is_available !== undefined ? item.is_available : true,
        display_order: item.display_order || 0
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: categories[0]?.id || '',
        is_available: true,
        display_order: 0
      })
    }
  }, [item, categories])

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.price) {
      addToast('error', 'Name and price are required')
      return
    }
    setSaving(true)
    await onSave({
      ...formData,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null
    })
    setSaving(false)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Edit Item' : 'Add Menu Item'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Item Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Chicken Chow Mein"
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the item..."
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price *"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                inputProps={{
                  step: "0.01"
                }}
                InputProps={{
                  startAdornment: <DollarSign size={18} style={{ marginRight: 8, opacity: 0.5 }} />
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id || ''}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <MenuItem value="">No Category</MenuItem>
                  {categories.map((cat: any) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              />
            }
            label="Item is available"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

