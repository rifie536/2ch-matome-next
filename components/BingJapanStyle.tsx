'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Menu, Grid3X3, Sun, Moon, MapPin, Loader2 } from 'lucide-react';
import { useThreads, useTrendingThreads } from '@/hooks/useThreads';
import { formatMomentum, getThreadEmoji, formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FeaturedCarousel } from './FeaturedCarousel';

export function BingJapanStyle() {
  const [searchQuery, setSearchQuery] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(0);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useThreads();
  const { data: trendingThreads } = useTrendingThreads(15);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, {
    margin: '100px', // 100px手前で検出開始
  });

  // 美しい風景画像のリスト（Unsplashから）
  const backgroundImages = [
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop', // 富士山
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop', // 京都の寺
    'https://images.unsplash.com/photo-1503640538573-148065ba4904?w=1920&h=1080&fit=crop', // 東京の夜景
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop', // 桜
    'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1920&h=1080&fit=crop', // 紅葉
  ];
  
  const allThreads = data?.pages.flatMap((page) => page.threads) ?? [];

  useEffect(() => {
    console.log('Scroll detection:', { isInView, hasNextPage, isFetchingNextPage });
    if (isInView && hasNextPage && !isFetchingNextPage) {
      console.log('Fetching next page...');
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // カルーセルのスレッド
  const carouselThreads = trendingThreads?.slice(0, 8) || [];
  
  // トレンディングから最初の12個をグリッド用に使用
  const gridThreads = trendingThreads?.slice(0, 12) || [];
  // すべてのスレッドを通常のリスト表示用に使用
  const listThreads = allThreads;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 背景画像 - Bingスタイル */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImages[backgroundImage]}')`,
          }}
        >
          {/* オーバーレイで少し暗くして読みやすくする */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
      </div>

      {/* 背景画像切り替えボタン */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setBackgroundImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              backgroundImage === index 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-white">2chまとめ+</span>
                </Link>
                <nav className="hidden md:flex items-center gap-5">
                  <Link href="/threads" className="text-sm text-white/80 hover:text-white transition-colors">画像</Link>
                  <Link href="/trending" className="text-sm text-white/80 hover:text-white transition-colors">動画</Link>
                  <Link href="/maps" className="text-sm text-white/80 hover:text-white transition-colors">地図</Link>
                  <Link href="/news" className="text-sm text-white/80 hover:text-white transition-colors">ニュース</Link>
                </nav>
              </div>
              
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="relative hidden md:block">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="検索"
                    className="w-80 px-4 py-1.5 pr-10 bg-white/95 backdrop-blur-sm border border-white/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all text-gray-900 placeholder-gray-600"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
                
                <button className="p-2 hover:bg-white/20 rounded-md transition-colors">
                  <Grid3X3 className="w-5 h-5 text-white" />
                </button>
                
                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full border border-white/50"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Top Carousel */}
        <div className="bg-black/10 backdrop-blur-sm border-b border-white/10 py-3">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {carouselThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/thread/${thread.id}`}
                  className="flex-none group"
                >
                  <div className="w-40 h-24 bg-white rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition-all hover:scale-105">
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
              {/* Grid Layout for first 12 items */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {/* Featured Carousel */}
                <FeaturedCarousel threads={gridThreads} />

                {/* Medium Cards */}
                {gridThreads.slice(1, 5).map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="col-span-1 group"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all h-40 overflow-hidden hover:scale-105">
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
                {gridThreads.slice(5, 7).map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="col-span-2 group"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden hover:scale-105">
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
                {gridThreads.slice(7, 12).map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="col-span-1 group"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all h-32 p-3 hover:scale-105">
                      <h4 className="text-sm font-medium group-hover:text-blue-600 line-clamp-3 mb-2">
                        {thread.title}
                      </h4>
                      <p className="text-xs text-gray-500">{thread.board}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Additional threads in list format */}
              {listThreads.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">最新スレッド</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {listThreads.map((thread, index) => (
                      <motion.div
                        key={thread.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/thread/${thread.id}`}
                          className="block bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all p-4 group hover:scale-[1.02]"
                        >
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-2xl text-white flex-shrink-0">
                              {getThreadEmoji(thread.board)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium group-hover:text-blue-600 line-clamp-1 mb-1">
                                {thread.title}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{thread.preview}</p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{thread.board}</span>
                                <span>💬 {thread.responseCount}</span>
                                <span>{formatTimeAgo(new Date(thread.updatedAt))}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Trigger */}
              <div ref={loadMoreRef} className="mt-8 p-8 flex justify-center bg-white/50 backdrop-blur-sm rounded-lg">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>新しいスレッドを読み込み中...</span>
                  </div>
                ) : hasNextPage ? (
                  <p className="text-gray-500">スクロールして更に読み込む</p>
                ) : (
                  allThreads.length > 0 && <p className="text-gray-500">すべてのスレッドを読み込みました</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="lg:sticky lg:top-20">
                {/* Top Stories */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-4">
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
                        <div className="flex gap-3 p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{index + 1}</span>
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
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 mb-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">東京</span>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">22°</div>
                      <div className="text-sm opacity-90">晴れ</div>
                    </div>
                    <div className="text-5xl">☀️</div>
                  </div>
                  <div className="grid grid-cols-5 gap-1 mt-4 text-center">
                    {['今日', '明日', '木曜', '金曜', '土曜'].map((day, i) => (
                      <div key={day} className="text-xs">
                        <div className="opacity-70">{day}</div>
                        <div className="text-lg my-1">☁️</div>
                        <div>{20 + i}°</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Widget */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">市況情報</h3>
                  <div className="space-y-3">
                    {[
                      { name: '日経平均', value: '32,850', change: '+2.40%', up: true },
                      { name: 'TOPIX', value: '2,245', change: '-0.32%', up: false },
                      { name: 'ドル円', value: '151.25', change: '+0.85%', up: true },
                    ].map((stock) => (
                      <div key={stock.name} className="flex items-center justify-between p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}