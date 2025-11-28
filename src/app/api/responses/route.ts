import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const response = await prisma.response.create({
      data: {
        // Personal Info
        respondentFirstName: data.respondentFirstName,
        respondentLastName: data.respondentLastName,
        respondentEmail: data.respondentEmail,
        respondentPhone: data.respondentPhone || null,

        // Section I
        clubName: data.clubName,
        respondentRole: data.respondentRole,
        otherRole: data.otherRole || null,
        hasLabel: data.hasLabel,
        wantsLabelSupport: data.wantsLabelSupport || null,

        // Section II
        hasWelcomedDisabled: data.hasWelcomedDisabled,
        handicapTypes: data.handicapTypes || [],
        otherHandicapType: data.otherHandicapType || null,
        publicTypes: data.publicTypes || [],
        adaptationStory: data.adaptationStory || null,

        // Section III
        supportExpectations: data.supportExpectations || [],
        otherExpectation: data.otherExpectation || null,
        adaptedMaterial: data.adaptedMaterial || [],
        otherMaterial: data.otherMaterial || null,
        desiredAccess: data.desiredAccess || [],
        additionalComments: data.additionalComments || null,
      },
    })

    return NextResponse.json({ success: true, data: response }, { status: 201 })
  } catch (error) {
    console.error('Error creating response:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save response' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || request.headers.get('authorization')?.replace('Bearer ', '')

    // Simple token validation (you should implement proper JWT validation)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const responses = await prisma.response.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: responses })
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
