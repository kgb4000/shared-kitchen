// 'use client'

// import { useRouter } from 'next/navigation'
// import { useState } from 'react'

// export default function Hero({
//   herotext,
//   heroSubText,
//   textColor,
//   imageUrl,
//   initialQuery = '',
// }) {
//   const [query, setQuery] = useState(initialQuery)
//   const router = useRouter()
//   const handleSearch = () => {
//     if (!query) return
//     router.push(`/location/${encodeURIComponent(query)}`)
//   }

'use client'

import { useRouter } from 'next/navigation'
import UsCitiesDropdown from './CityDropdown'

export default function Hero({ herotext, heroSubText, textColor, imageUrl }) {
  const router = useRouter()

  const handleSelect = ({ city, state }) => {
    if (!city || !state) return

    const citySlug = city.trim().toLowerCase().replace(/\s+/g, '-')
    const stateSlug = state.trim().toLowerCase()

    console.log(city, state)

    router.push(`/commercial-kitchen-for-rent/${citySlug}/${stateSlug}`)
  }

  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center bg-black">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt=""
          className="object-cover w-full h-full opacity-60"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1
          className={`text-3xl lg:text-5xl max-w-2xl font-bold text-center ${textColor}`}
        >
          {herotext}
        </h1>
        <p className={`${textColor}`}>{heroSubText}</p>
        <div className="items-center gap-2 w-md">
          <UsCitiesDropdown onSelect={handleSelect} />
        </div>
      </div>
    </div>
  )
}
