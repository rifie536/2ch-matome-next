'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Thread } from '@/types/thread';
import { formatTimeAgo, getThreadEmoji } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedCarouselProps {
  threads: Thread[];
}

export function FeaturedCarousel({ threads }: FeaturedCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const featuredThreads = threads.slice(0, 5);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrev = () => {
    setCurrentPage((prev) => (prev - 1 + 5) % 5);
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % 5);
  };

  // ページ1-3: ニュース記事スタイル
  if (currentPage < 3 && featuredThreads[currentPage]) {
    const thread = featuredThreads[currentPage];
    return (
      <div className="col-span-3 row-span-2 relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden"
          >
            {/* Image with overlay */}
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-8xl text-white/50">
                {getThreadEmoji(thread.board)}
              </div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {thread.board}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-white mb-2 line-clamp-2">
                  {thread.title}
                </h3>
                <p className="text-sm text-gray-200 line-clamp-2 mb-3">{thread.preview}</p>
                <div className="flex items-center gap-4 text-xs text-gray-300">
                  <span>💬 {thread.responseCount}</span>
                  <span>{formatTimeAgo(new Date(thread.updatedAt))}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Page indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {[0, 1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === page ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ページ4: シューフーズスタイル（食べ物・料理）
  if (currentPage === 3) {
    return (
      <div className="col-span-3 row-span-2 relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden"
          >
            <div className="relative h-full p-6 flex flex-col">
              {/* Background food image */}
              <div className="absolute inset-0 opacity-10">
                <div className="text-[200px] text-orange-400 flex items-center justify-center">
                  🍽️
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs rounded-full">
                    シューフーズ
                  </span>
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-3">
                  りんごは食べ方で美味しさが変わる！「皮付きで食べる」メリットとは？
                </h3>
                <div className="flex items-center gap-6 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👍</span>
                    <span className="text-sm text-gray-600">77</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👎</span>
                    <span className="text-sm text-gray-600">3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <span className="text-sm text-gray-600">1</span>
                  </div>
                </div>
              </div>

              {/* Fruit decoration */}
              <div className="absolute bottom-4 right-4 text-6xl opacity-50">
                🍎
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Page indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {[0, 1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === page ? 'bg-gray-800 w-8' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ページ5: HoYoverse広告スタイル
  if (currentPage === 4) {
    return (
      <div className="col-span-3 row-span-2 relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative h-full overflow-hidden rounded-lg"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500" />
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="animate-pulse text-white/10 text-[300px] -rotate-12 -translate-x-1/2 -translate-y-1/2">
                  ⭐
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
              <div>
                <div className="text-xs opacity-80 mb-2">Green</div>
                <h2 className="text-3xl font-bold mb-2">HoYoverse</h2>
              </div>

              {/* Character illustration placeholder */}
              <div className="absolute right-0 bottom-0 text-[150px] opacity-30">
                🎮
              </div>

              <div>
                <div className="text-sm opacity-80 mb-2">スポンサー</div>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <span>詳細を見る</span>
                  <span className="text-xl">▶️</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation - z-indexを高くして確実にクリック可能にする */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Page indicators - 5ページ目も同じ位置に配置 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {[0, 1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === page ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}