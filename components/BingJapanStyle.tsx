'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Grid3X3, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getThreadEmoji, formatTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRSSFeeds } from '@/hooks/useRSSFeeds';
import { RSSCarousel } from './RSSCarousel';

export function BingJapanStyle() {
  const [searchQuery, setSearchQuery] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(0);
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useRSSFeeds();
  
  // 上部カルーセル用のスクロールコンテナ参照
  const topCarouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // 美しい風景画像のリスト（Unsplashから）
  const backgroundImages = [
    'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&h=1080&fit=crop', // 富士山
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop', // 京都の寺
    'https://images.unsplash.com/photo-1503640538573-148065ba4904?w=1920&h=1080&fit=crop', // 東京の夜景
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop', // 桜
    'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=1920&h=1080&fit=crop', // 紅葉
  ];

  // 無限スクロール用のObserver
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  // カルーセルのスクロール制御（5枚ずつスクロール）
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (topCarouselRef.current) {
      const container = topCarouselRef.current;
      const cardWidth = 186; // 1枚のカード幅
      const gap = 12; // カード間のギャップ (gap-3 = 0.75rem = 12px)
      const scrollUnit = (cardWidth + gap) * 5; // 5枚分のスクロール単位
      
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      let targetScroll: number;
      
      if (direction === 'left') {
        targetScroll = Math.max(0, currentScroll - scrollUnit);
      } else {
        targetScroll = Math.min(maxScroll, currentScroll + scrollUnit);
      }
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };
  
  // ボタンの表示状態
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // スクロール位置をチェックしてボタンの表示/非表示を制御
  const checkScrollButtons = useCallback(() => {
    if (topCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = topCarouselRef.current;
      setCanScrollLeft(scrollLeft > 5); // 少しの余裕を持たせる
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);
  
  // スクロールイベントの監視
  useEffect(() => {
    const container = topCarouselRef.current;
    if (container && data && data.pages && data.pages.length > 0) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // 初回チェック
      
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [data, checkScrollButtons]);
  
  // キーボード操作の処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合は無視
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // 矢印キーの処理
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollCarousel('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollCarousel('right');
      }
    };
    
    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 全ページのデータを統合
  const allItems = data?.pages?.flatMap(page => page?.allItems || []) || [];

  // RSSフィードのアイテムをスレッド形式に変換
  const rssThreads = allItems.map((item, index) => ({
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
  }));

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
          <div className="container mx-auto px-4 relative group">
            {/* スクリーンリーダー用の操作説明 */}
            <span id="carousel-instructions" className="sr-only">
              矢印キーでカルーセルを操作できます。左矢印で前へ、右矢印で次へ移動します。
            </span>
            {/* 左スクロールボタン */}
            {canScrollLeft && (
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all shadow-lg"
                aria-label="前へ"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            {/* カルーセルコンテナ */}
            <div className="overflow-hidden relative" style={{width: '1260px', margin: '0 auto'}}>
              {/* 右端のマスクエフェクト - ページプレビューを自然に見せる */}
              <div className="absolute top-0 right-0 w-16 h-full z-10 pointer-events-none">
                {/* より自然なフェードアウト効果 */}
                <div className="w-full h-full bg-gradient-to-l from-black/30 via-black/15 to-transparent"></div>
              </div>
              
              {/* 左端のマスクエフェクト（スクロール時） */}
              <div className="absolute top-0 left-0 w-16 h-full z-10 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-black/30 via-black/15 to-transparent"></div>
              </div>
              
              <div 
                ref={topCarouselRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide"
                style={{
                  // 1260px幅に収まる最大枚数を計算
                  // カード幅: 186px, ギャップ: 12px
                  // 1260px ÷ (186 + 12) ≈ 6.36枚
                  // 6枚 + 約0.36枚のプレビュー
                  width: '1260px',
                  maxWidth: '100%'
                }}
                onTouchStart={(e) => {
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (touchStartX.current !== null) {
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = touchStartX.current - touchEndX;
                    
                    // スワイプの閾値（50px以上で反応）
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) {
                        // 左にスワイプ = 右にスクロール
                        scrollCarousel('right');
                      } else {
                        // 右にスワイプ = 左にスクロール
                        scrollCarousel('left');
                      }
                    }
                    touchStartX.current = null;
                  }
                }}
              >
              {/* 25個の要素を表示 */}
              {rssThreads.slice(0, 25).map((thread) => (
                <a
                  key={thread.id}
                  href={thread.isExternal ? thread.link : `/thread/${thread.id}`}
                  target={thread.isExternal ? "_blank" : undefined}
                  rel={thread.isExternal ? "noopener noreferrer" : undefined}
                  className="flex-none group"
                >
                  <div className="bg-white rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition-all hover:scale-105" style={{width: '186px', height: '136px'}}>
                    <div className="absolute top-0 left-0 right-0 px-3 py-2" style={{backgroundColor: '#222222', height: '48px'}}>
                      <p className="text-white text-xs font-medium line-clamp-2">{thread.title}</p>
                    </div>
                    <div style={{marginTop: '48px', height: '88px', overflow: 'hidden'}}>
                      {thread.thumbnail ? (
                        <img 
                          src={thread.thumbnail} 
                          alt={thread.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl text-white">
                          {getThreadEmoji(thread.board)}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
              </div>
            </div>
            
            {/* 右スクロールボタン */}
            {canScrollRight && (
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all shadow-lg"
                aria-label="次へ"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
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
                      const isLastItem = index === rssThreads.slice(5).length - 1;
                      
                      // 複雑なレイアウトパターンを計算
                      const getLayoutPattern = (cardIndex: number) => {
                        // 最初のカードの行と位置を計算
                        // 1行目はカルーセル(2列) + カード2個なので、特別処理
                        if (cardIndex < 2) {
                          return 1; // 1行目の残り2つは1列
                        }
                        
                        // 2行目以降の計算
                        const adjustedIndex = cardIndex - 2; // 1行目の2個を引く
                        
                        // 各行のパターン定義（2行目から）
                        const rowPatterns = [
                          [1, 1, 2],    // 2行目: 1列×2 + 2列×1
                          [2, 1, 1],    // 3行目: 2列×1 + 1列×2
                          [1, 1, 1, 1], // 4行目: 1列×4
                          [2, 1, 1],    // 5行目: 2列×1 + 1列×2
                          [1, 1, 2],    // 6行目: 1列×2 + 2列×1
                          [1, 1, 1, 1], // 7行目: 1列×4
                          [1, 1, 1, 1], // 8行目: 1列×4
                          [2, 1, 1],    // 9行目: 2列×1 + 1列×2
                        ];
                        
                        // 10行目以降の繰り返しパターン
                        const repeatPatterns = [
                          [1, 1, 1, 1], // パターン1: 1列×4
                          [1, 1, 2],    // パターン2: 1列×2 + 2列×1
                          [2, 1, 1]     // パターン3: 2列×1 + 1列×2
                        ];
                        
                        // 現在の行を特定
                        let currentCardCount = 0;
                        let currentRow = 0;
                        
                        // 2-9行目をチェック
                        for (let i = 0; i < rowPatterns.length; i++) {
                          const pattern = rowPatterns[i];
                          const cardsInRow = pattern.filter(col => col === 2).length + pattern.filter(col => col === 1).length;
                          
                          if (adjustedIndex < currentCardCount + cardsInRow) {
                            // この行にカードがある
                            const cardPositionInRow = adjustedIndex - currentCardCount;
                            let colCount = 0;
                            
                            for (let j = 0; j < pattern.length; j++) {
                              if (colCount === cardPositionInRow) {
                                return pattern[j];
                              }
                              colCount += (pattern[j] === 2 ? 1 : 1);
                            }
                          }
                          currentCardCount += cardsInRow;
                          currentRow++;
                        }
                        
                        // 10行目以降の繰り返しパターン
                        const remainingCards = adjustedIndex - currentCardCount;
                        let repeatCardCount = 0;
                        let repeatRowIndex = 0;
                        
                        while (true) {
                          const pattern = repeatPatterns[repeatRowIndex % repeatPatterns.length];
                          const cardsInRow = pattern.filter(col => col === 2).length + pattern.filter(col => col === 1).length;
                          
                          if (remainingCards < repeatCardCount + cardsInRow) {
                            const cardPositionInRow = remainingCards - repeatCardCount;
                            let colCount = 0;
                            
                            for (let j = 0; j < pattern.length; j++) {
                              if (colCount === cardPositionInRow) {
                                return pattern[j];
                              }
                              colCount += (pattern[j] === 2 ? 1 : 1);
                            }
                          }
                          repeatCardCount += cardsInRow;
                          repeatRowIndex++;
                        }
                      };
                      
                      const colSpan = getLayoutPattern(index);
                      const isWideCard = colSpan === 2;
                      
                      return (
                        <div
                          key={thread.id}
                          ref={isLastItem ? lastElementRef : null}
                          style={{gridColumn: `span ${colSpan}`}}
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
                                  loading="lazy"
                                  decoding="async"
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
                                      loading="lazy"
                                      decoding="async"
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
                        </div>
                      );
                    })}
                    </div>
                  </div>
                  
                  {/* 無限スクロール用のローディング表示 */}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-8">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>記事を読み込み中...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}