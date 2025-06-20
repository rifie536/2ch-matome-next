'use client';

import React from 'react';
import { useRSSFeeds } from '@/hooks/useRSSFeeds';
import { Loader2, ExternalLink, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { formatTimeAgo } from '@/lib/utils';

export function RSSFeedSection() {
  const { data, isLoading, error } = useRSSFeeds();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-white/60">
        <p>RSSフィードの取得に失敗しました</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          外部まとめサイト最新記事
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.allItems.slice(0, 20).map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] group"
            >
              <div className="flex flex-col h-full">
                {/* サムネイル画像 */}
                {item.thumbnail && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded shrink-0">
                      {item.source}
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 shrink-0" />
                  </div>
                  
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 text-sm">
                    {item.title}
                  </h3>
                  
                  {!item.thumbnail && item.description && (
                    <p 
                      className="text-xs text-gray-600 line-clamp-3 mb-3 flex-1"
                      dangerouslySetInnerHTML={{ 
                        __html: item.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
                      }}
                    />
                  )}
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(new Date(item.pubDate))}
                    </span>
                    {item.categories.length > 0 && (
                      <span>{item.categories[0]}</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}