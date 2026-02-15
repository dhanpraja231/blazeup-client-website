// src/app/api/freelancer-registration/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const country = formData.get('country') as string
    const domain = formData.get('domain') as string
    const customDomain = formData.get('customDomain') as string
    const speciality = formData.get('speciality') as string
    const customSpeciality = formData.get('customSpeciality') as string
    const workMobile = formData.get('workMobile') as string
    const resume = formData.get('resume') as File

    // Determine final domain and speciality values
    const finalDomain = domain === 'Other' ? customDomain : domain
    const finalSpeciality = speciality === 'Other' ? customSpeciality : 
                           (domain === 'Other' ? customSpeciality : speciality)

    // Validation
    if (!name || !email || !country || !finalDomain || !finalSpeciality) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!resume) {
      return NextResponse.json(
        { success: false, error: 'Resume is required' },
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

    // Validate resume file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(resume.type)) {
      return NextResponse.json(
        { success: false, error: 'Resume must be a PDF or Word document' },
        { status: 400 }
      )
    }

    if (resume.size > 10 * 1024 * 1024) { // 10MB max
      return NextResponse.json(
        { success: false, error: 'Resume file size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('freelancer_registration')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create unique filename
    const fileExt = resume.name.split('.').pop()
    const timestamp = Date.now()
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    const fileName = `${sanitizedName}_${timestamp}.${fileExt}`
    
    // Upload resume to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('freelancer-resumes')
      .upload(fileName, resume, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Resume upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload resume' },
        { status: 500 }
      )
    }

    // Get public URL for the resume
    const { data: publicUrlData } = supabase.storage
      .from('freelancer-resumes')
      .getPublicUrl(fileName)

    // Insert registration data
    const { data: registration, error: insertError } = await supabase
      .from('freelancer_registration')
      .insert({
        name,
        email,
        country,
        domain: finalDomain,
        speciality: finalSpeciality,
        work_mobile: workMobile || null,
        resume_url: publicUrlData.publicUrl,
        resume_filename: resume.name,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Registration insert error:', insertError)
      // Clean up uploaded file
      await supabase.storage.from('freelancer-resumes').remove([fileName])
      
      return NextResponse.json(
        { success: false, error: 'Failed to save registration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! We\'ll get in touch soon.',
      data: {
        id: registration.id,
        name: registration.name,
        email: registration.email,
        domain: registration.domain,
        speciality: registration.speciality
      }
    })

  } catch (error) {
    console.error('Freelancer registration API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}