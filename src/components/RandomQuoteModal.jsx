import { useState, useEffect, useCallback } from 'react';

function rgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (a) => `rgba(${r},${g},${b},${a})`;
}

function getRandomQuote(quotes, excludeIndex) {
  if (quotes.length <= 1) return 0;
  let idx;
  do { idx = Math.floor(Math.random() * quotes.length); } while (idx === excludeIndex);
  return idx;
}

export default function RandomQuoteModal({ quotes, onClose }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * quotes.length));
  const [toast, setToast] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const quote = quotes[idx];
  const c = rgb(quote.animeColor);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const nextQuote = useCallback(() => {
    setIdx(prev => getRandomQuote(quotes, prev));
    setAnimKey(k => k + 1);
  }, [quotes]);

  const showToast = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCopy = useCallback(async () => {
    const text = `"${quote.text}" — ${quote.character}, ${quote.animeTitle}`;
    try { await navigator.clipboard.writeText(text); showToast('Copied to clipboard!'); }
    catch { showToast('Copy failed'); }
  }, [quote, showToast]);

  const handleShare = useCallback(async () => {
    const text = `"${quote.text}" — ${quote.character}, ${quote.animeTitle}`;
    if (navigator.share) {
      try { await navigator.share({ text, title: `Quote from ${quote.animeTitle}` }); } catch { /* cancelled */ }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' #AnimeVault')}`, '_blank', 'noopener,noreferrer');
    }
  }, [quote]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-backdrop"
      style={{ background: 'rgba(2,4,9,0.92)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Random quote"
    >
      <div
        key={animKey}
        className="relative w-full max-w-lg animate-scale-in text-center"
        style={{
          background: 'rgba(8,13,22,0.95)',
          border: `1px solid ${c(0.3)}`,
          borderRadius: '1.5rem',
          boxShadow: `0 40px 100px rgba(0,0,0,0.8), 0 0 80px ${c(0.1)}`,
          padding: 'clamp(2rem, 6vw, 3rem)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#5A6A8A' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Opening quote */}
        <div
          className="font-display leading-none mb-2 select-none"
          style={{ fontSize: 'clamp(4rem, 10vw, 6rem)', color: c(0.2) }}
          aria-hidden="true"
        >
          "
        </div>

        {/* Quote text */}
        <blockquote
          className="text-[#C8D4F0] leading-relaxed italic font-body mb-6"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
        >
          {quote.text}
        </blockquote>

        {/* Character */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: quote.animeColor, boxShadow: `0 0 8px ${quote.animeColor}` }} aria-hidden="true" />
          <p className="font-heading font-semibold text-sm" style={{ color: quote.animeColor }}>
            {quote.character}
          </p>
        </div>

        {/* Anime title */}
        <p className="font-heading text-xs uppercase tracking-[0.2em] mb-8" style={{ color: '#5A6A8A' }}>
          {quote.animeTitle}
        </p>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <ActionBtn onClick={handleCopy} color={quote.animeColor} label="Copy quote">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </ActionBtn>
          <ActionBtn onClick={handleShare} color={quote.animeColor} label="Share quote">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </ActionBtn>
          <button
            onClick={nextQuote}
            aria-label="New random quote"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95 min-h-[40px]"
            style={{
              background: 'rgba(255,214,0,0.12)',
              color: '#FFD600',
              border: '1px solid rgba(255,214,0,0.3)',
              boxShadow: '0 0 16px rgba(255,214,0,0.1)',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            New Quote
          </button>
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

function ActionBtn({ onClick, color, label, children }) {
  const c = rgb(color);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wide transition-all duration-150 hover:scale-105 active:scale-95 min-h-[40px]"
      style={{
        background: c(0.09),
        color,
        border: `1px solid ${c(0.22)}`,
      }}
    >
      {children}
    </button>
  );
}
