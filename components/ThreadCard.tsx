'use client';

import { Thread } from '@/types/thread';
import { formatMomentum, formatTimeAgo, cn, getThreadEmoji } from '@/lib/utils';
import { MessageCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ThreadCardProps {
  thread: Thread;
  index?: number;
}

export function ThreadCard({ thread, index = 0 }: ThreadCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 transition-all duration-300 hover:shadow-2xl hover:border-blue-500',
        thread.type === 'featured' && 'lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800',
        thread.type === 'large' && 'lg:row-span-2'
      )}
    >
      <Link href={`/thread/${thread.id}`} className="block">
        {/* Thread Image/Emoji */}
        <div
          className={cn(
            'flex items-center justify-center text-4xl bg-gradient-to-br from-gray-700 to-gray-900',
            thread.type === 'featured' && 'h-48 text-5xl',
            thread.type === 'large' && 'h-40',
            thread.type === 'normal' && 'h-32'
          )}
        >
          {thread.thumbnail ? (
            <img src={thread.thumbnail} alt={thread.title} className="w-full h-full object-cover" />
          ) : (
            <span className="animate-pulse">{getThreadEmoji(thread.board)}</span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
              {thread.board}
            </span>
            {thread.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs text-gray-400 bg-gray-700 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h3
            className={cn(
              'font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors',
              thread.type === 'featured' && 'text-xl lg:text-2xl',
              thread.type === 'large' && 'text-lg',
              thread.type === 'normal' && 'text-base'
            )}
          >
            {thread.title}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{thread.preview}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {thread.responseCount}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {formatMomentum(thread.momentum)}
              </span>
            </div>
            <span className="text-gray-600 text-xs">
              {formatTimeAgo(new Date(thread.updatedAt))}
            </span>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Link>
    </motion.div>
  );
}