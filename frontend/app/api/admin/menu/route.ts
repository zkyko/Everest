export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
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
    
    const supabase = createServerClient()
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

