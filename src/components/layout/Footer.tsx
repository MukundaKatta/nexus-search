'use client';

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>Nexus AI Search Engine — Powered by Claude AI & Brave Search</p>
          <div className="flex items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>About</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
