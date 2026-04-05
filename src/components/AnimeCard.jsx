import { useRef, useEffect } from 'react';

const GENRE_STYLES = {
  Action:    'bg-red-500/10 text-red-400 border-red-500/25',
  Adventure: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
  Drama:     'bg-purple-500/10 text-purple-400 border-purple-500/25',
  Fantasy:   'bg-blue-500/10 text-blue-400 border-blue-500/25',
  'Sci-Fi':  'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  Comedy:    'bg-yellow-400/10 text-yellow-400 border-yellow-400/25',
  Thriller:  'bg-rose-500/10 text-rose-400 border-rose-500/25',
  Romance:   'bg-pink-500/10 text-pink-400 border-pink-500/25',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.5;
        return (
          <span
            key={i}
            className="text-sm leading-none"
            style={{ color: filled || half ? '#FFD700' : 'rgba(255,215,0,0.2)' }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function AnimeCard({ anime, index, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the reveal by index (capped at 300ms)
          const delay = Math.min(index * 45, 300);
          setTimeout(() => {
            if (ref.current) ref.current.classList.add('card-visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  // Hex to rgba helper for glow
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <article
      ref={ref}
      className="anime-card card-hidden group relative flex rounded-xl overflow-hidden cursor-pointer select-none"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View quotes for ${anime.title}`}
      style={{ '--accent': anime.color }}
    >
      {/* ── Ghost rank number behind card ── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display leading-none pointer-events-none select-none z-0"
        style={{
          fontSize: 'clamp(5rem, 12vw, 9rem)',
          color: anime.color,
          opacity: 0.04,
          right: '-0.1em',
        }}
      >
        {String(anime.rank).padStart(2, '0')}
      </div>

      {/* ── Thumbnail panel ── */}
      <div
        className="relative flex-shrink-0 w-24 sm:w-36 md:w-44 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${hexToRgba(anime.color, 0.22)}, ${hexToRgba(anime.color, 0.06)})`,
          minHeight: '120px',
        }}
      >
        {/* Diagonal line texture */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-[200%] -left-1/2"
              style={{
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${anime.color}, transparent)`,
                opacity: 0.12,
                top: `${i * 18}px`,
                transform: 'rotate(-35deg)',
              }}
            />
          ))}
        </div>

        {/* Rank badge */}
        <div
          className="absolute top-2 left-2 z-10 font-display text-xs px-2 py-0.5 rounded-md leading-tight"
          style={{ background: anime.color, color: '#080B14' }}
        >
          #{anime.rank}
        </div>

        {/* Anime initial monogram */}
        <div className="relative z-10 text-center px-2">
          <p
            className="font-display text-3xl sm:text-4xl leading-none mb-1"
            style={{ color: anime.color, textShadow: `0 0 20px ${hexToRgba(anime.color, 0.5)}` }}
          >
            {anime.title.split(' ').slice(0, 2).map(w => w[0]).join('')}
          </p>
          <p
            className="font-heading text-[0.6rem] sm:text-xs text-center leading-tight font-semibold tracking-wider opacity-60"
            style={{ color: anime.color }}
          >
            {anime.title.length > 18 ? anime.title.substring(0, 18) + '…' : anime.title}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex-1 min-w-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between"
        style={{
          background: 'rgba(13,18,32,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Left accent bar on hover */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: `linear-gradient(to bottom, transparent, ${anime.color}cc, transparent)` }}
        />

        <div>
          {/* Title + genres row */}
          <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1.5">
            <h3 className="font-heading text-base sm:text-lg font-bold text-[#F0F4FF] leading-tight group-hover:text-white transition-colors">
              {anime.title}
            </h3>
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {anime.genres.slice(0, 4).map(genre => (
              <span
                key={genre}
                className={`genre-tag ${GENRE_STYLES[genre] || 'bg-white/5 text-white/50 border-white/15'}`}
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-[#8A94AA] text-xs sm:text-sm leading-relaxed line-clamp-2">
            {anime.description}
          </p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-center gap-2">
            <StarRating rating={anime.rating} />
            <span className="text-[#8A94AA] font-heading text-xs font-semibold">{anime.rating}</span>
            <span className="hidden sm:inline text-[#8A94AA]/50 text-xs">·</span>
            <span className="hidden sm:inline text-[#8A94AA] text-xs">{anime.quotes.length} quotes</span>
          </div>

          <button
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-105"
            style={{
              background: hexToRgba(anime.color, 0.12),
              color: anime.color,
              border: `1px solid ${hexToRgba(anime.color, 0.3)}`,
            }}
            onClick={e => { e.stopPropagation(); onClick(); }}
          >
            <span className="hidden sm:inline">View Quotes</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
