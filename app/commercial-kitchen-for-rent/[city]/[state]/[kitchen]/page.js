// app/commercial-kitchen-for-rent/[city]/[state]/[kitchen]/page.js
// Enhanced version with SEO and UX improvements

import Link from 'next/link'
import { Suspense } from 'react'
// import ImageGallery from '@/components/ImageGallery'

function extractNeighborhood(address) {
  if (!address) return 'Downtown'
  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[1].trim()
  }
  return 'Downtown'
}

function formatCityName(city) {
  return city
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatPhoneNumber(phone) {
  if (!phone) return null
  // Format US phone numbers as (XXX) XXX-XXXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    const number = cleaned.slice(1)
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`
  }
  return phone
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h1 className="text-2xl font-bold text-gray-700">
        Loading kitchen details...
      </h1>
    </div>
  )
}

// Static image gallery component
function ImageGallery({ photos, kitchenName }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-8">
        <div className="text-center text-gray-500">
          <span className="text-4xl mb-2 block">🏢</span>
          <p>No photos available</p>
        </div>
      </div>
    )
  }

  const mainPhoto = photos[0]
  const additionalPhotos = photos.slice(1, 4)

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Kitchen Photos</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main large photo */}
        <div className="lg:col-span-2 lg:row-span-2">
          <a
            href={mainPhoto.urlLarge || mainPhoto.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-64 lg:h-full"
          >
            <img
              src={mainPhoto.url}
              alt={`${kitchenName} - Main view`}
              className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              loading="lazy"
            />
          </a>
        </div>

        {/* Additional smaller photos */}
        {additionalPhotos.map((photo, index) => (
          <div key={index} className="lg:col-span-1">
            <a
              href={photo.urlLarge || photo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-32"
            >
              <img
                src={photo.url}
                alt={`${kitchenName} - View ${index + 2}`}
                className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                loading="lazy"
              />
            </a>
          </div>
        ))}

        {/* Show more photos indicator */}
        {photos.length > 4 && (
          <div className="lg:col-span-1 h-32 bg-gray-800 bg-opacity-75 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <span className="text-2xl block">📷</span>
              <span className="text-sm">{photos.length - 4} more photos</span>
            </div>
          </div>
        )}
      </div>

      {/* View all photos link */}
      {photos.length > 1 && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Click any photo to view full size • {photos.length} total photos
            available
          </p>
        </div>
      )}
    </div>
  )
}

// Enhanced metadata with better SEO
export async function generateMetadata({ params }) {
  const { city, state, kitchen } = await params
  const placeId = kitchen.split('-').pop()

  const cityFormatted = formatCityName(city)
  const kitchenName = kitchen
    .split('-')
    .slice(0, -1)
    .join(' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())

  // Try to fetch place data for better metadata
  let place = null
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/google-place-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId }),
      cache: 'no-store',
    })

    if (response.ok) {
      const data = await response.json()
      place = data.place
    }
  } catch (error) {
    console.log('Could not fetch place data for metadata')
  }

  const title = place?.displayName?.text
    ? `${place.displayName.text} - Commercial Kitchen in ${cityFormatted}, ${state.toUpperCase()}`
    : `${kitchenName} - Commercial Kitchen in ${cityFormatted}, ${state.toUpperCase()}`

  const description = place?.editorialSummary?.text
    ? `${place.editorialSummary.text} Located in ${cityFormatted}, ${state.toUpperCase()}. Professional kitchen rental space for food entrepreneurs.`
    : `Professional commercial kitchen space for rent in ${cityFormatted}, ${state.toUpperCase()}. Fully equipped facilities for food businesses, catering, and culinary entrepreneurs.`

  return {
    title,
    description,
    keywords: `commercial kitchen ${cityFormatted}, kitchen rental ${state}, commissary kitchen, shared kitchen space, food business kitchen, ${kitchenName}`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      siteName: 'Commercial Kitchen Rentals',
      images: place?.photos?.[0]?.urlLarge
        ? [
            {
              url: place.photos[0].urlLarge,
              width: 1200,
              height: 800,
              alt: place.displayName?.text || 'Commercial Kitchen',
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/commercial-kitchen-for-rent/${city}/${state}/${kitchen}`,
    },
  }
}

