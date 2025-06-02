'use client';

import { useThreads } from '@/hooks/useThreads';
import { ThreadCard } from '@/components/ThreadCard';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function ThreadsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useThreads();
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allThreads = data?.pages.flatMap((page) => page.threads) ?? [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Thread Grid */}
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {allThreads.map((thread, index) => (
                      <ThreadCard key={thread.id} thread={thread} index={index} />
                    ))}
                  </div>

                  {/* Load More Trigger */}
                  <div ref={loadMoreRef} className="mt-8 flex justify-center">
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>新しいスレッドを読み込み中...</span>
                      </div>
                    )}
                    {!hasNextPage && allThreads.length > 0 && (
                      <p className="text-gray-500">すべてのスレッドを読み込みました</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}