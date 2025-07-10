// KITCHEN CARD COMPONENT
function KitchenCard({ place, state, city }) {
  if (!place) return null

  // ADD THIS DETAILED DEBUGGING
  console.log('🏪 KitchenCard Place ID Debug:', {
    placeName: place.displayName?.text,
    'place.id': place.id,
    'place.name': place.name,
    'place.id length': place.id?.length || 0,
    'place.name length': place.name?.length || 0,
    'place.id starts with ChIJ': place.id?.startsWith('ChIJ'),
    'all place keys': Object.keys(place).filter(
      (key) =>
        key.toLowerCase().includes('id') ||
        key.toLowerCase().includes('reference')
    ),
  })

  const kitchenSlug = createSlug(place.displayName?.text || 'kitchen')
  const placeId = place.id // Make sure this is the right field

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
          href={`/commercial-kitchen-for-rent/${city}/${state}/${kitchenSlug}__${placeId}`}
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
