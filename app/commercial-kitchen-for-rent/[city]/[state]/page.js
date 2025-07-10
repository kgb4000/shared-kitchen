// app/commercial-kitchen-for-rent/[city]/[state]/page.js
// CLEAN VERSION - NO EXTERNAL IMPORTS OR CONFLICTS

import Link from 'next/link'
// import { CommercialKitchenDropdownSSR } from '@/components/SSRCityWrapper'

// RENAMED FUNCTIONS TO AVOID ANY CONFLICTS
const formatCity = (city) => {
  if (!city) return ''

  return city
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getNeighborhood = (address) => {
  if (!address) return 'Downtown'

  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[1].trim()
  }
  return 'Downtown'
}

const createSlug = (text) => {
  if (!text) return 'kitchen'

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// KITCHEN CARD COMPONENT
function KitchenCard({ place, state, city }) {
  if (!place) return null

  const kitchenSlug = createSlug(place.displayName?.text || 'kitchen')
  const placeId = place.id

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Kitchen Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {place.displayName?.text || 'Unnamed Kitchen'}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {place.formattedAddress || 'Address not available'}
          </p>
          {/* Show types/categories if available */}
          {place.types && place.types.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {place.types.slice(0, 3).map((type, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status indicator */}
        {place.businessStatus && (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              place.businessStatus === 'OPERATIONAL'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {place.businessStatus === 'OPERATIONAL' ? 'Open' : 'Closed'}
          </span>
        )}
      </div>

      {/* Kitchen Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {place.rating && (
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">{place.rating}</span>
            {place.userRatingCount && (
              <span className="text-gray-500 text-sm">
                ({place.userRatingCount} reviews)
              </span>
            )}
          </div>
        )}

        {place.priceLevel && (
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-medium">
              {'$'.repeat(place.priceLevel)}
            </span>
            <span className="text-gray-500 text-sm">Price Level</span>
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {place.nationalPhoneNumber && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">📞</span>
            <a
              href={`tel:${place.nationalPhoneNumber}`}
              className="text-blue-600 hover:underline"
            >
              {place.nationalPhoneNumber}
            </a>
          </div>
        )}

        {place.websiteUri && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">🌐</span>
            <a
              href={place.websiteUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Opening hours status */}
        {place.currentOpeningHours && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">🕒</span>
            <span
              className={
                place.currentOpeningHours.openNow
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {place.currentOpeningHours.openNow ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {/* View Details Button */}
        <Link
          href={`/commercial-kitchen-for-rent/${city}/${state}/${kitchenSlug}-${placeId}`}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-center font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>

        {/* Quick Actions */}
        {place.nationalPhoneNumber && (
          <a
            href={`tel:${place.nationalPhoneNumber}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            title="Call now"
          >
            📞
          </a>
        )}

        <a
          href={`https://www.google.com/maps/place/?q=place_id:${place.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          title="Get directions"
        >
          🗺️
        </a>
      </div>
    </div>
  )
}

// METADATA GENERATION FUNCTION
export async function generateMetadata({ params }) {
  const { city, state } = await params

  const cityFormatted = formatCity(city)

  return {
    title: `Commercial Kitchen Rentals in ${cityFormatted}, ${state.toUpperCase()} | Find Shared Kitchens in ${cityFormatted}`,
    description: `Find licensed commercial kitchen spaces for rent in ${cityFormatted}, ${state.toUpperCase()}. Commissary kitchens, shared cooking spaces & ghost kitchens for food entrepreneurs.`,
    alternates: {
      canonical: `https://sharedkitchenlocator.com/commercial-kitchen-for-rent/${cityFormatted}/${state.toUpperCase()}`,
    },
    keywords: `commercial kitchen ${cityFormatted}, commissary kitchen ${state}, shared kitchen space, ghost kitchen rental`,
    openGraph: {
      title: `Commercial Kitchen Rentals in ${cityFormatted}, ${state.toUpperCase()}`,
      description: `Find licensed commercial kitchen spaces for rent in ${cityFormatted}, ${state.toUpperCase()}.`,
      type: 'website',
    },
    alternates: {
      alternates: {
        canonical: `https://sharedkitchenlocator.com/commercial-kitchen-for-rent/${cityFormatted}/${state.toUpperCase()}`,
      },
    },
  }
}

// PAGINATION COMPONENT
function PaginationControls({ pagination, city, state }) {
  const { currentPage, hasNextPage, estimatedTotal } = pagination
  const maxDisplayPages = 5

  // Calculate page range to display
  const totalPages = Math.max(1, Math.ceil(estimatedTotal / 20))
  const startPage = Math.max(1, currentPage - Math.floor(maxDisplayPages / 2))
  const endPage = Math.min(totalPages, startPage + maxDisplayPages - 1)

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        {/* Previous Page */}
        {currentPage > 1 ? (
          <Link
            href={`/commercial-kitchen-for-rent/${city}/${state}?page=${currentPage - 1}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
            ← Previous
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex space-x-1">
          {startPage > 1 && (
            <>
              <Link
                href={`/commercial-kitchen-for-rent/${city}/${state}?page=1`}
                className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
              >
                1
              </Link>
              {startPage > 2 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {[...Array(endPage - startPage + 1)].map((_, i) => {
            const pageNum = startPage + i
            return (
              <Link
                key={pageNum}
                href={`/commercial-kitchen-for-rent/${city}/${state}?page=${pageNum}`}
                className={`px-3 py-2 rounded-md text-sm ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNum}
              </Link>
            )
          })}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
              <Link
                href={`/commercial-kitchen-for-rent/${city}/${state}?page=${totalPages}`}
                className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>

        {/* Next Page */}
        {hasNextPage ? (
          <Link
            href={`/commercial-kitchen-for-rent/${city}/${state}?page=${currentPage + 1}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
            Next →
          </span>
        )}
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600 text-center sm:text-left">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="text-xs">({estimatedTotal}+ results found)</div>
      </div>
    </div>
  )
}

// MAIN PAGE COMPONENT - Updated to work with new API response
export default async function CommercialKitchenPage({ params, searchParams }) {
  const { city, state } = await params
  const resolvedSearchParams = await searchParams
  const currentPage = parseInt(resolvedSearchParams?.page) || 1

  // Validate params
  if (!city || !state) {
    return (
      <main>
        <div className="container max-w-7xl mx-auto px-6 my-10">
          <h1 className="text-3xl font-bold text-center text-red-600">
            Invalid location parameters
          </h1>
        </div>
      </main>
    )
  }

  // Define these variables before try block so they're available in catch
  const cityFormatted = formatCity(city)
  const stateFormatted = state.toUpperCase()

  // Add debugging for the city conversion
  console.log('City conversion debug:', {
    originalCity: city,
    formattedCity: cityFormatted,
    originalState: state,
    formattedState: stateFormatted,
  })

  // Try multiple query variations for better results
  const queries = [
    `"shared-use commercial kitchen" near ${cityFormatted} ${stateFormatted}`,
    `"commissary kitchen" ${cityFormatted} ${stateFormatted} metro area`,
    `"shared commercial kitchen" ${cityFormatted} ${stateFormatted} metro area`,
    `"kitchen for rent" ${cityFormatted} ${stateFormatted} metro area`,
  ]

  // Start with the most general query
  // In your page component:
  const query = queries[0]

  try {
    // Add debug logging
    console.log('Page component debug:', {
      currentPage,
      query,
      city: cityFormatted,
      state: stateFormatted,
    })

    // API call with pagination and fallback queries
    const fallbackQueries = [
      `shared kitchen ${city} ${state}`,
      `commissary kitchen ${city} ${state}`,
      `food production facility ${city} ${state}`,
      `commercial cooking space ${city} ${state}`,
      `kitchen for rent ${city} ${state}`,
    ]

    const response = await fetch('http://localhost:3000/api/google-place-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        page: currentPage,
        pageSize: 20,
        fallbackQueries: fallbackQueries,
      }),
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        query,
        page: currentPage,
      })
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Add debug logging
    console.log('API Response Debug:', {
      rawPlacesCount: data.places?.length || 0,
      hasPlaces: !!data.places,
      paginationInfo: data.pagination,
      currentPage: currentPage,
      query: query,
      city: cityFormatted,
      state: stateFormatted,
      successfulQuery: data.successfulQuery,
      debugInfo: data.debug,
      tokenMissing: data.pagination?.tokenMissing,
    })

    // Check if the requested page has no results (page doesn't exist)
    if (
      data.places &&
      data.places.length === 0 &&
      currentPage > 1 &&
      data.debug
    ) {
      const actualPages = data.debug.pagesAvailable
      if (typeof actualPages === 'number' && currentPage > actualPages) {
        console.warn(
          `⚠️ Requested page ${currentPage} but only ${actualPages} pages exist`
        )

        // Show a message instead of redirecting
        return (
          <main>
            <div className="container max-w-7xl mx-auto px-6 my-10">
              <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-center">
                Commercial Kitchen Rentals in {cityFormatted}, {stateFormatted}
              </h1>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center mb-8">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                  Page Not Found
                </h3>
                <p className="text-yellow-600 mb-4">
                  Page {currentPage} doesn't exist. There are only {actualPages}{' '}
                  page(s) of results for this search.
                </p>
                <Link
                  href={`/commercial-kitchen-for-rent/${city}/${state}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Page 1
                </Link>
              </div>
            </div>
          </main>
        )
      }
    }

    // Handle API error responses
    if (data.error) {
      console.error('API Error Response:', data)
      if (data.code === 'TOKEN_NOT_FOUND' && currentPage > 1) {
        // Redirect to page 1 if token is expired
        return (
          <main>
            <div className="container max-w-7xl mx-auto px-6 my-10">
              <h1 className="text-3xl lg:text-5xl font-bold mb-10 text-center">
                Commercial Kitchen Rentals in {cityFormatted}, {stateFormatted}
              </h1>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-yellow-700 mb-2">
                  Page Token Expired
                </h3>
                <p className="text-yellow-600 mb-4">
                  The page you requested is no longer available. Please start
                  from page 1.
                </p>
                <Link
                  href={`/commercial-kitchen-for-rent/${city}/${state}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Page 1
                </Link>
              </div>
            </div>
          </main>
        )
      }
      throw new Error(data.error)
    }

    const places = data.places || []
    const pagination = data.pagination || {
      currentPage: 1,
      hasNextPage: false,
      estimatedTotal: 0,
    }

    // Filter valid places (your existing logic)
    const validPlaces = places.filter((place) => {
      const placeId = place.id
      const isValidFormat =
        placeId &&
        placeId.length >= 25 &&
        (placeId.startsWith('ChIJ') ||
          placeId.startsWith('EiJ') ||
          placeId.startsWith('GhIJ')) &&
        !placeId.includes('-') &&
        /^[A-Za-z0-9_]+$/.test(placeId)

      if (!isValidFormat) {
        console.log('⚠️ Filtering out place with invalid Place ID:', {
          name: place.displayName?.text,
          placeId: placeId,
          length: placeId?.length || 0,
          reason: !placeId
            ? 'No Place ID'
            : placeId.length < 25
              ? 'Too short'
              : placeId.includes('-')
                ? 'Contains hyphen'
                : 'Invalid format',
        })
      }

      return isValidFormat
    })

    // Calculate stats from current page
    const placesWithRating = places.filter((p) => p && p.rating)
    const averageRating =
      placesWithRating.length > 0
        ? (
            placesWithRating.reduce((sum, p) => sum + p.rating, 0) /
            placesWithRating.length
          ).toFixed(1)
        : 'N/A'

    const neighborhoods = [
      ...new Set(
        places
          .map((p) => {
            if (!p || !p.formattedAddress) return 'Unknown'
            return getNeighborhood(p.formattedAddress)
          })
          .filter(Boolean)
      ),
    ]

    // cityFormatted and stateFormatted are now defined above the try block

    return (
      <main>
        <div className="container max-w-7xl mx-auto px-6 my-10">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 text-center">
            Commercial Kitchen Rentals in {cityFormatted}, {stateFormatted}
          </h1>

          {/* City Search Dropdown */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md"></div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pagination.estimatedTotal}+
              </div>
              <div className="text-sm text-gray-600">Total Kitchens</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {averageRating}★
              </div>
              <div className="text-sm text-gray-600">
                Avg Rating (this page)
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {neighborhoods.length}
              </div>
              <div className="text-sm text-gray-600">Areas (this page)</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                Page {pagination.currentPage}
              </div>
              <div className="text-sm text-gray-600">Current Page</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kitchen Listings */}
            <div className="space-y-6">
              {validPlaces && validPlaces.length > 0 ? (
                <>
                  {validPlaces.map((place, i) => (
                    <KitchenCard
                      key={place?.id || `kitchen-${i}`}
                      place={place}
                      state={state}
                      city={city}
                    />
                  ))}

                  {/* Pagination Controls */}
                  <PaginationControls
                    pagination={pagination}
                    city={city}
                    state={state}
                  />
                </>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No kitchens found on this page
                  </h3>
                  <p className="text-gray-600">
                    {currentPage > 1
                      ? `No results found on page ${currentPage} for ${cityFormatted}, ${stateFormatted}.`
                      : `We couldn't find any commercial kitchens in ${cityFormatted}, ${stateFormatted}.`}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Search query: "{query}"
                  </p>
                  {currentPage > 1 && (
                    <Link
                      href={`/commercial-kitchen-for-rent/${city}/${state}`}
                      className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Go to Page 1
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Map or additional content */}
            <div className="lg:sticky lg:top-4 space-y-6">
              {/* City Search Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Search Other Cities
                </h3>
              </div>

              {/* Map Section */}
              <div className="bg-gray-50 rounded-lg p-6 h-96">
                <h3 className="text-xl font-semibold mb-4">
                  Kitchen Locations Map
                </h3>
                <div className="bg-gray-200 h-full rounded flex items-center justify-center">
                  <p className="text-gray-500">
                    Interactive map coming very soon
                  </p>
                </div>

                {/* Show neighborhoods from current page */}
                {neighborhoods.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">
                      Areas on this page:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {neighborhoods.map((neighborhood, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white px-2 py-1 rounded border"
                        >
                          {neighborhood}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading places:', error)

    return (
      <main>
        <div className="container max-w-7xl mx-auto px-6 my-10">
          <h1 className="text-3xl lg:text-5xl font-bold mb-10 text-center">
            Commercial Kitchen Rentals in {cityFormatted}, {stateFormatted}
          </h1>

          <div className="bg-red-50 border border-red-200 p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Unable to load kitchens
            </h3>
            <p className="text-red-600 mb-2">
              We're having trouble loading kitchen data. Please try again later.
            </p>
            <p className="text-red-500 text-sm">Error: {error.message}</p>

            {currentPage > 1 && (
              <Link
                href={`/commercial-kitchen-for-rent/${city}/${state}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Page 1
              </Link>
            )}
          </div>
        </div>
      </main>
    )
  }
}
