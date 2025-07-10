// app/api/google-place-api/route.js
// Complete Redis-powered API

import { createClient } from 'redis'

let redisClient = null

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })
    redisClient.on('error', (err) => console.error('Redis Error:', err))
    await redisClient.connect()
  }
  return redisClient
}

async function getPageToken(query, page) {
  try {
    const redis = await getRedisClient()
    const key = `token:${query}:${page}`
    const token = await redis.get(key)
    console.log(`🔍 Redis token for ${key}:`, token ? 'Found' : 'Not found')
    return token
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

async function setPageToken(query, page, token) {
  try {
    const redis = await getRedisClient()
    const key = `token:${query}:${page}`
    await redis.setEx(key, 600, token) // 10 minute expiry
    console.log(`💾 Redis cached token for ${key}`)
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

async function getTotal(query) {
  try {
    const redis = await getRedisClient()
    const key = `total:${query}`
    const total = await redis.get(key)
    return total ? parseInt(total) : null
  } catch (error) {
    console.error('Redis get total error:', error)
    return null
  }
}

async function setTotal(query, total) {
  try {
    const redis = await getRedisClient()
    const key = `total:${query}`
    await redis.setEx(key, 3600, total.toString()) // 1 hour expiry
    console.log(`💾 Redis cached total ${total} for ${key}`)
  } catch (error) {
    console.error('Redis set total error:', error)
  }
}

export async function POST(request) {
  try {
    const { query, page = 1, pageSize = 20 } = await request.json()

    console.log('🚀 API Route received:', { query, page, pageSize })

    if (!query) {
      return Response.json({ error: 'Query is required' }, { status: 400 })
    }

    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    const baseQuery = query.toLowerCase().trim()

    // Prepare request body
    let requestBody = {
      textQuery: query,
      maxResultCount: 20,
    }

    // Handle pagination with Redis
    if (page > 1) {
      const pageToken = await getPageToken(baseQuery, page - 1)

      if (pageToken) {
        requestBody.pageToken = pageToken
        console.log(`✅ Using Redis page token for page ${page}`)
      } else {
        console.warn(`⚠️ No page token found for page ${page}`)
        return Response.json(
          {
            error: 'Page token not found. Please start from page 1.',
            code: 'TOKEN_NOT_FOUND',
          },
          { status: 400 }
        )
      }
    }

    console.log('📡 Making Google Places API request...')

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,places.currentOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.types,nextPageToken',
        },
        body: JSON.stringify(requestBody),
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

    console.log('✅ Google Places API success:', {
      placesFound: data.places?.length || 0,
      hasNextPageToken: !!data.nextPageToken,
    })

    // Cache next page token
    if (data.nextPageToken) {
      await setPageToken(baseQuery, page, data.nextPageToken)
    }

    // Handle total estimation
    let estimatedTotal = 0
    if (page === 1) {
      // Always use exact count for first page
      estimatedTotal = data.places?.length || 0
      // Only multiply if we're certain there are more pages
      if (data.nextPageToken) {
        estimatedTotal = estimatedTotal + 20 // Add estimate for next page
      }
      await setTotal(baseQuery, estimatedTotal)
    } else {
      const cachedTotal = await getTotal(baseQuery)
      estimatedTotal = cachedTotal || page * 20 // Fallback calculation
    }

    const responseData = {
      places: data.places || [],
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        hasNextPage: !!data.nextPageToken,
        estimatedTotal: estimatedTotal,
      },
      successfulQuery: query,
    }

    console.log('📤 Returning response:', {
      placesCount: responseData.places.length,
      hasNextPage: responseData.pagination.hasNextPage,
    })

    return Response.json(responseData)
  } catch (error) {
    console.error('💥 API Route error:', error)
    return Response.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
