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

// POST /api/admin/menu/category - Create a new category
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
    const { name, display_order } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('menu_categories')
      .insert({
        name,
        display_order: display_order || 0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { error: 'Failed to create category', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Category API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

