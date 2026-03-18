'use client';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tighter gradient-text-blue" style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-1px' }}>
              Nexus
            </span>
            <span className="text-[11px] text-text-muted/30">|</span>
            <p className="text-[11px] text-text-muted/30 font-light">Powered by Claude AI & Brave Search</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-text-muted/30 hover:text-text-muted/60 cursor-pointer transition-colors">Privacy</span>
            <span className="text-[11px] text-text-muted/30 hover:text-text-muted/60 cursor-pointer transition-colors">Terms</span>
            <span className="text-[11px] text-text-muted/30 hover:text-text-muted/60 cursor-pointer transition-colors">About</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
