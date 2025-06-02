'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SearchFilters } from '@/types/thread';

export function useThreads(filters?: SearchFilters) {
  return useInfiniteQuery({
    queryKey: ['threads', filters],
    queryFn: ({ pageParam = 1 }) => api.getThreads(pageParam, 20, filters),
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.total / 20);
      const nextPage = pages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}

export function useThread(threadId: string) {
  return useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => api.getThread(threadId),
    enabled: !!threadId,
  });
}

export function useTrendingThreads(limit = 10) {
  return useQuery({
    queryKey: ['trending-threads', limit],
    queryFn: () => api.getTrendingThreads(limit),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => api.getBoards(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}