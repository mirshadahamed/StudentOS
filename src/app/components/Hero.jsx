'use client';

import Image from 'next/image';

export default function HeroWithCards() {
  return (
    <main className="relative">
      {/* Hero Section */}
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
            Experience the thrill of the open road.
          </p>

          <a
            href="#cards-section"
            className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Explore
          </a>
        </div>
      </section>

      {/* Cards Section */}
      <section
        id="cards-section"
        className="min-h-screen bg-gray-100 py-20 px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Discover our features
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🚗", title: "Speed", text: "Fast performance." },
              { icon: "⚡", title: "Efficiency", text: "Smart engineering." },
              { icon: "🛡️", title: "Safety", text: "Advanced protection." },
              { icon: "🌟", title: "Comfort", text: "Luxury experience." },
            ].map((card, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-4 text-4xl">{card.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}