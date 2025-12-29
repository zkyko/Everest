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
  Stack,
} from '@mui/material'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useLanguageStore } from '@/lib/store/languageStore'
import { translations } from '@/lib/translations'

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

interface ModifierGroupLike {
  id: string
  name: string
  is_required: boolean
  min_selections?: number
  max_selections?: number
  options: ModifierOption[]
}

interface MenuItemModalProps {
  open: boolean
  item: any
  onClose: () => void
  onAddToCart: (item: any) => void
}

export default function MenuItemModal({ open, item, onClose, onAddToCart }: MenuItemModalProps) {
  const { lang } = useLanguageStore()
  const tm = translations[lang].menu
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>({})

  if (!item) return null

  const defaultModifiers: ModifierGroup[] = [
    {
      id: 'spice',
      name: lang === 'en' ? 'Spice Level' : 'मसाला स्तर',
      is_required: true,
      min_selections: 1,
      max_selections: 1,
      options: [
        { id: 'mild', name: lang === 'en' ? 'Mild' : 'न्यून', price_modifier: 0 },
        { id: 'medium', name: lang === 'en' ? 'Medium' : 'मध्यम', price_modifier: 0 },
        { id: 'hot', name: lang === 'en' ? 'Hot' : 'पिरो', price_modifier: 0 },
        { id: 'extra-hot', name: lang === 'en' ? 'Extra Hot' : 'धेरै पिरो', price_modifier: 0 },
      ],
    },
    {
      id: 'extras',
      name: lang === 'en' ? 'Add-ons' : 'थप परिकार',
      is_required: false,
      min_selections: 0,
      max_selections: 5,
      options: [
        { id: 'extra-rice', name: lang === 'en' ? 'Extra Rice' : 'थप भात', price_modifier: 2.00 },
        { id: 'extra-meat', name: lang === 'en' ? 'Extra Meat' : 'थप मासु', price_modifier: 3.00 },
        { id: 'extra-veggies', name: lang === 'en' ? 'Extra Vegetables' : 'थप तरकारी', price_modifier: 1.50 },
      ],
    },
  ]

  const modifierGroups: ModifierGroupLike[] = item.modifier_groups || defaultModifiers

  const handleModifierChange = (groupId: string, optionId: string, isMultiple: boolean) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || []
      if (isMultiple) {
        const newSelection = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
        return { ...prev, [groupId]: newSelection }
      } else {
        return { ...prev, [groupId]: [optionId] }
      }
    })
  }

  const calculateTotal = () => {
    let total = parseFloat(item.price || 0)
    Object.entries(selectedModifiers).forEach(([groupId, optionIds]) => {
      const group = modifierGroups.find(g => g.id === groupId)
      if (group) {
        optionIds.forEach(id => {
          const opt = group.options.find(o => o.id === id)
          if (opt) total += opt.price_modifier
        })
      }
    })
    return total * quantity
  }

  const handleAddToCart = () => {
    const detailedModifiers: any[] = []
    Object.entries(selectedModifiers).forEach(([groupId, optionIds]) => {
      const group = modifierGroups.find(g => g.id === groupId)
      if (group) {
        optionIds.forEach(id => {
          const opt = group.options.find(o => o.id === id)
          if (opt) {
            detailedModifiers.push({
              id: opt.id,
              name: opt.name,
              price: opt.price_modifier
            })
          }
        })
      }
    })

    const cartItem = {
      ...item,
      quantity,
      selectedModifiers: detailedModifiers,
      price: calculateTotal() / quantity, // Base price + modifiers
    }

    onAddToCart(cartItem)
    onClose()
    setQuantity(1)
    setSelectedModifiers({})
  }

  const canAddToCart = modifierGroups.every(g => !g.is_required || (selectedModifiers[g.id] && selectedModifiers[g.id].length > 0))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 4, bgcolor: 'background.paper', backgroundImage: 'none' }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          aria-label={lang === 'en' ? 'Close' : 'बन्द गर्नुहोस्'}
          sx={{
            position: 'absolute', right: 16, top: 16, zIndex: 1,
            bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
          }}
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ pt: 6, px: 3, pb: 2 }}>
          <Typography variant="h2" sx={{ mb: 1, fontSize: '1.5rem' }}>{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">{item.description}</Typography>
        </Box>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Stack spacing={4}>
            {modifierGroups.map((group) => (
              <Box key={group.id}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {group.name}
                  </Typography>
                  {group.is_required && (
                    <Chip label={lang === 'en' ? 'Required' : 'अनिवार्य'} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                  )}
                </Stack>

                {(group.max_selections ?? 1) === 1 ? (
                  <RadioGroup
                    value={selectedModifiers[group.id]?.[0] || ''}
                    onChange={(e) => handleModifierChange(group.id, e.target.value, false)}
                  >
                    <Stack spacing={1}>
                      {group.options.map((option) => (
                        <Box
                          key={option.id}
                          sx={{
                            display: 'flex', alignItems: 'center', p: 1,
                            borderRadius: 2, border: '1px solid',
                            borderColor: selectedModifiers[group.id]?.[0] === option.id ? 'primary.main' : 'divider',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <FormControlLabel
                            value={option.id}
                            control={<Radio size="small" />}
                            label={
                              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', minWidth: '200px' }}>
                                <Typography variant="body2">{option.name}</Typography>
                                {option.price_modifier > 0 && (
                                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                                    +${option.price_modifier.toFixed(2)}
                                  </Typography>
                                )}
                              </Stack>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </RadioGroup>
                ) : (
                  <Stack spacing={1}>
                    {group.options.map((option) => {
                      const active = selectedModifiers[group.id]?.includes(option.id)
                      return (
                        <Box
                          key={option.id}
                          onClick={() => handleModifierChange(group.id, option.id, true)}
                          sx={{
                            p: 2, borderRadius: 2, border: '1px solid',
                            borderColor: active ? 'primary.main' : 'divider',
                            bgcolor: active ? 'rgba(0,0,0,0.02)' : 'transparent',
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          <Typography variant="body2">{option.name}</Typography>
                          {option.price_modifier > 0 && (
                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                              +${option.price_modifier.toFixed(2)}
                            </Typography>
                          )}
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </Box>
            ))}

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
                {lang === 'en' ? 'Quantity' : 'मात्रा'}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={3}>
                <IconButton
                  aria-label={lang === 'en' ? 'Decrease quantity' : 'मात्रा घटाउनुहोस्'}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <Minus size={18} />
                </IconButton>
                <Typography variant="h3" sx={{ minWidth: 20, textAlign: 'center' }}>{quantity}</Typography>
                <IconButton
                  aria-label={lang === 'en' ? 'Increase quantity' : 'मात्रा बढाउनुहोस्'}
                  onClick={() => setQuantity(q => q + 1)}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <Plus size={18} />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            startIcon={<ShoppingBag size={20} />}
            sx={{ py: 2, borderRadius: 3, justifyContent: 'space-between' }}
          >
            <Box component="span">{tm.addToCart}</Box>
            <Box component="span">${calculateTotal().toFixed(2)}</Box>
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

