import { EpisodesGrid } from "@/components/episodes";

export const metadata = {
  title: "Todos los Episodios — EDN",
  description: "Explor&aacute; todos los episodios del podcast Escuela de Nada",
};

export default function AllEpisodesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 sm:px-8 py-8 md:py-12 border-b-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-black uppercase tracking-tight">
            EPISODIOS
          </h1>
          <div className="mt-3 sm:mt-4 w-32 sm:w-48 h-2 sm:h-3 bg-black" />
          <p className="font-plus-jakarta text-black/60 mt-3 sm:mt-4 text-base sm:text-lg">
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
