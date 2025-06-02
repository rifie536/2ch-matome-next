'use client';

import { useState } from 'react';
import { Search, Home, TrendingUp, Clock, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-blue-500 font-bold text-lg">
            <span className="text-2xl">🔥</span>
            <span className="hidden sm:inline">2chまとめ+</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="スレッドを検索..."
                className="w-full px-4 py-2 pr-10 bg-gray-800 text-white rounded-full border-2 border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-6">
            <NavLink href="/" icon={<Home className="w-4 h-4" />}>
              ホーム
            </NavLink>
            <NavLink href="/trending" icon={<TrendingUp className="w-4 h-4" />}>
              人気
            </NavLink>
            <NavLink href="/latest" icon={<Clock className="w-4 h-4" />}>
              最新
            </NavLink>
            <NavLink href="/settings" icon={<Settings className="w-4 h-4" />}>
              設定
            </NavLink>
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden border-t border-gray-800 bg-gray-900 px-4 py-4">
          <div className="flex flex-col gap-2">
            <MobileNavLink href="/" icon={<Home className="w-4 h-4" />}>
              ホーム
            </MobileNavLink>
            <MobileNavLink href="/trending" icon={<TrendingUp className="w-4 h-4" />}>
              人気
            </MobileNavLink>
            <MobileNavLink href="/latest" icon={<Clock className="w-4 h-4" />}>
              最新
            </MobileNavLink>
            <MobileNavLink href="/settings" icon={<Settings className="w-4 h-4" />}>
              設定
            </MobileNavLink>
          </div>
        </nav>
      )}
    </header>
  );
}

function NavLink({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}