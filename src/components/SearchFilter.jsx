const GENRE_PALETTES = {
  Action:    { text: '#FF6B6B', border: 'rgba(255,107,107,0.35)', bg: 'rgba(255,107,107,0.1)'  },
  Adventure: { text: '#FF8C42', border: 'rgba(255,140,66,0.35)',  bg: 'rgba(255,140,66,0.1)'   },
  Drama:     { text: '#C084FC', border: 'rgba(192,132,252,0.35)', bg: 'rgba(192,132,252,0.1)'  },
  Fantasy:   { text: '#60A5FA', border: 'rgba(96,165,250,0.35)',  bg: 'rgba(96,165,250,0.1)'   },
  'Sci-Fi':  { text: '#00F0FF', border: 'rgba(0,240,255,0.35)',   bg: 'rgba(0,240,255,0.08)'   },
  Comedy:    { text: '#FFD600', border: 'rgba(255,214,0,0.35)',   bg: 'rgba(255,214,0,0.1)'    },
  Thriller:  { text: '#F87171', border: 'rgba(248,113,113,0.35)', bg: 'rgba(248,113,113,0.1)'  },
  Romance:   { text: '#F472B6', border: 'rgba(244,114,182,0.35)', bg: 'rgba(244,114,182,0.1)'  },
};

export default function SearchFilter({ searchQuery, setSearchQuery, selectedGenre, setSelectedGenre, genres }) {
  return (
    <div
      className="sticky top-16 z-40 pt-4 pb-3"
      style={{ background: 'linear-gradient(to bottom, #040609 60%, transparent)' }}
    >
      {/* Search */}
      <div className="relative mb-3">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="rgba(90,106,138,1)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search anime by title…"
          aria-label="Search anime by title"
          className="w-full pl-11 pr-10 py-3 rounded-xl text-sm font-body text-[#EEF2FF] placeholder-[#5A6A8A] outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            /* Ensure 48px touch height (py-3 = 12px*2 + font = ~44px on mobile, py-3.5 would be safer) */
            minHeight: '48px',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(0,240,255,0.4)';
            e.target.style.boxShadow = '0 0 0 3px rgba(0,240,255,0.06), 0 0 16px rgba(0,240,255,0.08)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#5A6A8A' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Genre pills */}
      <div className="flex gap-2 overflow-x-auto genre-scroll pb-1" role="group" aria-label="Filter by genre">
        {genres.map(genre => {
          const active = selectedGenre === genre;
          const p = GENRE_PALETTES[genre];
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              aria-pressed={active}
              className="genre-tag flex-shrink-0"
              style={
                genre === 'All'
                  ? active
                    ? { background: 'rgba(0,240,255,0.15)', color: '#00F0FF', borderColor: 'rgba(0,240,255,0.4)', boxShadow: '0 0 12px rgba(0,240,255,0.2)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#5A6A8A', borderColor: 'rgba(255,255,255,0.1)' }
                  : active
                    ? { background: p.bg, color: p.text, borderColor: p.border, boxShadow: `0 0 12px ${p.border}` }
                    : { background: 'rgba(255,255,255,0.03)', color: '#5A6A8A', borderColor: 'rgba(255,255,255,0.08)' }
              }
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
