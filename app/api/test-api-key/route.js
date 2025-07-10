// app/api/test-api-key/route.js
// Simple endpoint to test if API key is loaded correctly

import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    console.log('=== API Key Test ===')

    // Check environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    console.log('Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- API key exists:', !!apiKey)
    console.log('- API key length:', apiKey?.length || 0)
    console.log(
      '- API key starts with AIza:',
      apiKey?.startsWith('AIza') || false
    )
    console.log('- First 10 chars:', apiKey?.substring(0, 10) || 'NONE')

    // List all environment variables that contain 'GOOGLE'
    const googleEnvVars = Object.keys(process.env).filter((key) =>
      key.toUpperCase().includes('GOOGLE')
    )
    console.log('- Google-related env vars:', googleEnvVars)

    return NextResponse.json({
      success: true,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyValid: apiKey?.length > 30 && apiKey?.startsWith('AIza'),
      apiKeyPreview: apiKey?.substring(0, 15) + '...' || 'NOT_FOUND',
      googleEnvVars,
      nodeEnv: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error('Error in API key test:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
