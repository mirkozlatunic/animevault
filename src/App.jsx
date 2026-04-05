import { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import AnimeCard from './components/AnimeCard';
import QuoteModal from './components/QuoteModal';
import QuoteWall from './components/QuoteWall';
import { animeData, ALL_GENRES } from './data/anime';

export default function App() {
  const [view, setView] = useState('rankings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedAnime, setSelectedAnime] = useState(null);

  const filteredAnime = useMemo(() => {
    return animeData
      .filter(a => selectedGenre === 'All' || a.genres.includes(selectedGenre))
      .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, selectedGenre]);

  const handleViewChange = (newView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-body" style={{ background: '#080B14', color: '#F0F4FF' }}>
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 noise-overlay" aria-hidden="true" />
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-40" aria-hidden="true" />
      {/* Radial glow accent */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(255,107,43,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Header view={view} setView={handleViewChange} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-20">
        {view === 'rankings' ? (
          <>
            {/* Hero section */}
            <div className="text-center mb-10 animate-fade-up">
              <p
                className="font-heading text-xs sm:text-sm font-bold uppercase tracking-[0.35em] mb-3"
                style={{ color: '#00E5FF' }}
              >
                The Definitive Collection
              </p>
              <h1
                className="font-display text-[clamp(3.5rem,12vw,7.5rem)] leading-none mb-4 glow-orange"
                style={{ color: '#F0F4FF' }}
              >
                TOP 30 ANIME
              </h1>
              <p className="text-[#8A94AA] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                The greatest anime series ever made, ranked — with iconic quotes that defined generations.
                Click any card to unlock the words that shaped these worlds.
              </p>
              {/* Stats row */}
              <div className="flex items-center justify-center gap-6 mt-6">
                {[
                  { label: 'Series', value: '30' },
                  { label: 'Quotes', value: `${animeData.reduce((sum, a) => sum + a.quotes.length, 0)}` },
                  { label: 'Genres', value: '8' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-2xl sm:text-3xl" style={{ color: '#FF6B2B' }}>{stat.value}</p>
                    <p className="font-heading text-xs text-[#8A94AA] uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              genres={ALL_GENRES}
            />

            {/* Results count */}
            <div className="flex items-center justify-between mb-4 mt-6">
              <p className="text-[#8A94AA] text-sm font-heading">
                {filteredAnime.length === animeData.length
                  ? `Showing all ${animeData.length} series`
                  : `${filteredAnime.length} result${filteredAnime.length !== 1 ? 's' : ''} found`}
              </p>
              {(searchQuery || selectedGenre !== 'All') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                  className="text-xs font-heading font-semibold uppercase tracking-wider transition-colors hover:text-[#FF6B2B]"
                  style={{ color: '#8A94AA' }}
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Anime list */}
            <div className="space-y-3">
              {filteredAnime.length === 0 ? (
                <div className="text-center py-20 animate-fade-up">
                  <p className="font-display text-5xl text-[#8A94AA] mb-3">NO RESULTS</p>
                  <p className="text-[#8A94AA]">Try a different search or genre filter.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                    className="mt-4 px-5 py-2 rounded-lg font-heading font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105"
                    style={{ background: 'rgba(255,107,43,0.15)', color: '#FF6B2B', border: '1px solid rgba(255,107,43,0.3)' }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredAnime.map((anime, i) => (
                  <AnimeCard
                    key={anime.rank}
                    anime={anime}
                    index={i}
                    onClick={() => setSelectedAnime(anime)}
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <QuoteWall />
        )}
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-8 text-center"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <p className="font-heading text-[#8A94AA] text-xs uppercase tracking-widest">
          AnimeVault · Built with passion for the art of anime
        </p>
      </footer>

      {/* Quote Modal */}
      {selectedAnime && (
        <QuoteModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      )}
    </div>
  );
}
