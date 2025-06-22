'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatTimeAgo, getThreadEmoji } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RSSThread {
  id: string;
  title: string;
  board: string;
  preview: string;
  updatedAt: string;
  link: string;
  thumbnail?: string;
}

interface RSSCarouselProps {
  threads: RSSThread[];
}

export function RSSCarousel({ threads }: RSSCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const featuredThreads = threads.slice(0, 5);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrev = () => {
    setCurrentPage((prev) => (prev - 1 + featuredThreads.length) % featuredThreads.length);
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % featuredThreads.length);
  };

  if (!featuredThreads[currentPage]) return null;

  const thread = featuredThreads[currentPage];

  return (
    <div className="relative group h-full">
      <AnimatePresence mode="wait">
        <motion.a
          key={currentPage}
          href={thread.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden"
        >
          {/* Image with overlay */}
          <div className="relative h-full">
            {thread.thumbnail ? (
              <img 
                src={thread.thumbnail} 
                alt={thread.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-8xl text-white/50">
                {getThreadEmoji(thread.board)}
              </div>
            )}
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {thread.board}
                </span>
              </div>
              <h3 className="font-bold text-white mb-3 line-clamp-3" style={{fontSize: '20px'}}>
                {thread.title}
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-300">
                <span className="font-bold">{formatTimeAgo(new Date(thread.updatedAt))}</span>
              </div>
            </div>
          </div>
        </motion.a>
      </AnimatePresence>

      {/* Navigation */}
      <button
        onClick={(e) => {
          e.preventDefault();
          goToPrev();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          goToNext();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {featuredThreads.map((_, page) => (
          <button
            key={page}
            onClick={(e) => {
              e.preventDefault();
              goToPage(page);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === page ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}