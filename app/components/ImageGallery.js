// components/ImageGallery.js
'use client'

import { useState, useEffect } from 'react'

export default function ImageGallery({ photos, kitchenName }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState({})
  const [hasError, setHasError] = useState({})

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return

      if (e.key === 'Escape') {
        setSelectedImage(null)
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, currentIndex])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

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

  const openLightbox = (photo, index) => {
    setSelectedImage(photo)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % photos.length
    setCurrentIndex(nextIndex)
    setSelectedImage(photos[nextIndex])
  }

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? photos.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setSelectedImage(photos[prevIndex])
  }

  const handleImageLoad = (index) => {
    setIsLoading((prev) => ({ ...prev, [index]: false }))
  }

  const handleImageError = (index) => {
    setHasError((prev) => ({ ...prev, [index]: true }))
    setIsLoading((prev) => ({ ...prev, [index]: false }))
  }

  const handleImageLoadStart = (index) => {
    setIsLoading((prev) => ({ ...prev, [index]: true }))
  }

  const mainPhoto = photos[0]
  const additionalPhotos = photos.slice(1)

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Kitchen Photos</h2>
        <span className="text-sm text-gray-500">{photos.length} photos</span>
      </div>

      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Main large photo */}
        <div className="lg:col-span-2 lg:row-span-2 relative group">
          <div
            className="relative w-full h-64 lg:h-full cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openLightbox(mainPhoto, 0)}
          >
            {isLoading[0] && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            {hasError[0] ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <span className="text-2xl block mb-1">🖼️</span>
                  <span className="text-xs">Image unavailable</span>
                </div>
              </div>
            ) : (
              <img
                src={mainPhoto.url}
                alt={`${kitchenName} - Main view`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onLoadStart={() => handleImageLoadStart(0)}
                onLoad={() => handleImageLoad(0)}
                onError={() => handleImageError(0)}
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white bg-opacity-90 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional smaller photos */}
        {additionalPhotos.slice(0, 6).map((photo, index) => {
          const actualIndex = index + 1
          return (
            <div key={actualIndex} className="lg:col-span-1 relative group">
              <div
                className="relative w-full h-32 cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openLightbox(photo, actualIndex)}
              >
                {isLoading[actualIndex] && (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
                {hasError[actualIndex] ? (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">🖼️</span>
                  </div>
                ) : (
                  <img
                    src={photo.url}
                    alt={`${kitchenName} - View ${actualIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onLoadStart={() => handleImageLoadStart(actualIndex)}
                    onLoad={() => handleImageLoad(actualIndex)}
                    onError={() => handleImageError(actualIndex)}
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-2">
                      <svg
                        className="w-4 h-4 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Show more photos indicator */}
        {photos.length > 7 && (
          <div
            className="lg:col-span-1 h-32 bg-gray-800 bg-opacity-75 rounded-lg flex items-center justify-center cursor-pointer hover:bg-opacity-85 transition-opacity group"
            onClick={() => openLightbox(photos[7], 7)}
          >
            <div className="text-center text-white">
              <span className="text-2xl block mb-1">📷</span>
              <span className="text-sm font-medium">
                +{photos.length - 7} more
              </span>
            </div>
          </div>
        )}
      </div>

      {/* View all photos button */}
      {photos.length > 1 && (
        <button
          onClick={() => openLightbox(mainPhoto, 0)}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>View All {photos.length} Photos</span>
        </button>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentIndex + 1} of {photos.length}
          </div>

          {/* Previous button */}
          {photos.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next button */}
          {photos.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div className="max-w-full max-h-full flex items-center justify-center">
            <img
              src={selectedImage.urlLarge || selectedImage.url}
              alt={`${kitchenName} - Photo ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={closeLightbox}
            />
          </div>

          {/* Image info */}
          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-lg font-medium">{kitchenName}</p>
            <p className="text-sm text-gray-300">
              Photo {currentIndex + 1} of {photos.length} • Click image or press
              ESC to close
            </p>
          </div>

          {/* Keyboard hints */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              ← → arrows to navigate
            </div>
          )}
        </div>
      )}
    </div>
  )
}