// Schema.org structured data
function generateStructuredData(place, city, state) {
  if (!place) return null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.displayName?.text,
    description:
      place.editorialSummary?.text ||
      `Professional commercial kitchen space in ${formatCityName(city)}, ${state.toUpperCase()}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.formattedAddress?.split(',')[0],
      addressLocality: formatCityName(city),
      addressRegion: state.toUpperCase(),
      addressCountry: 'US',
    },
    telephone: place.nationalPhoneNumber,
    url: place.websiteUri,
    aggregateRating: place.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: place.rating,
          reviewCount: place.userRatingCount,
        }
      : null,
    openingHours: place.regularOpeningHours?.weekdayDescriptions || [],
    priceRange: place.priceLevel ? '$'.repeat(place.priceLevel) : null,
    businessStatus: place.businessStatus === 'OPERATIONAL' ? 'Open' : 'Closed',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Related kitchens component
function RelatedKitchens({ city, state, currentPlaceId }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Other Kitchens in {formatCityName(city)}
      </h3>
      <p className="text-gray-600 text-sm">
        Explore more commercial kitchen options in your area.
      </p>
      <Link
        href={`/commercial-kitchen-for-rent/${city}/${state}`}
        className="inline-block mt-3 text-blue-600 hover:underline font-medium"
      >
        View All Kitchens →
      </Link>
    </div>
  )
}

// Kitchen amenities component
function KitchenAmenities({ place }) {
  const amenities = []

  // Extract amenities from place data
  if (place.types?.includes('restaurant'))
    amenities.push('Restaurant Grade Equipment')
  if (place.types?.includes('bakery'))
    amenities.push('Commercial Baking Facilities')
  if (place.parkingOptions?.freeParkingLot) amenities.push('Free Parking')
  if (place.accessibilityOptions?.wheelchairAccessibleEntrance)
    amenities.push('Wheelchair Accessible')
  if (place.paymentOptions?.acceptsCreditCards)
    amenities.push('Credit Card Payments')

  // Add common kitchen amenities
  amenities.push(
    'Professional Grade Equipment',
    'Food Safety Certified',
    'Flexible Scheduling'
  )

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kitchen Features</h2>
      <div className="grid grid-cols-2 gap-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-gray-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Contact form component
function ContactForm({ place }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Request Information</h3>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your kitchen needs..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Send Inquiry
        </button>
      </form>
    </div>
  )
}

// FAQ component
function KitchenFAQ() {
  const faqs = [
    {
      question: 'What equipment is included?',
      answer: `You'll find that the vast majority of commercial kitchens come equipped with a standard set of professional-grade appliances and facilities essential for food preparation and handling. This typically includes robust multi-burner stoves and large-capacity ovens, ample stainless-steel prep tables for food assembly and ingredient organization, and commercial-grade refrigeration units to safely store perishables. Crucially, all commercial kitchens are outfitted with dedicated dishwashing facilities, often featuring high-temperature sanitizing dishwashers, three-compartment sinks, and handwashing stations, all designed to meet stringent health code requirements. However, it's important to note that the specific types and brands of equipment, as well as the availability of specialized items like tilt skillets, convection ovens, walk-in freezers, proofing cabinets, or blast chillers, will vary significantly from one location to another. Therefore, it's always advisable to confirm the exact equipment list with the kitchen manager to ensure it meets your unique production needs.`,
    },
    {
      question: 'How do I book time?',
      answer:
        'Contact the facility directly, either by phone or through their website. This allows you to inquire about their current availability for specific dates and times that align with your business needs. Most commercial kitchens understand the varied demands of food businesses and offer flexible rental options, which commonly include hourly, daily, or even monthly rates. Hourly rates are ideal for smaller projects, occasional use, or testing new concepts, while daily and monthly options are typically more cost-effective for businesses requiring consistent, longer-term access. Be sure to ask about any minimum booking requirements, peak vs. off-peak pricing, and whether a membership fee or security deposit is necessary to secure your desired time slots.',
    },
    {
      question: 'Do I need insurance?',
      answer: `Yes, most commercial kitchens require renters to have general liability insurance to protect against claims of bodily injury or property damage to third parties that may occur on the premises. Beyond general liability, kitchen owners often mandate additional coverages to further mitigate their risks. These frequently include product liability insurance to cover claims related to foodborne illness or allergens from the products prepared, and damage to premises rented coverage which specifically addresses damage you might cause to the rented kitchen space itself (often with limitations for fire damage). Many landlords will also require you to add them as an additional insured on your policy, extending your coverage to protect them if they are implicated in a lawsuit stemming from your operations. Depending on your specific business activities and the kitchen's requirements, you might also need inland marine insurance for your own movable equipment, workers' compensation if you have employees, or even business interruption insurance to cover lost income if operations are halted due to a covered event. It's crucial to check with the specific commercial kitchen for their exact insurance requirements, as these can vary significantly by location and facility.`,
    },
    {
      question: 'Are there storage options?',
      answer: `Absolutely, maximizing your operational efficiency and reducing external supply runs is key when renting a commercial kitchen, and many facilities are designed with this in mind. It's very common for these shared-use or commissary kitchens to offer both refrigerated and dry storage options, allowing you to keep your ingredients and prepared products on-site.

      These storage solutions are almost always available for an additional fee, as they represent a valuable amenity. The pricing structure for storage can vary significantly, often depending on the type of storage (refrigerated, freezer, or dry), the amount of space needed (e.g., by the shelf, rack, or square foot), and the duration of the rental (daily, weekly, or monthly). For example, a single shelf of dry storage might cost $15-$30 per month, while refrigerated or freezer space could range from $25 to $100 or more per shelf/rack monthly. Some kitchens even offer dedicated, larger storage units for businesses with higher volume. It's essential to inquire about storage availability and get a clear breakdown of the pricing from each specific facility you're considering, as these costs can quickly add up and impact your overall budget.`,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group">
            <summary className="flex justify-between items-center cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className="transform group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-2 p-3 text-gray-700 text-sm leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

// MAIN COMPONENT - DEFAULT EXPORT
export default async function KitchenDetailPage({ params }) {
  const { city, state, kitchen } = await params
  const placeId = kitchen.split('-').pop()

  console.log('Kitchen Detail Page - Place ID:', placeId)

  let place = null
  let error = null

  try {
    const getBaseUrl = () => {
      if (typeof window !== 'undefined') {
        return window.location.origin
      }

      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
      }

      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL
      }

      return 'http://localhost:3000'
    }

    const baseUrl = getBaseUrl()
    const apiUrl = `${baseUrl}/api/google-place-details`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeId }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `API responded with status ${response.status}: ${errorText}`
      )
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    place = data.place

    if (!place) {
      throw new Error('No place data returned from API')
    }
  } catch (fetchError) {
    console.error('Error fetching place details:', fetchError)
    error = fetchError.message
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-6 my-10">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            Kitchen Details Unavailable
          </h1>
          <p className="text-red-600 mb-4">
            We are having trouble loading this kitchen information. Please try
            again later or contact us for assistance.
          </p>
          <div className="text-center">
            <Link
              href={`/commercial-kitchen-for-rent/${city}/${state}`}
              className="text-blue-600 hover:underline font-medium"
            >
              ← View Other Kitchens in {formatCityName(city)}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="container max-w-4xl mx-auto px-6 my-10">
        <Suspense fallback={<LoadingSpinner />}>
          <LoadingSpinner />
        </Suspense>
      </div>
    )
  }

  const cityFormatted = formatCityName(city)
  const stateFormatted = state.toUpperCase()

  return (
    <>
      {/* Structured Data */}
      {generateStructuredData(place, city, state)}

      <main>
        <div className="container max-w-6xl mx-auto px-6 my-10">
          {/* Enhanced Breadcrumb Navigation */}
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              {/* <li className="text-gray-300">›</li>
              <li>
                <Link
                  href="/commercial-kitchen-for-rent"
                  className="hover:text-blue-600"
                >
                  Commercial Kitchens
                </Link>
              </li> */}
              <li className="text-gray-300">›</li>
              <li>
                <Link
                  href={`/commercial-kitchen-for-rent/${city}/${state}`}
                  className="hover:text-blue-600"
                >
                  {cityFormatted}, {stateFormatted}
                </Link>
              </li>
              <li className="text-gray-300">›</li>
              <li className="text-gray-700" aria-current="page">
                {place.displayName?.text}
              </li>
            </ol>
          </nav>

          {/* Kitchen Header with enhanced design */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-8">
            {/* Hero Section */}
            <div className="p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {place.displayName?.text}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    Professional Commercial Kitchen in {cityFormatted},{' '}
                    {stateFormatted}
                  </p>

                  {/* Enhanced Quick Stats */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {place.rating && (
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="font-bold text-lg">
                          {place.rating}
                        </span>
                        {place.userRatingCount && (
                          <span className="text-gray-500 text-sm">
                            ({place.userRatingCount} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {place.businessStatus === 'OPERATIONAL' && (
                      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm self-center">
                        ✓ Currently Operating
                      </div>
                    )}

                    {place.currentOpeningHours?.openNow !== undefined && (
                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm self-center ${
                          place.currentOpeningHours.openNow
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {place.currentOpeningHours.openNow
                          ? '🟢 Open Now'
                          : '🔴 Closed'}
                      </div>
                    )}

                    {place.priceLevel && (
                      <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                        <span className="text-green-600 font-bold text-lg">
                          {'$'.repeat(place.priceLevel)}
                        </span>
                        <span className="text-gray-600 text-sm ml-1">
                          Price Level
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call-to-Action Buttons */}
                <div className="flex flex-col space-y-3 lg:ml-8">
                  {place.nationalPhoneNumber && (
                    <a
                      href={`tel:${place.nationalPhoneNumber}`}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      📞 Call {formatPhoneNumber(place.nationalPhoneNumber)}
                    </a>
                  )}

                  {place.websiteUri && (
                    <a
                      href={place.websiteUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-green-700 transition-colors shadow-lg"
                    >
                      🌐 Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Image Gallery */}
                  <ImageGallery
                    photos={place.photos}
                    kitchenName={place.displayName?.text}
                  />

                  {/* Contact Information */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
                      Contact & Location
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-gray-400 text-xl">📍</span>
                          <div>
                            <p className="font-medium text-gray-900">Address</p>
                            <p className="text-gray-600">
                              {place.formattedAddress}
                            </p>
                          </div>
                        </div>

                        {place.nationalPhoneNumber && (
                          <div className="flex items-start space-x-3">
                            <span className="text-gray-400 text-xl">📞</span>
                            <div>
                              <p className="font-medium text-gray-900">Phone</p>
                              <a
                                href={`tel:${place.nationalPhoneNumber}`}
                                className="text-blue-600 hover:underline"
                              >
                                {formatPhoneNumber(place.nationalPhoneNumber)}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {place.websiteUri && (
                          <div className="flex items-start space-x-3">
                            <span className="text-gray-400 text-xl">🌐</span>
                            <div>
                              <p className="font-medium text-gray-900">
                                Website
                              </p>
                              <a
                                href={place.websiteUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                              >
                                Visit Website
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start space-x-3">
                          <span className="text-gray-400 text-xl">🗺️</span>
                          <div>
                            <p className="font-medium text-gray-900">
                              Directions
                            </p>
                            <a
                              href={`https://www.google.com/maps/place/?q=place_id:${place.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Get Directions
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kitchen Description */}
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
                      About This Kitchen
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      {place.editorialSummary?.text ? (
                        <p className="text-gray-700 leading-relaxed">
                          {place.editorialSummary.text}
                        </p>
                      ) : (
                        <>
                          <p className="text-gray-700 leading-relaxed mb-4">
                            This professional commercial kitchen space in{' '}
                            {extractNeighborhood(place.formattedAddress)} offers
                            state-of-the-art facilities for food entrepreneurs,
                            caterers, and culinary businesses.
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {place.rating &&
                              ` With a ${place.rating}-star rating from ${place.userRatingCount} satisfied customers, `}
                            this location provides all the equipment and space
                            you need to launch or grow your food business in{' '}
                            {cityFormatted}, {stateFormatted}.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Kitchen Features */}
                  <KitchenAmenities place={place} />

                  {/* Opening Hours */}
                  {place.regularOpeningHours?.weekdayDescriptions && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
                        Operating Hours
                      </h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 gap-2">
                          {place.regularOpeningHours.weekdayDescriptions.map(
                            (day, index) => {
                              const [dayName, hours] = day.split(': ')
                              return (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-1"
                                >
                                  <span className="font-medium text-gray-900">
                                    {dayName}
                                  </span>
                                  <span className="text-gray-600">{hours}</span>
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Types */}
                  {place.types && place.types.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
                        Kitchen Categories
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {place.types.slice(0, 8).map((type, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {type
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {place.reviews && place.reviews.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 pb-2">
                        Customer Reviews
                      </h2>
                      <div className="space-y-6">
                        {place.reviews.slice(0, 5).map((review, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-6 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="flex text-yellow-400">
                                  {'★'.repeat(review.rating || 0)}
                                  <span className="text-gray-300">
                                    {'★'.repeat(5 - (review.rating || 0))}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">
                                  {review.authorAttribution?.displayName ||
                                    'Anonymous'}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.relativePublishTimeDescription}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {review.text?.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Contact Form */}
                  <ContactForm place={place} />

                  {/* Related Kitchens */}
                  <RelatedKitchens
                    city={city}
                    state={state}
                    currentPlaceId={place.id}
                  />

                  {/* Quick Actions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <a
                        href={`https://www.google.com/maps/place/?q=place_id:${place.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
                      >
                        🗺️ Get Directions
                      </a>

                      <button className="block w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors">
                        ⭐ Save Kitchen
                      </button>

                      <button className="block w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors">
                        📤 Share Kitchen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <KitchenFAQ />

          {/* Back Navigation */}
          <div className="mt-12 text-center">
            <Link
              href={`/commercial-kitchen-for-rent/${city}/${state}`}
              className="inline-flex items-center space-x-2 text-blue-600 hover:underline font-medium text-lg"
            >
              <span>←</span>
              <span>Back to all kitchens in {cityFormatted}</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
