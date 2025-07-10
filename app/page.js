import Hero from './components/Hero'

export const dynamic = 'force-dynamic' // ensures server runs on every request

// async function getCityFromIP() {
//   try {
//     const res = await fetch('https://ipinfo.io/json?token=70d099f705fd64') // Add your token
//     if (!res.ok) return null
//     const data = await res.json()
//     return data.city || null
//   } catch {
//     return null
//   }
// }

// async function fetchPlaces(city) {
//   if (!city) return []

//   const response = await fetch('http://localhost:3000/api/google-place-api', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ query: `shared commercial kitchen in ${city}` }),
//     cache: 'no-store',
//   })

//   if (!response.ok) return []

//   const data = await response.json()
//   return data.places || []
// }

export default async function IndexPage() {
  // const city = await getCityFromIP()
  // const places = await fetchPlaces(city)

  return (
    <>
      <Hero
        herotext="Find Shared Commercial Kitchen Space in Your City"
        heroSubText="Find the Commercial Kitchens for Rent Near You"
        textColor="text-white"
        imageUrl="/images/shared-commercial-kitchen.jpg"
      />
      <main>
        {/* <h2 className="text-3xl lg:text-5xl font-bold my-10 text-center max-w-xl mx-auto">
          {city
            ? `Shared-Use Commercial Kitchens in ${city}`
            : 'Detecting your location...'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.map((place, i) => (
            <div
              key={place.id || i}
              className="bg-gray-100 border border-gray-200 p-4 rounded"
            >
              <h2 className="text-lg font-semibold">
                {place.displayName?.text || 'Unnamed Place'}
              </h2>
              <p>{place.formattedAddress}</p>
              {place.priceLevel !== undefined && (
                <p>Price Level: {place.priceLevel}</p>
              )}
            </div>
          ))}
        </div> */}
        <section>
          <div className="container max-w-7xl mx-auto px-6 my-20">
            <h2 className="text-3xl lg:text-5xl font-bold my-10 text-center max-w-xl mx-auto">
              What is the Shared Commercial Kitchens Locator?
            </h2>
            <p className="py-4 text-center max-w-[700px] mx-auto leading-normal text-2xl/8">
              The Shared Commercial Kitchens Locator is the premier platform
              connecting culinary entrepreneurs with{' '}
              <strong>commercial kitchen rental</strong> opportunities across
              the country. Whether you're a chef launching a catering business,
              a baker starting a specialty bakery, or a food truck owner seeking
              commissary kitchen space, we help you find the perfect{' '}
              <strong>shared-use commercial kitchen</strong> to legally operate
              and grow your food business.
            </p>
            <p className="py-4 text-center max-w-[700px] mx-auto leading-normal text-2xl/8">
              Our curated network of{' '}
              <strong>FDA-approved commissary kitchens</strong> and{' '}
              <strong>licensed commercial kitchen spaces</strong> ensures you
              can focus on what you do best – creating amazing food – while we
              handle finding you the right culinary workspace.
            </p>
          </div>
        </section>
        <section>
          <div className="container max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-6">
            <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
              <h3 className="text-2xl font-semibold mb-4">
                Find Commercial Kitchen Rentals
              </h3>
              <p className="py-2 mx-auto leading-normal text-xl/8">
                Connect with commissary kitchen spaces and shared commercial
                kitchens available for hourly, daily, or monthly rental. Perfect
                for chefs, caterers, bakers, food trucks, and food entrepreneurs
                seeking licensed kitchen space.
              </p>
            </div>
            <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
              <h3 className="text-2xl font-semibold mb-4">
                Licensed & Health Code Compliant
              </h3>
              <p className="py-2 mx-auto leading-normal text-xl/8">
                All kitchens meet commercial kitchen health codes and licensing
                requirements, helping you stay compliant with local regulations
                and avoid costly shutdowns or fines.
              </p>
            </div>
            <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
              <h3 className="text-2xl font-semibold mb-4">
                Professional Kitchen Equipment & Storage
              </h3>
              <p className="py-2 mx-auto leading-normal text-xl/8">
                Access commercial-grade kitchen equipment, walk-in coolers,
                freezers, dry storage, and cleaning supplies without the massive
                upfront investment of building your own facility.
              </p>
            </div>
          </div>
        </section>
        <section>
          <div className="container max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-3xl/8 lg:text-5xl font-bold my-10 text-center max-w-xl mx-auto">
              Understanding Shared-Use Commercial Kitchens
            </h2>
            <div className="grid md:grid-cols-2 gap-14">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  What is a Commissary Kitchen?
                </h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  A <strong>commissary kitchen</strong> (also called a{' '}
                  <strong>shared-use commercial kitchen</strong>) is a
                  professionally licensed facility where multiple food
                  businesses can prepare, cook, and package their products.
                  These <strong>commercial kitchen rentals</strong> provide all
                  the equipment, storage, and workspace needed to operate a food
                  business legally.
                </p>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Unlike home kitchens, commissary kitchens meet strict health
                  department regulations and FDA guidelines, allowing you to
                  sell your products to the public, supply restaurants, or
                  operate a food truck business.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  Who Uses Commercial Kitchen Space?
                </h3>
                <div>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    🍰 <strong>Bakeries and pastry chefs</strong> creating
                    specialty desserts
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    🚚 <strong>Food truck operators</strong> preparing mobile
                    menu items
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    🍽️ <strong>Caterers</strong> handling events and corporate
                    dining
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    🏪 <strong>Specialty food producers</strong> making sauces,
                    snacks, and packaged goods
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    👨‍🍳 <strong>Personal chefs</strong> preparing meal prep
                    services
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    🥘 <strong>Ghost kitchen operators</strong> running
                    delivery-only restaurants
                  </p>
                </div>
              </div>
            </div>
            <div className="my-20 border-2 p-14 rounded-[20px]">
              <h3 className="text-3xl font-semibold mb-10 text-center max-w-md mx-auto">
                Commercial Kitchen Rental vs. Building Your Own
              </h3>
              <div className="grid grid-cols-2 gap-14 max-w-3xl mx-auto">
                <div>
                  <h4 className="text-2xl font-semibold mb-4">
                    Building Your Own Kitchen
                  </h4>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ❌ $150,000+ initial investment
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ❌ 6-12 months construction time
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ❌ Permits, inspections, licensing
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ❌ Equipment maintenance costs
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ❌ Utilities, insurance, taxes
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-semibold mb-4">
                    Renting Kitchen Space
                  </h4>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ✅ Start cooking immediately
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ✅ Pay only for time used
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ✅ Professional equipment included
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ✅ Maintenance handled by facility
                  </p>
                  <p className="py-2 mx-auto leading-normal text-xl/8">
                    ✅ Compliance assistance provided
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-slate-50">
          <div className="container max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-3xl/8 lg:text-5xl font-bold my-10 text-center max-w-xl mx-auto">
              Why Choose Shared-Use Kitchens?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative  text-center bg-white">
                <div className="text-7xl mb-4">💰</div>
                <h3 className="text-2xl font-semibold mb-2">Lower Costs</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  No equipment purchases, maintenance, or utility bills to worry
                  about.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative text-center">
                <div className="text-7xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold mb-2">Community</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Network with fellow food entrepreneurs and share knowledge.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative text-center">
                <div className="text-7xl mb-4">⚡</div>
                <h3 className="text-2xl font-semibold mb-4">Fast Start</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Start cooking immediately without lengthy setup processes.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative text-center">
                <div className="text-7xl mb-4">📈</div>
                <h3 className="text-2xl font-semibold mb-4">Scale Easily</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Grow your business with flexible space and incubator programs.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative text-center">
                <div className="text-7xl mb-4">✅</div>
                <h3 className="text-2xl font-semibold mb-4">Stay Compliant</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Professionally managed kitchens ensure health code compliance.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative text-center">
                <div className="text-7xl mb-4">🔧</div>
                <h3 className="text-2xl font-semibold mb-4">Pro Equipment</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Access commercial-grade equipment maintained by professionals.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container max-w-7xl mx-auto px-6 my-20">
            <h2 className="text-3xl/8 lg:text-5xl font-bold my-10 text-center max-w-xl mx-auto">
              Commercial Kitchen Solutions for Every Food Business
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
                <h3 className="text-2xl font-semibold mb-4">
                  Catering Companies
                </h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Find commercial kitchen space for catering with large-capacity
                  equipment, ample prep areas, and storage for serving
                  materials. Perfect for wedding caterers, corporate dining, and
                  special event food service.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
                <h3 className="text-2xl font-semibold mb-4">
                  Food Truck Operators
                </h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Access commissary kitchen space for food trucks with the prep
                  space and storage needed for mobile food operations. Meet
                  health department requirements for food truck licensing.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
                <h3 className="text-2xl font-semibold mb-4">
                  Bakeries & Pastry Shops
                </h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Find commercial baking kitchen rentals with professional
                  ovens, mixers, and temperature-controlled storage for artisan
                  breads, cakes, and specialty pastries.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
                <h3 className="text-2xl font-semibold mb-4">
                  Specialty Food Producers
                </h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Rent commercial kitchen space for manufacturing sauces,
                  snacks, beverages, and packaged goods. Access co-packing
                  services and FDA-compliant production facilities.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
                <h3 className="text-2xl font-semibold mb-4">Ghost Kitchens</h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Launch delivery-only restaurants and virtual brands with
                  flexible commercial kitchen rentals designed for high-volume
                  order fulfillment and multi-brand operations.
                </p>
              </div>
              <div className="border-2 p-8 rounded-[20px] overflow-hidden relative">
                <h3 className="text-2xl font-semibold mb-4">
                  Personal Chefs & Meal Prep
                </h3>
                <p className="py-2 mx-auto leading-normal text-xl/8">
                  Book commercial kitchen space by the hour for meal preparation
                  services, personal chef operations, and subscription meal
                  businesses.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
