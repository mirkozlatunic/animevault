import { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import AnimeCard from './components/AnimeCard';
import QuoteModal from './components/QuoteModal';
import QuoteWall from './components/QuoteWall';
import { animeData, ALL_GENRES } from './data/anime';

const TOTAL_QUOTES = animeData.reduce((s, a) => s + a.quotes.length, 0);

export default function App() {
  const [view, setView]             = useState('rankings');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedAnime, setSelectedAnime] = useState(null);

  const filtered = useMemo(() =>
    animeData
      .filter(a => selectedGenre === 'All' || a.genres.includes(selectedGenre))
      .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, selectedGenre]
  );

  const switchView = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ background: '#040609', color: '#EEF2FF' }}>

      {/* ── Fixed background layers ── */}
      <div className="fixed inset-0 bg-layer-grid opacity-60 pointer-events-none z-0" aria-hidden="true" />

      {/* Radial vignette centre glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% 0%, rgba(0,240,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Single horizontal scan line — decorative */}
      <div
        className="fixed left-0 right-0 pointer-events-none z-0 h-px opacity-30"
        style={{ top: '64px', background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)' }}
        aria-hidden="true"
      />

      <Header view={view} setView={switchView} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24">

        {view === 'rankings' ? (
          <>
            {/* ── Hero ── */}
            <div className="text-center mb-10 animate-fade-up">
              <p
                className="font-heading text-xs font-bold uppercase tracking-[0.4em] mb-3"
                style={{ color: 'rgba(0,240,255,0.65)' }}
              >
                The Definitive Collection
              </p>

              {/* Title with layered glow */}
              <div className="relative inline-block mb-4">
                <h1
                  className="font-display font-bold leading-none glow-orange"
                  style={{ fontSize: 'clamp(3.5rem,13vw,8rem)', color: '#EEF2FF' }}
                >
                  TOP 30
                </h1>
                <p
                  className="font-display font-bold leading-none"
                  style={{ fontSize: 'clamp(1.8rem,6vw,3.5rem)', color: '#00F0FF', letterSpacing: '0.15em', marginTop: '-0.1em' }}
                >
                  ANIME
                </p>
              </div>

              <p className="text-[#5A6A8A] max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-7">
                The greatest anime series ever made, ranked and annotated with the quotes that defined them.
                Click any card to reveal the words that shaped these worlds.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                {[
                  { n: '30',         label: 'Series'   },
                  { n: TOTAL_QUOTES, label: 'Quotes'   },
                  { n: '8',          label: 'Genres'   },
                ].map(s => (
                  <div key={s.label} className="relative text-center px-4">
                    <p
                      className="font-display font-bold leading-none mb-0.5"
                      style={{ fontSize: 'clamp(1.8rem,5vw,2.5rem)', color: '#00F0FF', textShadow: '0 0 30px rgba(0,240,255,0.5)' }}
                    >
                      {s.n}
                    </p>
                    <p className="font-heading text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: '#5A6A8A' }}>
                      {s.label}
                    </p>
                    {/* Divider between stats */}
                    {s.label !== 'Genres' && (
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                        aria-hidden="true"
                      />
                    )}
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

            {/* Results bar */}
            <div className="flex items-center justify-between mb-4 mt-5">
              <p className="font-heading text-xs" style={{ color: '#5A6A8A' }}>
                {filtered.length === animeData.length
                  ? `Showing all ${animeData.length} series`
                  : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
              </p>
              {(searchQuery || selectedGenre !== 'All') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                  className="font-heading text-xs font-semibold uppercase tracking-wider transition-colors hover:text-[#00F0FF]"
                  style={{ color: '#5A6A8A' }}
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 animate-fade-up" role="status" aria-live="polite">
                <p className="font-display text-5xl mb-3" style={{ color: '#5A6A8A' }}>NO RESULTS</p>
                <p className="text-[#5A6A8A] text-sm mb-6">Nothing matches your filters right now.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                  className="px-6 py-3 rounded-xl font-heading font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'rgba(0,240,255,0.1)',
                    color: '#00F0FF',
                    border: '1px solid rgba(0,240,255,0.25)',
                    boxShadow: '0 0 20px rgba(0,240,255,0.1)',
                    minHeight: '48px',
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((anime, i) => (
                  <AnimeCard
                    key={anime.rank}
                    anime={anime}
                    index={i}
                    onClick={() => setSelectedAnime(anime)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <QuoteWall />
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 py-8 text-center"
        style={{ borderTop: '1px solid rgba(0,240,255,0.07)' }}
      >
        <div
          className="w-16 h-px mx-auto mb-4"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)' }}
          aria-hidden="true"
        />
        <p className="font-heading text-xs uppercase tracking-[0.25em]" style={{ color: '#5A6A8A' }}>
          AnimeVault · Built with passion for the art of anime
        </p>
        <p className="font-heading text-[0.6rem] uppercase tracking-widest mt-1" style={{ color: 'rgba(90,106,138,0.5)' }}>
          animevault-chi.vercel.app
        </p>
      </footer>

      {/* ── Modal ── */}
      {selectedAnime && (
        <QuoteModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      )}
    </div>
  );
}
