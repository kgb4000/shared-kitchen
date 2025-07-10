// app/api/sitemap/route.js - Fixed version with Redis caching

import { NextResponse } from 'next/server'
// import redisManager from '../../lib/redis'

// Cache key for the complete sitemap
const SITEMAP_CACHE_KEY = 'sitemap:kitchen:complete'
const SITEMAP_TTL = 1800 // 30 minutes

// Helper function to convert city names to URL-friendly slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

// Get mock locations for testing (replace with your Google Places API call)
async function getAllLocations() {
  const cacheKey = 'locations:all:mock'

  // Try cache first
  try {
    const cached = await redisManager.get(cacheKey)
    if (cached) {
      console.log(`🎯 Cache HIT for locations: ${cached.length} locations`)
      return cached
    }
  } catch (error) {
    console.warn('Redis cache read failed:', error.message)
  }

  // Mock data - replace with your actual API call
  const mockLocations = [
    { place_id: 'ChIJ_____test1', name: 'Test Restaurant 1' },
    { place_id: 'ChIJ_____test2', name: 'Test Hotel 1' },
    { place_id: 'ChIJ_____test3', name: 'Test Kitchen 1' },
  ]

  // Cache mock data
  try {
    await redisManager.set(cacheKey, mockLocations, 300) // 5 minutes
    console.log(`💾 Cached ${mockLocations.length} mock locations`)
  } catch (error) {
    console.warn('Failed to cache locations:', error.message)
  }

  return mockLocations
}

