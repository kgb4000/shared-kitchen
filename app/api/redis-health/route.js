// app/api/redis-health/route.js
// Health check for Redis connection

import { createClient } from 'redis'

export async function GET() {
  try {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    })

    await client.connect()

    // Test Redis operations
    await client.set('health-check', 'ok', { EX: 10 })
    const value = await client.get('health-check')

    await client.quit()

    return Response.json({
      status: 'healthy',
      redis: {
        connected: true,
        testWrite: 'ok',
        testRead: value,
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        redis: {
          connected: false,
          error: error.message,
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
