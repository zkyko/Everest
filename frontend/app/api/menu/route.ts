export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Fetch menu categories with items
    const { data: categories, error: categoriesError } = await supabase
      .from('menu_categories')
      .select(`
        *,
        menu_items (
          *,
          modifier_groups (
            *,
            modifier_options (*)
          )
        )
      `)
      .eq('is_active', true)
      .order('display_order')
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      return NextResponse.json(
        { error: 'Failed to fetch menu' },
        { status: 500 }
      )
    }
    
    // Sort menu items within each category
    const sortedCategories = categories?.map(category => ({
      ...category,
      menu_items: category.menu_items
        ?.filter((item: any) => item.is_available)
        .sort((a: any, b: any) => a.display_order - b.display_order) || []
    }))
    
    return NextResponse.json({ categories: sortedCategories || [] })
  } catch (error: any) {
    console.error('Menu API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

