import { useEffect, useState, useCallback } from 'react';

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function QuoteModal({ anime, onClose }) {
  const [toast, setToast] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const showToast = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCopy = useCallback(async (quote) => {
    const text = `"${quote.text}" — ${quote.character}, ${anime.title}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Quote copied!');
    } catch {
      showToast('Copy failed — try manually');
    }
  }, [anime.title, showToast]);

  const handleShare = useCallback(async (quote) => {
    const text = `"${quote.text}" — ${quote.character}, ${anime.title}`;
    if (navigator.share) {
      try {
        await navigator.share({ text, title: `Quote from ${anime.title}` });
      } catch { /* user cancelled */ }
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' #AnimeVault')}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    }
  }, [anime.title]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(4,6,16,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-scale-in"
        style={{
          background: '#0D1220',
          border: `1px solid ${hexToRgba(anime.color, 0.25)}`,
          boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 40px ${hexToRgba(anime.color, 0.1)}`,
        }}
      >
        {/* Header */}
        <div
          className="relative p-6 pb-5"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(anime.color, 0.18)}, ${hexToRgba(anime.color, 0.05)})`,
            borderBottom: `1px solid ${hexToRgba(anime.color, 0.15)}`,
          }}
        >
          {/* Decorative lines */}
          <div className="absolute inset-0 overflow-hidden rounded-t-2xl pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[200%] -left-1/2"
                style={{
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${anime.color}, transparent)`,
                  opacity: 0.08,
                  top: `${i * 22}px`,
                  transform: 'rotate(-25deg)',
                }}
              />
            ))}
          </div>

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p
                className="font-heading text-xs font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: hexToRgba(anime.color, 0.8) }}
              >
                Iconic Quotes
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-[#F0F4FF] leading-tight">
                {anime.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                {anime.genres.slice(0, 3).map(g => (
                  <span
                    key={g}
                    className="text-xs font-heading font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{ background: hexToRgba(anime.color, 0.15), color: anime.color }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#8A94AA' }}
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quotes */}
        <div className="p-5 space-y-4">
          {anime.quotes.map((quote, i) => (
            <QuoteCard
              key={i}
              quote={quote}
              animeTitle={anime.title}
              color={anime.color}
              index={i}
              onCopy={handleCopy}
              onShare={handleShare}
            />
          ))}
        </div>

        {/* Footer rating */}
        <div
          className="px-5 pb-5 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-1.5 pt-4">
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= Math.round(anime.rating) ? '#FFD700' : 'rgba(255,215,0,0.2)' }}>★</span>
            ))}
            <span className="text-[#8A94AA] text-sm font-heading ml-1">{anime.rating} / 5</span>
          </div>
          <p className="pt-4 text-[#8A94AA] text-xs font-heading">
            Rank #{anime.rank} · All Time
          </p>
        </div>
      </div>

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

function QuoteCard({ quote, animeTitle, color, index, onCopy, onShare }) {
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <div
      className="rounded-xl p-4 sm:p-5 transition-all duration-200 hover:scale-[1.01] animate-slide-in"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        animationDelay: `${index * 80}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Quote mark */}
      <div
        className="font-display text-5xl leading-none mb-2 -mt-1"
        style={{ color: hexToRgba(color, 0.35) }}
      >
        "
      </div>

      <blockquote className="text-[#E8EDF8] text-sm sm:text-base leading-relaxed mb-3 font-body italic">
        {quote.text}
      </blockquote>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
          <p className="font-heading font-semibold text-sm" style={{ color }}>
            {quote.character}
          </p>
          <span className="text-[#8A94AA] text-xs">· {animeTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            onClick={() => onCopy(quote)}
            color={color}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            label="Copy"
          />
          <ActionButton
            onClick={() => onShare(quote)}
            color={color}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            }
            label="Share"
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, color, icon, label }) {
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        background: hexToRgba(color, 0.1),
        color,
        border: `1px solid ${hexToRgba(color, 0.25)}`,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
