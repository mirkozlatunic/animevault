export default function Header({ view, setView }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[#080B14]/80 backdrop-blur-md border-b border-white/[0.06]" />

      <div className="relative max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF6B2B, #FF9A5C)' }}>
            <span className="text-[#080B14] font-display text-sm leading-none">AV</span>
          </div>
          <div>
            <span className="font-display text-xl text-[#F0F4FF] leading-none tracking-wide">ANIME</span>
            <span className="font-display text-xl leading-none tracking-wide" style={{ color: '#FF6B2B' }}>VAULT</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 gap-1">
          <NavButton active={view === 'rankings'} onClick={() => setView('rankings')}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Rankings
          </NavButton>
          <NavButton active={view === 'quotes'} onClick={() => setView('quotes')}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Quote Wall
          </NavButton>
        </nav>
      </div>
    </header>
  );
}

function NavButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-heading font-semibold transition-all duration-200"
      style={
        active
          ? { background: '#FF6B2B', color: '#080B14' }
          : { color: '#8A94AA', background: 'transparent' }
      }
    >
      {children}
    </button>
  );
}
