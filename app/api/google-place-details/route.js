// app/api/google-place-details/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { placeId } = await request.json()

    console.log('=== Google Place Details API Called ===')
    console.log('Place ID:', placeId)

    // Validate input
    if (!placeId) {
      console.error('❌ No place ID provided')
      return NextResponse.json(
        { error: 'Place ID is required' },
        { status: 400 }
      )
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    console.log('🔑 API key check:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      preview: apiKey?.substring(0, 15) + '...' || 'UNDEFINED',
    })

    if (!apiKey || apiKey.length < 30) {
      console.error('❌ Invalid API key')
      return NextResponse.json(
        { error: 'Google Places API key not configured properly' },
        { status: 500 }
      )
    }

    // Define the fields we want to retrieve
    const fields = [
      'id',
      'displayName',
      'formattedAddress',
      'location',
      'rating',
      'userRatingCount',
      'priceLevel',
      'types',
      'businessStatus',
      'currentOpeningHours',
      'regularOpeningHours',
      'nationalPhoneNumber',
      'websiteUri',
      'googleMapsUri',
      'editorialSummary',
      'reviews',
      'photos',
    ].join(',')

    const url = `https://places.googleapis.com/v1/places/${placeId}`

    console.log('🌐 Making request to Google Places API:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fields,
      },
    })

    console.log('📡 Google Places API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Google Places API error:', errorText)

      return NextResponse.json(
        {
          error: `Google Places API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log(
      '✅ Successfully fetched place details:',
      data.displayName?.text
    )

    // DEBUG: Log the place ID fields from Google's response
    console.log('🔍 Place ID Analysis:', {
      'data.id': data.id,
      'data.name': data.name,
      'data.id length': data.id?.length || 0,
      'data.name length': data.name?.length || 0,
      'data.id format': data.id?.substring(0, 10) || 'N/A',
      'other ID fields': Object.keys(data).filter(
        (key) =>
          key.toLowerCase().includes('id') ||
          key.toLowerCase().includes('reference') ||
          key.toLowerCase().includes('place')
      ),
    })

    // Process photos to create usable URLs
    if (data.photos && data.photos.length > 0) {
      console.log('📸 Processing', data.photos.length, 'photos')

      data.photos = data.photos.map((photo, index) => {
        console.log(`📸 Processing photo ${index + 1}:`, photo.name)

        const processedPhoto = {
          ...photo,
          // Generate URLs with API key
          url: `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxWidthPx=800`,
          urlLarge: `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxWidthPx=1600`,
          urlSmall: `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxWidthPx=400`,
          photoName: photo.name,
        }

        // Log the generated URL (with hidden API key for security)
        console.log(
          `📸 Generated URL for photo ${index + 1}:`,
          processedPhoto.url.replace(apiKey, 'API_KEY_HIDDEN')
        )

        return processedPhoto
      })

      console.log('📸 Successfully processed all photos')
    } else {
      console.log('📸 No photos found for this place')
    }

    // Return the place data
    return NextResponse.json({
      success: true,
      place: data,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('💥 Error in place details API:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET method for testing
export async function GET(request) {
  return NextResponse.json(
    {
      message: 'Google Place Details API',
      method: 'POST',
      usage: 'Send POST request with {"placeId": "your_place_id"}',
    },
    { status: 200 }
  )
}
