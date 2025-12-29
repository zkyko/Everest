export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyToken } from '@/lib/auth'

// Helper to verify admin token
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  return verifyToken(token)
}

// GET /api/admin/menu - Get all menu items with categories
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = supabaseAdmin

    // Fetch all categories with their menu items
    const { data: categories, error } = await supabase
      .from('menu_categories')
      .select(`
        id,
        name,
        display_order,
        is_active,
        created_at,
        menu_items (
          id,
          name,
          description,
          price,
          is_available,
          display_order,
          category_id,
          created_at
        )
      `)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching menu:', error)
      return NextResponse.json(
        { error: 'Failed to fetch menu' },
        { status: 500 }
      )
    }

    return NextResponse.json(categories || [])
  } catch (error: any) {
    console.error('Admin menu API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/menu/item/[id]/soldout - Mark item as sold out
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = supabaseAdmin
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('id')
    const action = searchParams.get('action') || 'soldout'
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }
    
    const isAvailable = action === 'available'
    
    const { data: item, error } = await supabase
      .from('menu_items')
      .update({ is_available: isAvailable })
      .eq('id', itemId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating menu item:', error)
      return NextResponse.json(
        { error: 'Failed to update menu item' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Admin menu API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