export async function GET(request) {
  const startTime = Date.now()

  try {
    console.log('🗺️ Starting sitemap generation...')

    // Try to get complete sitemap from cache first
    try {
      const cachedSitemap = await redisManager.get(SITEMAP_CACHE_KEY)
      if (cachedSitemap) {
        console.log('🎯 SITEMAP Cache HIT - returning cached XML')

        return new NextResponse(cachedSitemap.xml, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=1800, s-maxage=1800',
            'X-Cache': 'HIT',
            'X-Sitemap-URLs': cachedSitemap.urlCount.toString(),
            'X-Generation-Time': '0',
          },
        })
      }
    } catch (cacheError) {
      console.warn('⚠️ Sitemap cache read failed:', cacheError.message)
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Define cities array FIRST
    const cities = [
      // Major Cities
      { city: 'New York', state: 'NY' },
      { city: 'Los Angeles', state: 'CA' },
      { city: 'Chicago', state: 'IL' },
      { city: 'Houston', state: 'TX' },
      { city: 'Phoenix', state: 'AZ' },
      { city: 'Philadelphia', state: 'PA' },
      { city: 'San Antonio', state: 'TX' },
      { city: 'San Diego', state: 'CA' },
      { city: 'Dallas', state: 'TX' },
      { city: 'San Jose', state: 'CA' },
      { city: 'Washington', state: 'DC' },
      { city: 'Austin', state: 'TX' },
      { city: 'Jacksonville', state: 'FL' },
      { city: 'Fort Worth', state: 'TX' },
      { city: 'Columbus', state: 'OH' },
      { city: 'Charlotte', state: 'NC' },
      { city: 'San Francisco', state: 'CA' },
      { city: 'Indianapolis', state: 'IN' },
      { city: 'Seattle', state: 'WA' },
      { city: 'Denver', state: 'CO' },
      { city: 'Boston', state: 'MA' },
      { city: 'Nashville', state: 'TN' },
      { city: 'Baltimore', state: 'MD' },
      { city: 'Oklahoma City', state: 'OK' },
      { city: 'Louisville', state: 'KY' },
      { city: 'Portland', state: 'OR' },
      { city: 'Las Vegas', state: 'NV' },
      { city: 'Memphis', state: 'TN' },
      { city: 'Detroit', state: 'MI' },
      { city: 'El Paso', state: 'TX' },
      { city: 'Milwaukee', state: 'WI' },
      { city: 'Albuquerque', state: 'NM' },
      { city: 'Tucson', state: 'AZ' },
      { city: 'Fresno', state: 'CA' },
      { city: 'Sacramento', state: 'CA' },
      { city: 'Kansas City', state: 'MO' },
      { city: 'Mesa', state: 'AZ' },
      { city: 'Atlanta', state: 'GA' },
      { city: 'Colorado Springs', state: 'CO' },
      { city: 'Omaha', state: 'NE' },
      { city: 'Raleigh', state: 'NC' },
      { city: 'Virginia Beach', state: 'VA' },
      { city: 'Long Beach', state: 'CA' },
      { city: 'Miami', state: 'FL' },
      { city: 'Oakland', state: 'CA' },
      { city: 'Minneapolis', state: 'MN' },
      { city: 'Tampa', state: 'FL' },
      { city: 'Tulsa', state: 'OK' },
      { city: 'Wichita', state: 'KS' },
      { city: 'New Orleans', state: 'LA' },
      { city: 'Arlington', state: 'TX' },
      { city: 'Cleveland', state: 'OH' },
      { city: 'Bakersfield', state: 'CA' },
      { city: 'Honolulu', state: 'HI' },
      { city: 'Anaheim', state: 'CA' },
      { city: 'Santa Ana', state: 'CA' },
      { city: 'Corpus Christi', state: 'TX' },
      { city: 'Riverside', state: 'CA' },
      { city: 'Lexington', state: 'KY' },
      { city: 'Stockton', state: 'CA' },
      { city: 'Henderson', state: 'NV' },
      { city: 'Saint Paul', state: 'MN' },
      { city: 'St. Louis', state: 'MO' },
      { city: 'Cincinnati', state: 'OH' },
      { city: 'Pittsburgh', state: 'PA' },
    ]

    // Get locations from API with error handling
    let locations = []
    let apiSuccess = false

    try {
      console.time('get-locations')
      locations = await getAllLocations()
      console.timeEnd('get-locations')
      apiSuccess = true
      console.log(`✅ Fetched ${locations.length} locations`)
    } catch (apiError) {
      console.error('❌ API error:', apiError.message)
      // Fallback data
      locations = [
        { place_id: 'ChIJ_____fallback1', name: 'Fallback Restaurant' },
        { place_id: 'ChIJ_____fallback2', name: 'Fallback Hotel' },
      ]
    }

    // Static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
    ]

    // Dynamic location pages - individual kitchen pages
    const locationPages = locations.map((location) => ({
      url: `${baseUrl}/location/${location.place_id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    // City listing pages
    const cityPages = cities.map((cityData) => ({
      url: `${baseUrl}/commercial-kitchen-for-rent/${slugify(cityData.city)}/${cityData.state.toLowerCase()}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // // Category pages (if you have them)
    // const categoryPages = [
    //   {
    //     url: `${baseUrl}/commercial-kitchens`,
    //     lastModified: new Date().toISOString(),
    //     changeFrequency: 'weekly',
    //     priority: 0.7,
    //   },
    //   {
    //     url: `${baseUrl}/commissary-kitchens`,
    //     lastModified: new Date().toISOString(),
    //     changeFrequency: 'weekly',
    //     priority: 0.7,
    //   },
    //   {
    //     url: `${baseUrl}/shared-kitchens`,
    //     lastModified: new Date().toISOString(),
    //     changeFrequency: 'weekly',
    //     priority: 0.7,
    //   },
    // ]

    // Combine all pages
    const allPages = [...staticPages, ...locationPages, ...cityPages]

    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    // Cache the complete sitemap
    try {
      const cacheData = {
        xml: sitemap,
        urlCount: allPages.length,
        generatedAt: new Date().toISOString(),
        apiSuccess: apiSuccess,
      }

      await redisManager.set(SITEMAP_CACHE_KEY, cacheData, SITEMAP_TTL)
      console.log(`💾 Cached complete sitemap XML (${allPages.length} URLs)`)
    } catch (cacheError) {
      console.warn('⚠️ Failed to cache sitemap:', cacheError.message)
    }

    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`✅ Sitemap generated successfully in ${duration}ms`)
    console.log(`📊 Total URLs: ${allPages.length}`)
    console.log(`   - Static pages: ${staticPages.length}`)
    console.log(`   - Location pages: ${locationPages.length}`)
    console.log(`   - City pages: ${cityPages.length}`)
    console.log(`   - Category pages: ${categoryPages.length}`)
    console.log(`🔄 API Status: ${apiSuccess ? 'SUCCESS' : 'FALLBACK'}`)

    // Response headers
    const headers = {
      'Content-Type': 'application/xml',
      'Cache-Control': apiSuccess
        ? 'public, max-age=1800, s-maxage=1800' // 30 minutes if API worked
        : 'public, max-age=300, s-maxage=300', // 5 minutes if using fallback
      'X-Cache': 'MISS',
      'X-Sitemap-URLs': allPages.length.toString(),
      'X-Generation-Time': duration.toString(),
      'X-API-Status': apiSuccess ? 'success' : 'fallback',
    }

    return new NextResponse(sitemap, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('💥 Critical error generating sitemap:', error)

    // Return a minimal emergency sitemap
    const emergencySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new NextResponse(emergencySitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'X-Sitemap-Error': 'true',
        'X-Error-Message': error.message,
      },
    })
  }
}

// HEAD request support
export async function HEAD(request) {
  try {
    const response = await GET(request)
    return new NextResponse(null, {
      status: response.status,
      headers: response.headers,
    })
  } catch (error) {
    return new NextResponse(null, {
      status: 500,
      headers: {
        'X-Sitemap-Error': 'true',
      },
    })
  }
}
