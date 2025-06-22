'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RSSResponse } from '@/types/rss';

export const useRSSFeeds = () => {
  return useInfiniteQuery<RSSResponse>({
    queryKey: ['rss-feeds'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axios.get(`/api/rss?page=${pageParam}&limit=50`);
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // まだデータがある場合は次のページを返す
      if (lastPage.allItems.length === 50) {
        return allPages.length;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    gcTime: 15 * 60 * 1000, // 15分間メモリに保持（新しいAPI名）
    refetchInterval: false, // 自動更新を無効化（パフォーマンス向上）
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得を無効化
  });
};