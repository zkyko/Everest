export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyToken } from '@/lib/auth'

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  return verifyToken(token)
}

// PUT /api/admin/menu/item/[itemId] - Update a menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, price, category_id, is_available, display_order, modifier_groups } = body
    const itemId = params.itemId

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Update the menu item
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (category_id !== undefined) updateData.category_id = category_id || null
    if (is_available !== undefined) updateData.is_available = is_available
    if (display_order !== undefined) updateData.display_order = display_order

    const { data: menuItem, error: itemError } = await supabaseAdmin
      .from('menu_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single()

    if (itemError) {
      console.error('Error updating menu item:', itemError)
      return NextResponse.json(
        { error: 'Failed to update menu item', details: itemError.message },
        { status: 500 }
      )
    }

    // If modifier groups are provided, replace them
    if (modifier_groups !== undefined) {
      // Delete existing modifier groups (cascade will delete options)
      await supabaseAdmin
        .from('modifier_groups')
        .delete()
        .eq('menu_item_id', itemId)

      // Create new modifier groups
      if (Array.isArray(modifier_groups) && modifier_groups.length > 0) {
        for (const group of modifier_groups) {
          const { data: modifierGroup, error: groupError } = await supabaseAdmin
            .from('modifier_groups')
            .insert({
              menu_item_id: itemId,
              name: group.name,
              is_required: group.is_required || false,
              display_order: group.display_order || 0
            })
            .select()
            .single()

          if (groupError) {
            console.error('Error creating modifier group:', groupError)
            continue
          }

          // Create modifier options
          if (group.options && Array.isArray(group.options)) {
            for (const option of group.options) {
              await supabaseAdmin
                .from('modifier_options')
                .insert({
                  modifier_group_id: modifierGroup.id,
                  name: option.name,
                  price_adjustment: option.price_adjustment || 0,
                  display_order: option.display_order || 0
                })
            }
          }
        }
      }
    }

    // Fetch the complete item with modifier groups
    const { data: completeItem, error: fetchError } = await supabaseAdmin
      .from('menu_items')
      .select(`
        *,
        modifier_groups (
          id,
          name,
          is_required,
          display_order,
          modifier_options (
            id,
            name,
            price_adjustment,
            display_order
          )
        )
      `)
      .eq('id', itemId)
      .single()

    return NextResponse.json(completeItem || menuItem)
  } catch (error: any) {
    console.error('Menu item API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/menu/item/[itemId] - Delete a menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const itemId = params.itemId

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error deleting menu item:', error)
      return NextResponse.json(
        { error: 'Failed to delete menu item', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Menu item API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

