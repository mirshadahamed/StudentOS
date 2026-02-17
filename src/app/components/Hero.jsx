'use client';

import Image from 'next/image';

export default function HeroWithCards() {
  return (
    <main className="relative">
      {/* Full‑screen hero banner */}
      <section className="relative h-screen w-full">
        <Image
          src="https://picsum.photos/1920/1080?grayscale"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            Welcome to the road
          </h1>
          <p className="mb-8 max-w-2xl px-4 text-xl">
            Experience the thrill of the open road. Scroll down to discover
            more.
          </p>
          <a
            href="#cards-section"
            className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Explore
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white flex items-start justify-center">
            <div className="mt-2 h-2 w-1 rounded-full bg-white" />
          </div>
        </div>
      </section>

      {/* Four cards section with anchor id */}
      <div
        id="cards-section"
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4 md:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 md:text-4xl">
            Discover our features
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="group transform rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-600">
                🚗
              </div>
              <h3 className="mb-2 text-xl font-semibold">Speed</h3>
              <p className="text-gray-600">
                Experience unparalleled acceleration and handling.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group transform rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                ⚡
              </div>
              <h3 className="mb-2 text-xl font-semibold">Efficiency</h3>
              <p className="text-gray-600">
                Advanced engineering for maximum range and minimal impact.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group transform rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-3xl text-purple-600">
                🛡️
              </div>
              <h3 className="mb-2 text-xl font-semibold">Safety</h3>
              <p className="text-gray-600">
                Cutting‑edge driver assistance and protection systems.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group transform rounded-2xl bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-600">
                🌟
              </div>
              <h3 className="mb-2 text-xl font-semibold">Comfort</h3>
              <p className="text-gray-600">
                Luxurious interiors designed for every journey.
              </p>
            </div>
          </div>

          <p className="mt-16 text-center text-gray-500">
            You've seen the cards – keep scrolling, the road goes on.
          </p>
        </div>
      </div>
    </main>
  );
}