'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Menu } from 'lucide-react';
import { useThreads, useTrendingThreads } from '@/hooks/useThreads';
import { formatMomentum, getThreadEmoji } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function BingStyleHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: trendingThreads } = useTrendingThreads(6);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const backgroundImages = [
    'https://source.unsplash.com/1920x1080/?tokyo,night',
    'https://source.unsplash.com/1920x1080/?japan,city',
    'https://source.unsplash.com/1920x1080/?shibuya',
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Background */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgroundImages[0]}')`,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className={`flex items-center gap-2 font-bold text-lg ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                <span className="text-2xl">🔥</span>
                <span>2chまとめ+</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <Link href="/trending" className={`hover:opacity-80 transition-opacity ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  人気
                </Link>
                <Link href="/latest" className={`hover:opacity-80 transition-opacity ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  最新
                </Link>
                <button className={`p-2 rounded-lg hover:bg-gray-200/20 transition-colors ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Search Section */}
        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
              話題のスレッドを探そう
            </h1>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワードを入力..."
                className="w-full px-6 py-4 pr-14 text-lg rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['VIP', 'なんJ', 'ニュー速', 'ゲーム', 'アニメ'].map((tag) => (
                <Link
                  key={tag}
                  href={`/board/${tag}`}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors text-sm"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* Trending Threads */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">トレンド</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingThreads?.map((thread, index) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/thread/${thread.id}`}>
                    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
                      {/* Thumbnail */}
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-6xl text-white/80">
                          {getThreadEmoji(thread.board)}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <span className="text-white text-sm font-medium">{thread.board}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {thread.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {thread.preview}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>💬 {thread.responseCount}</span>
                          <span>🔥 {formatMomentum(thread.momentum)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { emoji: '🎮', title: 'ゲーム', count: 234 },
              { emoji: '🎬', title: 'アニメ', count: 189 },
              { emoji: '📰', title: 'ニュース', count: 456 },
              { emoji: '💬', title: 'VIP', count: 678 },
            ].map((category) => (
              <Link
                key={category.title}
                href={`/board/${category.title}`}
                className="group p-6 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-4xl mb-2">{category.emoji}</div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">
                  {category.title}
                </div>
                <div className="text-sm text-gray-500">{category.count} スレッド</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}