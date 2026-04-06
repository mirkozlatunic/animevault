export default function Header({ view, setView }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glass backdrop */}
      <div
        className="absolute inset-0 glass-strong"
        style={{ borderBottom: '1px solid rgba(0,240,255,0.08)' }}
        aria-hidden="true"
      />
      {/* Cyan top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.6), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* Icon mark */}
          <div
            className="relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,240,255,0.05))',
              border: '1px solid rgba(0,240,255,0.3)',
              boxShadow: '0 0 16px rgba(0,240,255,0.15)',
            }}
          >
            {/* HUD corners */}
            <span
              className="absolute top-0.5 left-0.5 w-2 h-2 pointer-events-none"
              style={{ borderTop: '1px solid rgba(0,240,255,0.8)', borderLeft: '1px solid rgba(0,240,255,0.8)' }}
              aria-hidden="true"
            />
            <span
              className="absolute bottom-0.5 right-0.5 w-2 h-2 pointer-events-none"
              style={{ borderBottom: '1px solid rgba(0,240,255,0.8)', borderRight: '1px solid rgba(0,240,255,0.8)' }}
              aria-hidden="true"
            />
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="rgba(0,240,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <div className="leading-none">
            <p className="font-display text-lg tracking-widest font-bold" style={{ color: '#EEF2FF', letterSpacing: '0.15em' }}>
              ANIME<span style={{ color: '#00F0FF' }}>VAULT</span>
            </p>
            <p className="font-heading text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: 'rgba(0,240,255,0.5)' }}>
              Top 30 Series
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }} role="navigation" aria-label="Main navigation">
          <NavBtn active={view === 'rankings'} onClick={() => setView('rankings')} label="Rankings">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden sm:inline">Rankings</span>
          </NavBtn>
          <NavBtn active={view === 'quotes'} onClick={() => setView('quotes')} label="Quote Wall">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="hidden sm:inline">Quote Wall</span>
          </NavBtn>
        </nav>
      </div>
    </header>
  );
}

function NavBtn({ active, onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold transition-all duration-200 min-h-[40px]"
      style={
        active
          ? {
              background: 'rgba(0,240,255,0.12)',
              color: '#00F0FF',
              border: '1px solid rgba(0,240,255,0.25)',
              boxShadow: '0 0 12px rgba(0,240,255,0.15)',
            }
          : {
              background: 'transparent',
              color: '#5A6A8A',
              border: '1px solid transparent',
            }
      }
    >
      {children}
    </button>
  );
}
