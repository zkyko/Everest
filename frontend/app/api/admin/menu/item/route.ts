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

// POST /api/admin/menu/item - Create a new menu item
export async function POST(request: NextRequest) {
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

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    // Create the menu item
    const { data: menuItem, error: itemError } = await supabaseAdmin
      .from('menu_items')
      .insert({
        name,
        description: description || null,
        price: parseFloat(price),
        category_id: category_id || null,
        is_available: is_available !== false,
        display_order: display_order || 0
      })
      .select()
      .single()

    if (itemError) {
      console.error('Error creating menu item:', itemError)
      return NextResponse.json(
        { error: 'Failed to create menu item', details: itemError.message },
        { status: 500 }
      )
    }

    // If modifier groups are provided, create them
    if (modifier_groups && Array.isArray(modifier_groups) && modifier_groups.length > 0) {
      for (const group of modifier_groups) {
        const { data: modifierGroup, error: groupError } = await supabaseAdmin
          .from('modifier_groups')
          .insert({
            menu_item_id: menuItem.id,
            name: group.name,
            is_required: group.is_required || false,
            display_order: group.display_order || 0
          })
          .select()
          .single()

        if (groupError) {
          console.error('Error creating modifier group:', groupError)
          continue // Continue with other groups even if one fails
        }

        // Create modifier options for this group
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
      .eq('id', menuItem.id)
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

