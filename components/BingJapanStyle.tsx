'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, Grid3X3, Sun, Moon, MapPin } from 'lucide-react';
import { useThreads, useTrendingThreads } from '@/hooks/useThreads';
import { formatMomentum, getThreadEmoji, formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function BingJapanStyle() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data } = useThreads();
  const { data: trendingThreads } = useTrendingThreads(15);
  
  const allThreads = data?.pages.flatMap((page) => page.threads) ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // カルーセルのスレッド
  const carouselThreads = trendingThreads?.slice(0, 8) || [];
  
  // メインニュースエリアのスレッド
  const mainThreads = allThreads.slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-gray-900">2chまとめ+</span>
              </Link>
              <nav className="hidden md:flex items-center gap-5">
                <Link href="/threads" className="text-sm text-gray-600 hover:text-gray-900">画像</Link>
                <Link href="/trending" className="text-sm text-gray-600 hover:text-gray-900">動画</Link>
                <Link href="/maps" className="text-sm text-gray-600 hover:text-gray-900">地図</Link>
                <Link href="/news" className="text-sm text-gray-600 hover:text-gray-900">ニュース</Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="検索"
                  className="w-80 px-4 py-1.5 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Grid3X3 className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Top Carousel */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {carouselThreads.map((thread) => (
              <Link
                key={thread.id}
                href={`/thread/${thread.id}`}
                className="flex-none group"
              >
                <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl text-white">
                    {getThreadEmoji(thread.board)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-white text-xs line-clamp-2">{thread.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main News Area */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-4 gap-3">
              {/* Featured Large Card */}
              {mainThreads[0] && (
                <Link
                  href={`/thread/${mainThreads[0].id}`}
                  className="col-span-2 row-span-2 group"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-6xl text-white">
                      {getThreadEmoji(mainThreads[0].board)}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 line-clamp-2">
                        {mainThreads[0].title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{mainThreads[0].preview}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                        <span>{mainThreads[0].board}</span>
                        <span>💬 {mainThreads[0].responseCount}</span>
                        <span>{formatTimeAgo(new Date(mainThreads[0].updatedAt))}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Medium Cards */}
              {mainThreads.slice(1, 5).map((thread) => (
                <Link
                  key={thread.id}
                  href={`/thread/${thread.id}`}
                  className="col-span-1 group"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-40 overflow-hidden">
                    <div className="h-20 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-3xl text-white">
                      {getThreadEmoji(thread.board)}
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium group-hover:text-blue-600 line-clamp-2">
                        {thread.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{thread.board}</p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Bottom Large Cards */}
              {mainThreads.slice(5, 7).map((thread) => (
                <Link
                  key={thread.id}
                  href={`/thread/${thread.id}`}
                  className="col-span-2 group"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-5xl text-white">
                      {getThreadEmoji(thread.board)}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1 group-hover:text-blue-600 line-clamp-2">
                        {thread.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{thread.preview}</p>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Small Cards Grid */}
              {mainThreads.slice(7, 12).map((thread) => (
                <Link
                  key={thread.id}
                  href={`/thread/${thread.id}`}
                  className="col-span-1 group"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-32 p-3">
                    <h4 className="text-sm font-medium group-hover:text-blue-600 line-clamp-3 mb-2">
                      {thread.title}
                    </h4>
                    <p className="text-xs text-gray-500">{thread.board}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {/* Top Stories */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-red-500">🔥</span>
                トップストーリー
              </h3>
              <div className="space-y-3">
                {trendingThreads?.slice(0, 5).map((thread, index) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <span className="text-2xl font-bold text-gray-400">{index + 1}</span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium group-hover:text-blue-600 line-clamp-2">
                          {thread.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {thread.board} • {formatMomentum(thread.momentum)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-blue-500 text-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">銚子市</span>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">16°</div>
                  <div className="text-sm opacity-90">大雨注意報</div>
                </div>
                <div className="text-5xl">🌧️</div>
              </div>
              <div className="grid grid-cols-5 gap-1 mt-4 text-center">
                {['今日', '明日', '木曜', '金曜', '土曜'].map((day, i) => (
                  <div key={day} className="text-xs">
                    <div className="opacity-70">{day}</div>
                    <div className="text-lg my-1">☁️</div>
                    <div>{15 + i}°</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Widget */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3">ウォッチリストの銘柄</h3>
              <div className="space-y-3">
                {[
                  { name: 'トヨタ自動車', value: '2,850.0', change: '+2.40%', up: true },
                  { name: 'NTT', value: '163.7', change: '-1.09%', up: false },
                  { name: '三菱商事', value: '2,867.5', change: '+1.68%', up: true },
                ].map((stock) => (
                  <div key={stock.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stock.name}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{stock.value}</div>
                      <div className={`text-xs ${stock.up ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sports Results */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3">メジャーリーグベースボール</h3>
              <div className="space-y-3">
                {[
                  { team1: 'ヤンキース', score1: '7', team2: 'レッドソックス', score2: '3', final: true },
                  { team1: 'ジャイアンツ', score1: '4', team2: 'ドジャース', score2: '6', final: true },
                  { team1: 'アストロズ', score1: '1', team2: 'レンジャーズ', score2: '3', final: false },
                ].map((game, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{game.team1}</span>
                      <span className="font-bold">{game.score1}</span>
                    </div>
                    <span className="text-xs text-gray-500">{game.final ? '試合終了' : '5回裏'}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{game.score2}</span>
                      <span>{game.team2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}