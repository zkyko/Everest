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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Chip,
  Divider,
} from '@mui/material'
import { X, Plus, Minus } from 'lucide-react'

interface ModifierGroup {
  id: string
  name: string
  is_required: boolean
  min_selections: number
  max_selections: number
  options: ModifierOption[]
}

interface ModifierOption {
  id: string
  name: string
  price_modifier: number
}

interface MenuItemModalProps {
  open: boolean
  item: any
  onClose: () => void
  onAddToCart: (item: any, modifiers: Record<string, string[]>) => void
}

export default function MenuItemModal({ open, item, onClose, onAddToCart }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})

  if (!item) return null

  // Default modifier groups for demo (spice level, etc.)
  const defaultModifiers: ModifierGroup[] = [
    {
      id: 'spice',
      name: 'Spice Level',
      is_required: true,
      min_selections: 1,
      max_selections: 1,
      options: [
        { id: 'mild', name: 'Mild', price_modifier: 0 },
        { id: 'medium', name: 'Medium', price_modifier: 0 },
        { id: 'hot', name: 'Hot', price_modifier: 0 },
        { id: 'extra-hot', name: 'Extra Hot', price_modifier: 0 },
      ],
    },
    {
      id: 'extras',
      name: 'Add-ons',
      is_required: false,
      min_selections: 0,
      max_selections: 5,
      options: [
        { id: 'extra-rice', name: 'Extra Rice', price_modifier: 2.00 },
        { id: 'extra-meat', name: 'Extra Meat', price_modifier: 3.00 },
        { id: 'extra-veggies', name: 'Extra Vegetables', price_modifier: 1.50 },
        { id: 'extra-sauce', name: 'Extra Sauce', price_modifier: 0.50 },
      ],
    },
  ]

  const modifierGroups = item.modifier_groups || defaultModifiers

  const handleModifierChange = (groupId: string, optionId: string, isMultiple: boolean) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || []
      if (isMultiple) {
        // Toggle selection for multiple choice
        const newSelection = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
        return { ...prev, [groupId]: newSelection }
      } else {
        // Single selection
        return { ...prev, [groupId]: [optionId] }
      }
    })
  }

  const calculateTotal = () => {
    let total = parseFloat(item.price || 0) * quantity
    Object.values(selectedModifiers).forEach((optionIds) => {
      modifierGroups.forEach((group) => {
        optionIds.forEach((optionId) => {
          const option = group.options.find((opt) => opt.id === optionId)
          if (option) {
            total += parseFloat(String(option.price_modifier || 0)) * quantity
          }
        })
      })
    })
    return total
  }

  const handleAddToCart = () => {
    // Validate required modifiers
    for (const group of modifierGroups) {
      if (group.is_required && (!selectedModifiers[group.id] || selectedModifiers[group.id].length === 0)) {
        return // Don't add if required modifier is missing
      }
    }
    onAddToCart(item, selectedModifiers)
    onClose()
    setQuantity(1)
    setSelectedModifiers({})
  }

  const canAddToCart = modifierGroups.every(
    (group) => !group.is_required || (selectedModifiers[group.id] && selectedModifiers[group.id].length > 0)
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2">{item.name}</Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {item.description}
          </Typography>
        )}

        {/* Modifier Groups */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {modifierGroups.map((group) => (
            <FormControl key={group.id} required={group.is_required}>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                {group.name}
                {group.is_required && <Chip label="Required" size="small" sx={{ ml: 1, height: 20 }} />}
              </FormLabel>
              {group.max_selections === 1 ? (
                // Single selection (Radio)
                <RadioGroup
                  value={selectedModifiers[group.id]?.[0] || ''}
                  onChange={(e) => handleModifierChange(group.id, e.target.value, false)}
                >
                  {group.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', ml: 1 }}>
                          <Typography>{option.name}</Typography>
                          {option.price_modifier > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              +${option.price_modifier.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              ) : (
                // Multiple selection (Checkboxes)
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {group.options.map((option) => {
                    const isSelected = selectedModifiers[group.id]?.includes(option.id) || false
                    return (
                      <Box
                        key={option.id}
                        onClick={() => handleModifierChange(group.id, option.id, true)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          bgcolor: isSelected ? 'action.selected' : 'transparent',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Typography>{option.name}</Typography>
                        {option.price_modifier > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            +${option.price_modifier.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )}
            </FormControl>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Quantity Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3">Quantity</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              size="small"
            >
              <Minus size={18} />
            </IconButton>
            <Typography variant="h4" sx={{ minWidth: 40, textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton onClick={() => setQuantity(quantity + 1)} size="small">
              <Plus size={18} />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ${calculateTotal().toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            startIcon={<Plus size={18} />}
            size="large"
          >
            Add to Cart
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

