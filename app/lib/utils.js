import Link from 'next/link'

// ALL UTILITY FUNCTIONS DEFINED AT THE TOP
const formatCityName = (city) => {
  if (!city) return ''

  return city
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const extractNeighborhood = (address) => {
  if (!address) return 'Downtown'

  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[1].trim()
  }
  return 'Downtown'
}

const generateSlug = (text) => {
  if (!text) return 'kitchen'

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
