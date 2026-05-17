'use client';

import TourShowsTicker, { TourMap } from '@/components/tour-shows';

export default function TourPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Tour Shows Ticker */}
      <section id="tour-carousel">
        <TourShowsTicker />
      </section>

      {/* Tour Map */}
      <section id="tour-map">
        <TourMap />
      </section>
    </div>
  );
}