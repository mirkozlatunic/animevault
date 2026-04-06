import { useState, useMemo, useCallback } from 'react';
import { animeData } from '../data/anime';

function rgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (a) => `rgba(${r},${g},${b},${a})`;
}

const ALL_QUOTES = animeData.flatMap(anime =>
  anime.quotes.map((q, i) => ({
    ...q,
    animeTitle: anime.title,
    animeColor: anime.color,
    animeRank:  anime.rank,
    id: `${anime.rank}-${i}`,
  }))
);

export default function QuoteWall() {
  const [filter, setFilter] = useState('All');
  const [toast, setToast]   = useState(null);

  const filtered = useMemo(() =>
    filter === 'All' ? ALL_QUOTES : ALL_QUOTES.filter(q => q.animeTitle === filter),
    [filter]
  );

  const showToast = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCopy = useCallback(async (q) => {
    const text = `"${q.text}" — ${q.character}, ${q.animeTitle}`;
    try { await navigator.clipboard.writeText(text); showToast('Copied!'); }
    catch { showToast('Copy failed'); }
  }, [showToast]);

  const handleShare = useCallback(async (q) => {
    const text = `"${q.text}" — ${q.character}, ${q.animeTitle}`;
    if (navigator.share) {
      try { await navigator.share({ text, title: `Quote from ${q.animeTitle}` }); } catch { /* cancelled */ }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' #AnimeVault')}`, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <div className="text-center mb-12 animate-fade-up">
        <p
          className="font-heading text-xs font-bold tracking-[0.35em] uppercase mb-3"
          style={{ color: 'rgba(0,240,255,0.7)' }}
        >
          Dream Quote Wall
        </p>
        <h1
          className="font-display font-bold leading-none mb-4 glow-cyan"
          style={{ fontSize: 'clamp(3.5rem,12vw,7rem)', color: '#EEF2FF' }}
        >
          ALL QUOTES
        </h1>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mb-5">
          {[
            { n: ALL_QUOTES.length, label: 'Total Quotes' },
            { n: animeData.length,  label: 'Anime Series' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold" style={{ color: '#00F0FF' }}>{s.n}</p>
              <p className="font-heading text-xs uppercase tracking-widest" style={{ color: '#5A6A8A' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[#5A6A8A] max-w-lg mx-auto text-sm leading-relaxed">
          Every iconic line from every legendary series. Hover to copy or share.
        </p>
      </div>

      {/* ── Filter chips ── */}
      <div
        className="flex flex-wrap gap-2 mb-8 justify-center"
        role="group"
        aria-label="Filter quotes by anime"
      >
        <FilterChip label="All" active={filter === 'All'} color="#00F0FF" onClick={() => setFilter('All')} />
        {animeData.map(a => (
          <FilterChip
            key={a.rank}
            label={a.title.length > 22 ? a.title.slice(0,22) + '…' : a.title}
            active={filter === a.title}
            color={a.color}
            onClick={() => setFilter(a.title)}
          />
        ))}
      </div>

      {/* ── Masonry ── */}
      {filtered.length > 0 ? (
        <div className="masonry-grid">
          {filtered.map((q, i) => (
            <WallCard key={q.id} quote={q} index={i} onCopy={handleCopy} onShare={handleShare} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24" aria-live="polite">
          <p className="font-display text-5xl mb-3" style={{ color: '#5A6A8A' }}>NO QUOTES</p>
          <p className="text-[#5A6A8A] text-sm">Select a different filter to browse quotes.</p>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-2.5 rounded-xl text-sm font-heading font-semibold"
          style={{
            background: 'rgba(0,240,255,0.12)',
            color: '#00F0FF',
            border: '1px solid rgba(0,240,255,0.3)',
            boxShadow: '0 8px 24px rgba(0,240,255,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  const c = rgb(color);
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="px-3 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95 border"
      style={
        active
          ? { background: c(0.14), color, borderColor: c(0.4), boxShadow: `0 0 14px ${c(0.18)}` }
          : { background: 'rgba(255,255,255,0.03)', color: '#5A6A8A', borderColor: 'rgba(255,255,255,0.07)' }
      }
    >
      {label}
    </button>
  );
}

function WallCard({ quote, index, onCopy, onShare }) {
  const [hovered, setHovered] = useState(false);
  const c = rgb(quote.animeColor);

  return (
    <div
      className="masonry-item rounded-xl p-4 transition-all duration-250"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(11,17,32,0.9)' : 'rgba(8,13,22,0.8)',
        border: `1px solid ${hovered ? c(0.3) : 'rgba(255,255,255,0.06)'}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.5), 0 0 24px ${c(0.1)}` : '0 2px 12px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-px w-full rounded-full mb-3"
        style={{ background: `linear-gradient(90deg, ${quote.animeColor}, transparent)`, opacity: hovered ? 1 : 0.4, transition: 'opacity 0.25s' }}
        aria-hidden="true"
      />

      {/* Anime + rank */}
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <p
          className="font-heading text-[0.65rem] font-bold uppercase tracking-wider truncate"
          style={{ color: quote.animeColor }}
        >
          {quote.animeTitle}
        </p>
        <span
          className="font-heading text-[0.6rem] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
          style={{ background: c(0.14), color: quote.animeColor, border: `1px solid ${c(0.3)}` }}
          aria-label={`Ranked #${quote.animeRank}`}
        >
          #{quote.animeRank}
        </span>
      </div>

      {/* Quote */}
      <blockquote
        className="text-[#C8D4F0] text-sm leading-relaxed italic mb-3 font-body pl-3"
        style={{ borderLeft: `2px solid ${c(0.45)}` }}
      >
        {quote.text}
      </blockquote>

      {/* Character + actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div
            className="w-1 h-1 rounded-full flex-shrink-0"
            style={{ background: quote.animeColor, boxShadow: `0 0 4px ${quote.animeColor}` }}
            aria-hidden="true"
          />
          <p className="font-heading font-semibold text-xs" style={{ color: c(0.85) }}>
            {quote.character}
          </p>
        </div>

        {/* Actions — visible only on hover */}
        <div
          className="flex items-center gap-1.5 transition-all duration-200"
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.85)' }}
          aria-hidden={!hovered}
        >
          <IconBtn onClick={() => onCopy(quote)} color={quote.animeColor} title="Copy quote">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </IconBtn>
          <IconBtn onClick={() => onShare(quote)} color={quote.animeColor} title="Share quote">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ onClick, color, title, children }) {
  const c = rgb(color);
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
      style={{ background: c(0.12), color, border: `1px solid ${c(0.25)}` }}
    >
      {children}
    </button>
  );
}
