// /api/debug-pagination/route.js
// Add this endpoint to debug pagination issues

import { NextResponse } from 'next/server'

// You'll need to import or recreate the cache reference
// For now, let's create a simple debug endpoint

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'kitchen rental New York NY'
  const page = searchParams.get('page') || '1'

  // Normalize the query the same way your main API does
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ')
  const expectedTokenKey = `${normalizedQuery}_page_${parseInt(page) - 1}`

  return NextResponse.json({
    message: 'Debug pagination endpoint',
    input: {
      query,
      page,
      normalizedQuery,
      expectedTokenKey,
    },
    timestamp: new Date().toISOString(),
    instructions: {
      message: 'Check your server logs for cache debug info',
      url: `/commercial-kitchen-for-rent/new-york/ny?page=${page}`,
      expectedCacheKey: expectedTokenKey,
    },
  })
}

export async function POST(request) {
  try {
    const { action, query, page } = await request.json()

    if (action === 'test-query') {
      // Test what the normalized query would be
      const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ')
      const tokenKey = `${normalizedQuery}_page_${parseInt(page) - 1}`

      return NextResponse.json({
        originalQuery: query,
        normalizedQuery,
        page,
        expectedTokenKey: tokenKey,
        message: 'This is what your cache key should be',
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug API error', message: error.message },
      { status: 500 }
    )
  }
}
