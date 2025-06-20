'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RSSResponse } from '@/types/rss';

export const useRSSFeeds = () => {
  return useQuery<RSSResponse>({
    queryKey: ['rss-feeds'],
    queryFn: async () => {
      const response = await axios.get('/api/rss');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    refetchInterval: 10 * 60 * 1000, // 10分ごとに自動更新
  });
};