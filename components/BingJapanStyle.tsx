'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Grid3X3, Loader2 } from 'lucide-react';
import { getThreadEmoji, formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRSSFeeds } from '@/hooks/useRSSFeeds';
import { RSSCarousel } from './RSSCarousel';

export function BingJapanStyle() {
  const [searchQuery, setSearchQuery] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(0);
  const { data: rssData, isLoading } = useRSSFeeds();

  // 美しい風景画像のリスト（Unsplashから）
  const backgroundImages = [
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop', // 富士山
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop', // 京都の寺
    'https://images.unsplash.com/photo-1503640538573-148065ba4904?w=1920&h=1080&fit=crop', // 東京の夜景
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop', // 桜
    'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1920&h=1080&fit=crop', // 紅葉
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // RSSフィードのアイテムをスレッド形式に変換
  const rssThreads = rssData?.allItems.map((item, index) => ({
    id: item.id,
    title: item.title,
    board: item.source,
    preview: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
    responseCount: 0,
    momentum: 0,
    createdAt: item.pubDate,
    updatedAt: item.pubDate,
    link: item.link,
    thumbnail: item.thumbnail,
    isExternal: true,
    categories: item.categories,
  })) || [];

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
              {rssThreads.slice(0, 10).map((thread) => (
                <a
                  key={thread.id}
                  href={thread.isExternal ? thread.link : `/thread/${thread.id}`}
                  target={thread.isExternal ? "_blank" : undefined}
                  rel={thread.isExternal ? "noopener noreferrer" : undefined}
                  className="flex-none group"
                >
                  <div className="w-40 h-24 bg-white rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition-all hover:scale-105">
                    {thread.thumbnail ? (
                      <img 
                        src={thread.thumbnail} 
                        alt={thread.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl text-white">
                        {getThreadEmoji(thread.board)}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                      <p className="text-white text-sm font-medium line-clamp-2">{thread.title}</p>
                      {thread.isExternal && (
                        <span className="text-white/70 text-xs">{thread.board}</span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Main News Area */}
            <div>
              {/* RSS threads in larger card format - 4 per row */}
              {rssThreads.length > 0 && (
                <div className="rounded-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.7)', width: '1260px', margin: '0 auto'}}>
                  <h3 className="text-lg font-bold text-gray-900 pt-3 px-3">最新記事</h3>
                  <div className="py-2 px-12">
                    <div className="grid gap-3" style={{gridTemplateColumns: '300px 300px 300px 300px', justifyContent: 'center'}}>
                    {/* カルーセル - 最初の位置（2列分） */}
                    <div style={{gridColumn: 'span 2', height: '300px'}}>
                      <RSSCarousel threads={rssThreads.slice(0, 5)} />
                    </div>
                    
                    {/* 通常のカード */}
                    {rssThreads.slice(5).map((thread, index) => {
                      // 4列レイアウトでの2列分のカードのパターン
                      // 3番目と10番目のカードを2列分に
                      const isWideCard = index === 2 || index === 9;
                      
                      return (
                        <motion.div
                          key={thread.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (index + 1) * 0.05 }}
                          style={{gridColumn: isWideCard ? 'span 2' : 'span 1'}}
                        >
                          {isWideCard ? (
                            // 2列分のカード - 画像で満たす
                            <a
                              href={thread.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block relative rounded-lg shadow-sm hover:shadow-lg transition-all group hover:scale-[1.02] overflow-hidden"
                              style={{height: '300px'}}
                            >
                              {thread.thumbnail ? (
                                <img 
                                  src={thread.thumbnail} 
                                  alt={thread.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500" />
                              )}
                              {/* オーバーレイ */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                              
                              {/* コンテンツ */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="mb-2">
                                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                    {thread.board}
                                  </span>
                                </div>
                                <h4 className="font-bold line-clamp-3 mb-3" style={{fontSize: '20px'}}>
                                  {thread.title}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                  {thread.categories && thread.categories.length > 0 && (
                                    <span className="font-bold">{thread.categories[0]}</span>
                                  )}
                                  <span className="font-bold">{formatTimeAgo(new Date(thread.updatedAt))}</span>
                                </div>
                              </div>
                            </a>
                          ) : (
                            // 通常のカード
                            <a
                              href={thread.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-white/95 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-all group hover:scale-[1.02] overflow-hidden"
                              style={{height: '300px'}}
                            >
                              <div className="flex flex-col h-full">
                                {thread.thumbnail ? (
                                  <div className="h-1/2 overflow-hidden">
                                    <img 
                                      src={thread.thumbnail} 
                                      alt={thread.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-1/2 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-4xl text-white">
                                    {getThreadEmoji(thread.board)}
                                  </div>
                                )}
                                <div className="flex-1 flex flex-col justify-between p-4">
                                  <h4 className="font-bold group-hover:text-blue-600 line-clamp-3" style={{fontSize: '20px'}}>
                                    {thread.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{thread.board}</span>
                                    {thread.categories && thread.categories.length > 0 && (
                                      <span className="font-bold">{thread.categories[0]}</span>
                                    )}
                                    <span className="font-bold">{formatTimeAgo(new Date(thread.updatedAt))}</span>
                                  </div>
                                </div>
                              </div>
                            </a>
                          )}
                        </motion.div>
                      );
                    })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}