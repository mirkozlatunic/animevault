import { useRef, useEffect, useState } from 'react';
import { useAnimeImage } from '../hooks/useAnimeImage';

const GENRE_STYLES = {
  Action:    'text-red-400 border-red-500/30 bg-red-500/[0.08]',
  Adventure: 'text-orange-400 border-orange-500/30 bg-orange-500/[0.08]',
  Drama:     'text-purple-400 border-purple-500/30 bg-purple-500/[0.08]',
  Fantasy:   'text-blue-400 border-blue-500/30 bg-blue-500/[0.08]',
  'Sci-Fi':  'text-cyan-400 border-cyan-500/30 bg-cyan-500/[0.07]',
  Comedy:    'text-yellow-400 border-yellow-500/30 bg-yellow-500/[0.08]',
  Thriller:  'text-rose-400 border-rose-500/30 bg-rose-500/[0.08]',
  Romance:   'text-pink-400 border-pink-500/30 bg-pink-500/[0.08]',
};

function rgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" aria-hidden="true"
          fill={i <= Math.floor(rating) ? '#FFD600' : i === Math.ceil(rating) && rating % 1 >= 0.5 ? '#FFD600' : 'rgba(255,214,0,0.18)'}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );
}

export default function AnimeCard({ anime, index, onClick }) {
  const cardRef   = useRef(null);
  const [visible, setVisible] = useState(false);   // for scroll-reveal
  const [inView,  setInView]  = useState(false);   // triggers image fetch

  const { imageUrl, loading: imgLoading } = useAnimeImage(anime.title, inView);

  // One observer handles both reveal animation and image fetch trigger
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = Math.min(index * 40, 280);
          setTimeout(() => setVisible(true), delay);
          setInView(true);       // start image fetch
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -16px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="anime-card group relative flex rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(11,17,32,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(8px)',
        minHeight: '120px',
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)',
      }}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`Open quotes for ${anime.title}, ranked #${anime.rank}`}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${rgba(anime.color,0.35)}, 0 8px 32px ${rgba(anime.color,0.12)}` }}
        aria-hidden="true"
      />

      {/* Ghost rank */}
      <div
        className="rank-ghost absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ fontSize: 'clamp(4.5rem,10vw,8rem)', color: rgba(anime.color,0.05), lineHeight: 1, zIndex: 0 }}
        aria-hidden="true"
      >
        {String(anime.rank).padStart(2,'0')}
      </div>

      {/* ── Thumbnail panel ── */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{
          width: 'clamp(80px,16vw,160px)',
          background: rgba(anime.color, 0.08),
          borderRight: `1px solid ${rgba(anime.color, 0.15)}`,
        }}
      >
        {/* Actual anime image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${anime.title} cover art`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: imgLoading ? 0 : 1 }}
            loading="lazy"
          />
        )}

        {/* Gradient overlay so rank badge + monogram always legible */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: imageUrl
              ? `linear-gradient(to right, ${rgba(anime.color,0.15)}, rgba(8,13,22,0.5)), linear-gradient(to top, rgba(4,6,9,0.7) 0%, transparent 50%)`
              : `linear-gradient(160deg, ${rgba(anime.color,0.2)}, ${rgba(anime.color,0.05)})`,
          }}
          aria-hidden="true"
        />

        {/* Diagonal lines — shown only when no image */}
        {!imageUrl && Array.from({length:8}).map((_,i) => (
          <div key={i} className="absolute w-[250%] -left-[75%] h-px pointer-events-none"
            style={{ background:`linear-gradient(90deg,transparent,${rgba(anime.color,0.15)},transparent)`, top:`${i*20}px`, transform:'rotate(-40deg)' }}
            aria-hidden="true"
          />
        ))}

        {/* Loading shimmer */}
        {imgLoading && !imageUrl && (
          <div
            className="absolute inset-0 z-10"
            style={{
              background: `linear-gradient(90deg, ${rgba(anime.color,0.05)} 25%, ${rgba(anime.color,0.12)} 50%, ${rgba(anime.color,0.05)} 75%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
            aria-hidden="true"
          />
        )}

        {/* Rank badge */}
        <div
          className="absolute top-2 left-2 z-20 font-heading text-[0.6rem] font-bold px-2 py-0.5 rounded-md"
          style={{ background: rgba(anime.color,0.25), color: anime.color, border: `1px solid ${rgba(anime.color,0.5)}`, backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        >
          #{anime.rank}
        </div>

        {/* Monogram — shown as fallback when no image loaded yet */}
        {!imageUrl && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <p
              className="font-display font-bold leading-none"
              style={{ fontSize:'clamp(1.8rem,5vw,2.8rem)', color: anime.color, filter:`drop-shadow(0 0 12px ${rgba(anime.color,0.5)})` }}
              aria-hidden="true"
            >
              {anime.title.split(' ').slice(0,2).map(w=>w[0]).join('')}
            </p>
          </div>
        )}

        {/* Bottom scan accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 z-20"
          style={{ background: `linear-gradient(90deg, transparent, ${rgba(anime.color,0.5)}, transparent)` }}
          aria-hidden="true"
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-between p-3 sm:p-4">
        {/* Left accent bar on hover */}
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to bottom, transparent, ${anime.color}, transparent)` }}
          aria-hidden="true"
        />

        <div className="pl-2">
          <h3 className="font-heading font-bold text-[#EEF2FF] leading-tight mb-1.5 group-hover:text-white transition-colors"
            style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)' }}>
            {anime.title}
          </h3>

          <div className="flex flex-wrap gap-1 mb-2">
            {anime.genres.slice(0,3).map(g => (
              <span key={g} className={`genre-tag ${GENRE_STYLES[g] || 'text-white/40 border-white/10 bg-white/[0.03]'}`}>{g}</span>
            ))}
          </div>

          <p className="text-[#5A6A8A] text-xs leading-relaxed line-clamp-2 group-hover:text-[#8A9AB8] transition-colors">
            {anime.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pl-2 flex items-center justify-between mt-2.5 gap-2">
          <div className="flex items-center gap-2">
            <Stars rating={anime.rating} />
            <span className="font-heading text-xs font-semibold" style={{ color: '#FFD600' }}>{anime.rating}</span>
            <span className="hidden sm:inline text-[#5A6A8A] text-xs">· {anime.quotes.length} quotes</span>
          </div>

          <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            aria-label={`View quotes for ${anime.title}`}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: rgba(anime.color, 0.1),
              color: anime.color,
              border: `1px solid ${rgba(anime.color, 0.28)}`,
              minHeight: '36px',
            }}
          >
            <span className="hidden sm:inline">Quotes</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
