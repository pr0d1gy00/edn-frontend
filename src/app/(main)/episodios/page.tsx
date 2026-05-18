import { EpisodesGrid } from "@/components/episodes";

export default function EpisodesPage() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <header className="px-8 py-12 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-black uppercase tracking-tight">
            EPISODIOS
          </h1>
          <div className="mt-4 w-48 h-3 bg-black" />
          <p className="font-plus-jakarta text-black/60 mt-4 text-lg">
            Todos los episodios de la Escuela de Nada
          </p>
        </div>
      </header>

      {/* Episodes Grid — full mode */}
      <section className="py-12">
        <EpisodesGrid mode="full" />
      </section>
    </div>
  );
}
