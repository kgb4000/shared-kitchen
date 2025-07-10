// app/api/test-places/route.js
// Simple test API to check if Google Places is working

export async function POST(request) {
  try {
    const { query } = await request.json()

    console.log('🧪 Test API received query:', query)

    if (!query) {
      return Response.json({ error: 'Query is required' }, { status: 400 })
    }

    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    console.log('📡 Making simple Google Places request...')

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,nextPageToken',
        },
        body: JSON.stringify({
          textQuery: query,
          maxResultCount: 10, // Small number for testing
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Google Places API error:', response.status, errorText)
      return Response.json(
        {
          error: `Google Places API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.log('✅ Test API success:', {
      placesFound: data.places?.length || 0,
      hasNextPageToken: !!data.nextPageToken,
      firstPlace: data.places?.[0]?.displayName?.text || 'None',
    })

    return Response.json({
      success: true,
      query,
      results: {
        count: data.places?.length || 0,
        hasNextPage: !!data.nextPageToken,
        places:
          data.places?.map((p) => ({
            id: p.id,
            name: p.displayName?.text,
            address: p.formattedAddress,
          })) || [],
      },
    })
  } catch (error) {
    console.error('💥 Test API error:', error)
    return Response.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
