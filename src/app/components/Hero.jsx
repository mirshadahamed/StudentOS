'use client';

import Image from 'next/image';
import Link from 'next/link';

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
              { 
                icon: "😊", 
                title: "Mood Login", 
                text: "Track and understand your emotions daily.",
                href: "/MoodLogin",
                color: "from-purple-500 to-pink-500"
              },
              { 
                icon: "💰", 
                title: "Finance", 
                text: "Manage your finances smartly.",
                href: "/finance",
                color: "from-green-500 to-emerald-500"
              },
              { 
                icon: "📊", 
                title: "Smart Planning", 
                text: "Plan your goals efficiently.",
                href: "/planning",
                color: "from-blue-500 to-cyan-500"
              },
              { 
                icon: "🚀", 
                title: "Analytics", 
                text: "Gain insights from your data.",
                href: "/analytics",
                color: "from-orange-500 to-red-500"
              },
            ].map((card, index) => (
              <Link href={card.href} key={index}>
                <div
                  className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      {card.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">
                      {card.text}
                    </p>
                    
                    {/* Arrow indicator on hover */}
                    <div className="mt-4 flex items-center gap-1 text-transparent group-hover:text-purple-600 transition-all duration-300">
                      <span className="text-sm font-medium">Get started</span>
                      <svg 
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}