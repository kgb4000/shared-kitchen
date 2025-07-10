// lib/googlePlaces.js
import redisManager from './redis'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// Simple function to get all locations for sitemap
export async function getAllLocations() {
  const cacheKey = 'places:all-locations'

  // Try cache first
  try {
    const cached = await redisManager.get(cacheKey)
    if (cached) {
      console.log(`🎯 Cache HIT for all locations: ${cached.length} locations`)
      return cached
    }
  } catch (error) {
    console.warn('Redis cache read failed:', error.message)
  }

  // Mock data for testing - replace with actual Google Places API calls
  const mockLocations = [
    { place_id: 'ChIJ_____mock1', name: 'Mock Commercial Kitchen 1' },
    { place_id: 'ChIJ_____mock2', name: 'Mock Commissary Kitchen 2' },
    { place_id: 'ChIJ_____mock3', name: 'Mock Shared Kitchen 3' },
  ]

  // TODO: Replace with actual Google Places API implementation
  try {
    // Your actual Google Places API logic here
    const response = await fetch('your-google-places-endpoint', {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      },
    })
    const data = await response.json()
    const realLocations = data.places || []

    // Cache real data
    await redisManager.set(cacheKey, realLocations, 1800)
    return realLocations
  } catch (error) {
    console.error('Google Places API error:', error)
    // Fall back to mock data
  }

  // Cache mock data for 5 minutes
  try {
    await redisManager.set(cacheKey, mockLocations, 300)
    console.log(`💾 Cached ${mockLocations.length} mock locations`)
  } catch (error) {
    console.warn('Failed to cache locations:', error.message)
  }

  return mockLocations
}
