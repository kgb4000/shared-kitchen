import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer>
        <section className="bg-slate-50 py-10">
          <div className="container max-w-7xl mx-auto px-6 my-10">
            <h2 className="text-3xl font-bold my-6">Shared Kitchen Locator</h2>
            <p className="max-w-xl text-md">
              Connecting food entrepreneurs with licensed commercial kitchen
              spaces nationwide. Find your perfect commissary kitchen rental
              today.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="my-4">
                <h3 className="text-xl font-bold my-2">Company</h3>
                <p className="pb-2">About Us</p>
                <p className="pb-2">Contact Us</p>
                <p className="pb-2">Our Partners</p>
                <p className="pb-2">Advertise with Us</p>
                <p className="pb-2">Privacy Policy</p>
                <p className="pb-2">Terms of Use</p>
              </div>
              <div className="my-2">
                <h3 className="text-xl font-bold my-2">Support</h3>
                <p className="pb-2">Frequently Asked Questions</p>
                <p className="pb-2">SCK Center</p>
                <p className="pb-2">SCK Blog</p>

                <h3 className="text-xl font-bold my-2">Resources</h3>
                <p className="pb-2">Frequently Asked Questions</p>
                <p className="pb-2">SCK Center</p>
                <p className="pb-2">SCK Blog</p>
              </div>
              <div className="my-4">
                <h3 className="text-xl font-bold my-2">
                  Popular Kitchen Locations
                </h3>
                <div>
                  <p className="pb-2">
                    <Link href="http://localhost:3000/commercial-kitchen-for-rent/new-york/ny">
                      New York
                    </Link>
                  </p>
                  <p className="pb-2">
                    <Link href="http://localhost:3000/commercial-kitchen-for-rent/los-angeles/ca">
                      Los Angeles
                    </Link>
                  </p>
                  <p className="pb-2">
                    <Link href="http://localhost:3000/commercial-kitchen-for-rent/washington/dc">
                      Washington, DC
                    </Link>
                  </p>
                  <p className="pb-2">
                    <Link href="http://localhost:3000/commercial-kitchen-for-rent/miami/fl">
                      Miami
                    </Link>
                  </p>
                  <p className="pb-2">
                    <Link href="http://localhost:3000/commercial-kitchen-for-rent/atlanta/ga">
                      Atlanta
                    </Link>
                  </p>
                  <p className="pb-2">
                    <Link href="http://localhost:3000/commercial-kitchen-for-rent/houston/tx">
                      Houston
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <p className="text-center bg-orange-600 py-6 text-white font-bold">
          Shared Kitchen Locator &copy;{new Date().getFullYear()}
        </p>
      </footer>
    </>
  )
}
