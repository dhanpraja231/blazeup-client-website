// src/app/api/client-registration/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Extract form fields
    const {
      name,
      email,
      country,
      companyName,
      mobile,
      broadCategories,
      detailedUsecases,
      customNeeds
    } = body

    // Validation
    if (!name || !email || !country) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and country are required' },
        { status: 400 }
      )
    }

    if (!broadCategories || broadCategories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please select at least one category' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('client_registration')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered. We\'ll be in touch soon!' },
        { status: 409 }
      )
    }

    // Insert registration data
    const { data: registration, error: insertError } = await supabase
      .from('client_registration')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        country,
        company_name: companyName || null,
        mobile: mobile || null,
        broad_categories: broadCategories,
        detailed_usecases: detailedUsecases,
        custom_needs: customNeeds || null,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Registration insert error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to save registration. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! We\'ll reach out within 24-48 hours to discuss your project.',
      data: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        categories: registration.broad_categories
      }
    })

  } catch (error) {
    console.error('Client registration API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}