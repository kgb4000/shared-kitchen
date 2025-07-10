// components/KitchenImage.js
'use client'

import { useState } from 'react'

export default function KitchenImage({ src, alt, className, ...props }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    console.log('❌ Image failed to load:', src)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', src)
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <div className="text-center text-gray-500">
          <span className="text-2xl block mb-1">🖼️</span>
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0`}
        >
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-1"></div>
            <span className="text-xs">Loading...</span>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
    </div>
  )
}
