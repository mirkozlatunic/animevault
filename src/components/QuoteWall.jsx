import { useState, useMemo, useCallback } from 'react';
import { animeData } from '../data/anime';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Flatten all quotes with their parent anime info
const ALL_QUOTES = animeData.flatMap(anime =>
  anime.quotes.map((quote, qi) => ({
    ...quote,
    animeTitle: anime.title,
    animeColor: anime.color,
    animeRank: anime.rank,
    id: `${anime.rank}-${qi}`,
  }))
);

export default function QuoteWall() {
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'All') return ALL_QUOTES;
    return ALL_QUOTES.filter(q => q.animeTitle === filter);
  }, [filter]);

  const showToast = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCopy = useCallback(async (quote) => {
    const text = `"${quote.text}" — ${quote.character}, ${quote.animeTitle}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Quote copied!');
    } catch {
      showToast('Copy failed');
    }
  }, [showToast]);

  const handleShare = useCallback(async (quote) => {
    const text = `"${quote.text}" — ${quote.character}, ${quote.animeTitle}`;
    if (navigator.share) {
      try { await navigator.share({ text, title: `Quote from ${quote.animeTitle}` }); } catch { /* cancelled */ }
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' #AnimeVault')}`,
        '_blank', 'noopener,noreferrer'
      );
    }
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10">
        <p className="text-[#00E5FF] text-sm font-heading tracking-[0.3em] uppercase mb-3">Dream Quote Wall</p>
        <h1 className="font-display text-6xl md:text-8xl text-[#F0F4FF] leading-none mb-4 glow-cyan">
          ALL QUOTES
        </h1>
        <p className="text-[#8A94AA] text-lg max-w-xl mx-auto">
          {ALL_QUOTES.length} iconic lines from {animeData.length} legendary series — copy, share, and let them inspire.
        </p>
      </div>

      {/* Anime filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <FilterChip label="All" active={filter === 'All'} color="#FF6B2B" onClick={() => setFilter('All')} />
        {animeData.map(anime => (
          <FilterChip
            key={anime.rank}
            label={anime.title.length > 20 ? anime.title.substring(0, 20) + '…' : anime.title}
            active={filter === anime.title}
            color={anime.color}
            onClick={() => setFilter(anime.title)}
          />
        ))}
      </div>

      {/* Masonry grid */}
      <div className="masonry-grid">
        {filtered.map((quote, i) => (
          <WallQuoteCard
            key={quote.id}
            quote={quote}
            index={i}
            onCopy={handleCopy}
            onShare={handleShare}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-[#8A94AA]">
          <p className="font-display text-5xl mb-3">NO QUOTES</p>
          <p>Select a different anime filter.</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-xl text-sm font-heading font-semibold"
          style={{ background: '#FF6B2B', color: '#080B14', boxShadow: '0 8px 20px rgba(255,107,43,0.4)' }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wide transition-all duration-150 hover:scale-105 border"
      style={
        active
          ? { background: hexToRgba(color, 0.2), color, borderColor: hexToRgba(color, 0.5), boxShadow: `0 0 12px ${hexToRgba(color, 0.2)}` }
          : { background: 'rgba(255,255,255,0.03)', color: '#8A94AA', borderColor: 'rgba(255,255,255,0.08)' }
      }
    >
      {label}
    </button>
  );
}

function WallQuoteCard({ quote, index, onCopy, onShare }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="masonry-item rounded-xl p-4 transition-all duration-200 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(13,18,32,0.9)',
        border: `1px solid ${hovered ? hexToRgba(quote.animeColor, 0.35) : 'rgba(255,255,255,0.07)'}`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${hexToRgba(quote.animeColor, 0.1)}` : 'none',
      }}
    >
      {/* Colored top bar */}
      <div
        className="h-0.5 w-full rounded-full mb-3"
        style={{ background: `linear-gradient(90deg, ${quote.animeColor}, transparent)` }}
      />

      {/* Anime title + rank */}
      <div className="flex items-center justify-between mb-2.5">
        <p
          className="font-heading text-xs font-bold uppercase tracking-wider"
          style={{ color: quote.animeColor }}
        >
          {quote.animeTitle.length > 22 ? quote.animeTitle.substring(0, 22) + '…' : quote.animeTitle}
        </p>
        <span
          className="font-display text-xs px-1.5 py-0.5 rounded"
          style={{ background: hexToRgba(quote.animeColor, 0.15), color: quote.animeColor }}
        >
          #{quote.animeRank}
        </span>
      </div>

      {/* Quote text */}
      <blockquote
        className="text-[#D8E0F0] text-sm leading-relaxed italic mb-3 font-body"
        style={{ borderLeft: `2px solid ${hexToRgba(quote.animeColor, 0.4)}`, paddingLeft: '0.75rem' }}
      >
        {quote.text}
      </blockquote>

      {/* Character + actions */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full" style={{ background: quote.animeColor }} />
          <p className="text-xs font-heading font-semibold" style={{ color: hexToRgba(quote.animeColor, 0.85) }}>
            {quote.character}
          </p>
        </div>

        <div
          className="flex items-center gap-1.5 transition-opacity duration-200"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <SmallButton onClick={() => onCopy(quote)} color={quote.animeColor} title="Copy quote">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </SmallButton>
          <SmallButton onClick={() => onShare(quote)} color={quote.animeColor} title="Share quote">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </SmallButton>
        </div>
      </div>
    </div>
  );
}

function SmallButton({ onClick, color, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
      style={{
        background: hexToRgba(color, 0.12),
        color,
        border: `1px solid ${hexToRgba(color, 0.25)}`,
      }}
    >
      {children}
    </button>
  );
}
