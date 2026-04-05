const GENRE_COLORS = {
  Action:    { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)',   text: '#F87171' },
  Adventure: { bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.35)',  text: '#FB923C' },
  Drama:     { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.35)',  text: '#C084FC' },
  Fantasy:   { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)',  text: '#60A5FA' },
  'Sci-Fi':  { bg: 'rgba(0,229,255,0.1)',    border: 'rgba(0,229,255,0.35)',   text: '#67E8F9' },
  Comedy:    { bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.35)',   text: '#FDE047' },
  Thriller:  { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(220,38,38,0.35)',   text: '#FC8181' },
  Romance:   { bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.35)', text: '#F472B6' },
};

export default function SearchFilter({ searchQuery, setSearchQuery, selectedGenre, setSelectedGenre, genres }) {
  return (
    <div className="sticky top-16 z-40 pt-4 pb-3" style={{ background: 'linear-gradient(to bottom, #080B14 70%, transparent)' }}>
      {/* Search bar */}
      <div className="relative mb-3">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-[#8A94AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search anime by title…"
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-body text-[#F0F4FF] placeholder-[#8A94AA] outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,107,43,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,107,43,0.08)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A94AA] hover:text-[#F0F4FF] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Genre filters */}
      <div className="flex gap-2 overflow-x-auto genre-scroll pb-1">
        {genres.map(genre => {
          const isActive = selectedGenre === genre;
          const colors = GENRE_COLORS[genre];
          return (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className="genre-tag flex-shrink-0 transition-all duration-200 hover:scale-105"
              style={
                genre === 'All'
                  ? isActive
                    ? { background: '#FF6B2B', borderColor: '#FF6B2B', color: '#080B14' }
                    : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: '#8A94AA' }
                  : isActive
                    ? { background: colors.bg, borderColor: colors.border, color: colors.text, boxShadow: `0 0 12px ${colors.border}` }
                    : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: '#8A94AA' }
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
