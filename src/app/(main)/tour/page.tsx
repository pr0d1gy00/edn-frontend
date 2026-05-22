'use client';

import { useState } from 'react';
import type { TourShow } from '@/types/tourShow';
import { TourShowsTicker, TourMap, TourShowModal } from '@/components/tour-shows';

export default function TourPage() {
  const [selectedTourShow, setSelectedTourShow] = useState<TourShow | null>(null);

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Tour Shows Ticker */}
      <section id="tour-carousel">
        <TourShowsTicker onShowClick={setSelectedTourShow} />
      </section>

      {/* Tour Map */}
      <section id="tour-map">
        <TourMap />
      </section>

      {/* Tour Show Modal */}
      <TourShowModal
        show={selectedTourShow}
        onClose={() => setSelectedTourShow(null)}
      />
    </div>
  );
}