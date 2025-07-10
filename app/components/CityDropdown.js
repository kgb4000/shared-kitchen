import React, { useState, useMemo } from 'react'

const UsCitiesDropdown = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  // Sample of major US cities - in real implementation, this would be much larger
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

    // Large Cities
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

    // Medium Cities
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
    { city: 'Greensboro', state: 'NC' },
    { city: 'Anchorage', state: 'AK' },
    { city: 'Plano', state: 'TX' },
    { city: 'Lincoln', state: 'NE' },
    { city: 'Orlando', state: 'FL' },
    { city: 'Irvine', state: 'CA' },
    { city: 'Newark', state: 'NJ' },
    { city: 'Durham', state: 'NC' },
    { city: 'Chula Vista', state: 'CA' },
    { city: 'Toledo', state: 'OH' },
    { city: 'Fort Wayne', state: 'IN' },
    { city: 'St. Petersburg', state: 'FL' },
    { city: 'Laredo', state: 'TX' },
    { city: 'Jersey City', state: 'NJ' },
    { city: 'Chandler', state: 'AZ' },
    { city: 'Madison', state: 'WI' },
    { city: 'Lubbock', state: 'TX' },
    { city: 'Scottsdale', state: 'AZ' },
    { city: 'Reno', state: 'NV' },
    { city: 'Buffalo', state: 'NY' },
    { city: 'Gilbert', state: 'AZ' },
    { city: 'Glendale', state: 'AZ' },
    { city: 'North Las Vegas', state: 'NV' },
    { city: 'Winston-Salem', state: 'NC' },
    { city: 'Chesapeake', state: 'VA' },
    { city: 'Norfolk', state: 'VA' },
    { city: 'Fremont', state: 'CA' },
    { city: 'Garland', state: 'TX' },
    { city: 'Irving', state: 'TX' },
    { city: 'Hialeah', state: 'FL' },
    { city: 'Richmond', state: 'VA' },
    { city: 'Boise', state: 'ID' },
    { city: 'Spokane', state: 'WA' },
    { city: 'Baton Rouge', state: 'LA' },

    // State Capitals and Notable Cities
    { city: 'Albany', state: 'NY' },
    { city: 'Annapolis', state: 'MD' },
    { city: 'Augusta', state: 'ME' },
    { city: 'Bismarck', state: 'ND' },
    { city: 'Carson City', state: 'NV' },
    { city: 'Cheyenne', state: 'WY' },
    { city: 'Columbia', state: 'SC' },
    { city: 'Concord', state: 'NH' },
    { city: 'Des Moines', state: 'IA' },
    { city: 'Dover', state: 'DE' },
    { city: 'Frankfort', state: 'KY' },
    { city: 'Harrisburg', state: 'PA' },
    { city: 'Hartford', state: 'CT' },
    { city: 'Helena', state: 'MT' },
    { city: 'Jackson', state: 'MS' },
    { city: 'Jefferson City', state: 'MO' },
    { city: 'Juneau', state: 'AK' },
    { city: 'Lansing', state: 'MI' },
    { city: 'Little Rock', state: 'AR' },
    { city: 'Montpelier', state: 'VT' },
    { city: 'Olympia', state: 'WA' },
    { city: 'Pierre', state: 'SD' },
    { city: 'Providence', state: 'RI' },
    { city: 'Salem', state: 'OR' },
    { city: 'Santa Fe', state: 'NM' },
    { city: 'Springfield', state: 'IL' },
    { city: 'Tallahassee', state: 'FL' },
    { city: 'Topeka', state: 'KS' },
    { city: 'Trenton', state: 'NJ' },

    // Additional Notable Cities
    { city: 'Akron', state: 'OH' },
    { city: 'Birmingham', state: 'AL' },
    { city: 'Bridgeport', state: 'CT' },
    { city: 'Cambridge', state: 'MA' },
    { city: 'Cedar Rapids', state: 'IA' },
    { city: 'Dayton', state: 'OH' },
    { city: 'Eugene', state: 'OR' },
    { city: 'Fargo', state: 'ND' },
    { city: 'Grand Rapids', state: 'MI' },
    { city: 'Green Bay', state: 'WI' },
    { city: 'Huntsville', state: 'AL' },
    { city: 'Knoxville', state: 'TN' },
    { city: 'Mobile', state: 'AL' },
    { city: 'Montgomery', state: 'AL' },
    { city: 'New Haven', state: 'CT' },
    { city: 'Peoria', state: 'IL' },
    { city: 'Rochester', state: 'NY' },
    { city: 'Shreveport', state: 'LA' },
    { city: 'Syracuse', state: 'NY' },
    { city: 'Tacoma', state: 'WA' },
    { city: 'Yonkers', state: 'NY' },
    { city: 'Columbia', state: 'MD' },
    { city: 'Delray Beach', state: 'FL' },
    { city: 'Brooklyn', state: 'NY' },

    // Smaller Cities and Towns
    { city: 'Abilene', state: 'TX' },
    { city: 'Amarillo', state: 'TX' },
    { city: 'Ann Arbor', state: 'MI' },
    { city: 'Asheville', state: 'NC' },
    { city: 'Bend', state: 'OR' },
    { city: 'Boulder', state: 'CO' },
    { city: 'Burbank', state: 'CA' },
    { city: 'Charleston', state: 'SC' },
    { city: 'Chattanooga', state: 'TN' },
    { city: 'Clearwater', state: 'FL' },
    { city: 'Denton', state: 'TX' },
    { city: 'Evansville', state: 'IN' },
    { city: 'Fort Collins', state: 'CO' },
    { city: 'Gainesville', state: 'FL' },
    { city: 'Glendale', state: 'CA' },
    { city: 'High Point', state: 'NC' },
    { city: 'Joliet', state: 'IL' },
    { city: 'Lakewood', state: 'CO' },
    { city: 'Macon', state: 'GA' },
    { city: 'Naperville', state: 'IL' },
    { city: 'Oxnard', state: 'CA' },
    { city: 'Pasadena', state: 'CA' },
    { city: 'Quincy', state: 'MA' },
    { city: 'Rockford', state: 'IL' },
    { city: 'Salinas', state: 'CA' },
    { city: 'Savannah', state: 'GA' },
    { city: 'Sioux Falls', state: 'SD' },
    { city: 'Springfield', state: 'MA' },
    { city: 'Springfield', state: 'MO' },
    { city: 'Torrance', state: 'CA' },
    { city: 'Vallejo', state: 'CA' },
    { city: 'Waterbury', state: 'CT' },
    { city: 'West Palm Beach', state: 'FL' },
    { city: 'Youngstown', state: 'OH' },
  ]

  const filteredCities = useMemo(() => {
    if (!searchTerm) return cities

    return cities.filter(
      (item) =>
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleSelect = (city, state) => {
    setSelectedCity(`${city}, ${state}`)
    setIsOpen(false)
    setSearchTerm('')

    if (onSelect) {
      onSelect({ city, state }) // ✅ route will happen from parent
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div className="flex items-center justify-between">
            <span className={selectedCity ? 'text-gray-900' : 'text-gray-500'}>
              {selectedCity || 'Select a city...'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              // class="size-6"
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-70 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(item.city, item.state)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {item.city}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.state}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No cities found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UsCitiesDropdown
