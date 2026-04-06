import { useEffect, useState, useCallback } from 'react';

function rgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (a) => `rgba(${r},${g},${b},${a})`;
}

export default function QuoteModal({ anime, onClose }) {
  const [toast, setToast] = useState(null);
  const c = rgb(anime.color);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const toast_ = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCopy = useCallback(async (quote) => {
    const text = `"${quote.text}" — ${quote.character}, ${anime.title}`;
    try {
      await navigator.clipboard.writeText(text);
      toast_('Copied to clipboard!');
    } catch {
      toast_('Copy failed — try manually');
    }
  }, [anime.title, toast_]);

  const handleShare = useCallback(async (quote) => {
    const text = `"${quote.text}" — ${quote.character}, ${anime.title}`;
    if (navigator.share) {
      try { await navigator.share({ text, title: `Quote from ${anime.title}` }); } catch { /* cancelled */ }
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' #AnimeVault')}`,
        '_blank', 'noopener,noreferrer'
      );
    }
  }, [anime.title]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(2,4,9,0.88)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quotes from ${anime.title}`}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-scale-in"
        style={{
          background: 'rgba(8,13,22,0.95)',
          border: `1px solid ${c(0.3)}`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 60px ${c(0.08)}, inset 0 1px 0 ${c(0.15)}`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* HUD corner decorations */}
        {[
          'top-0 left-0 border-t border-l',
          'top-0 right-0 border-t border-r',
          'bottom-0 left-0 border-b border-l',
          'bottom-0 right-0 border-b border-r',
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 ${cls} rounded-none pointer-events-none z-20`}
            style={{ borderColor: c(0.6), borderRadius: i === 0 ? '8px 0 0 0' : i === 1 ? '0 8px 0 0' : i === 2 ? '0 0 0 8px' : '0 0 8px 0' }}
            aria-hidden="true"
          />
        ))}

        {/* Header */}
        <div
          className="relative p-5 sm:p-6"
          style={{
            background: `linear-gradient(135deg, ${c(0.15)}, ${c(0.04)})`,
            borderBottom: `1px solid ${c(0.15)}`,
          }}
        >
          {/* Scanlines texture */}
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none rounded-t-2xl" aria-hidden="true" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p
                className="font-heading text-[0.65rem] font-bold uppercase tracking-[0.3em] mb-1.5"
                style={{ color: c(0.7) }}
              >
                Iconic Quotes ·{' '}
                <span style={{ color: c(0.5) }}>#{anime.rank} All Time</span>
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl text-[#EEF2FF] leading-tight mb-2"
                style={{ textShadow: `0 0 30px ${c(0.3)}` }}
              >
                {anime.title}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5">
                {anime.genres.slice(0,3).map(g => (
                  <span
                    key={g}
                    className="font-heading text-[0.6rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: c(0.12), color: anime.color, border: `1px solid ${c(0.25)}` }}
                  >
                    {g}
                  </span>
                ))}
                <span className="text-[#5A6A8A] text-xs ml-1">{anime.rating} ★</span>
              </div>
            </div>

            {/* Close — 44×44 touch target */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#5A6A8A' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quotes */}
        <div className="p-4 sm:p-5 space-y-3">
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

        {/* Footer */}
        <div className="px-5 pb-5 pt-2 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-heading text-xs" style={{ color: '#5A6A8A' }}>
            {anime.quotes.length} quotes · Click outside or press Esc to close
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-2.5 rounded-xl text-sm font-heading font-semibold"
          style={{
            background: 'rgba(0,240,255,0.15)',
            color: '#00F0FF',
            border: '1px solid rgba(0,240,255,0.3)',
            boxShadow: '0 8px 24px rgba(0,240,255,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function QuoteCard({ quote, animeTitle, color, index, onCopy, onShare }) {
  const c = rgb(color);
  return (
    <div
      className="relative rounded-xl p-4 sm:p-5 transition-all duration-200 hover:scale-[1.01] animate-slide-in group/quote"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        animationDelay: `${index * 90}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full opacity-60"
        style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
        aria-hidden="true"
      />

      {/* Opening quote mark */}
      <div
        className="font-display text-5xl leading-none mb-1 -mt-1 select-none"
        style={{ color: c(0.25) }}
        aria-hidden="true"
      >
        "
      </div>

      <blockquote className="text-[#C8D4F0] text-sm sm:text-base leading-relaxed mb-4 font-body italic pl-1">
        {quote.text}
      </blockquote>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} aria-hidden="true" />
          <p className="font-heading font-semibold text-sm" style={{ color }}>
            {quote.character}
          </p>
          <span className="text-[#5A6A8A] text-xs hidden sm:inline">· {animeTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <ActionBtn onClick={() => onCopy(quote)} color={color} label="Copy quote">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </ActionBtn>
          <ActionBtn onClick={() => onShare(quote)} color={color} label="Share quote on Twitter">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </ActionBtn>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, color, label, children }) {
  const c = rgb(color);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        background: c(0.09),
        color,
        border: `1px solid ${c(0.22)}`,
        minHeight: '36px',
      }}
    >
      {children}
    </button>
  );
}
