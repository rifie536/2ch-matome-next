import { Thread, Board, SearchFilters, ThreadResponse } from '@/types/thread';
import axios from 'axios';

// Mock API endpoints - replace with actual 2ch API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Mock data generator for demonstration
const generateMockThread = (id: string, index: number): Thread => {
  const boards = ['VIP', 'なんJ', 'ニュー速', '嫌儲', 'アニメ', 'ゲーム'];
  const types: ('featured' | 'large' | 'normal')[] = ['featured', 'large', 'normal'];
  
  return {
    id,
    title: `【話題】サンプルスレッドタイトル ${index + 1}`,
    board: boards[Math.floor(Math.random() * boards.length)],
    boardId: 'board-' + Math.floor(Math.random() * 10),
    preview: 'これはサンプルのプレビューテキストです。実際のAPIではここに本文の一部が表示されます。',
    responseCount: Math.floor(Math.random() * 500) + 50,
    momentum: Math.floor(Math.random() * 2000) + 100,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    type: index === 0 ? 'featured' : index % 5 === 0 ? 'large' : 'normal',
    tags: ['話題', 'ニュース'],
  };
};

export const api = {
  // Fetch threads with pagination
  async getThreads(page = 1, limit = 20, filters?: SearchFilters): Promise<{ threads: Thread[]; total: number }> {
    try {
      // Mock implementation - replace with actual API call
      const threads = Array.from({ length: limit }, (_, i) => 
        generateMockThread(`thread-${page}-${i}`, (page - 1) * limit + i)
      );
      
      return {
        threads,
        total: 100,
      };
    } catch (error) {
      console.error('Error fetching threads:', error);
      throw error;
    }
  },

  // Fetch single thread with responses
  async getThread(threadId: string): Promise<{ thread: Thread; responses: ThreadResponse[] }> {
    try {
      // Mock implementation
      const thread = generateMockThread(threadId, 0);
      const responses: ThreadResponse[] = Array.from({ length: 50 }, (_, i) => ({
        id: `response-${i}`,
        number: i + 1,
        name: i % 3 === 0 ? '名無しさん' : `Anonymous${i}`,
        date: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        content: `これはレスポンス${i + 1}の内容です。`,
        replies: i > 5 ? [`${Math.floor(Math.random() * i)}`] : undefined,
      }));
      
      return { thread, responses };
    } catch (error) {
      console.error('Error fetching thread:', error);
      throw error;
    }
  },

  // Search threads
  async searchThreads(query: string, filters?: SearchFilters): Promise<Thread[]> {
    try {
      // Mock implementation
      const threads = Array.from({ length: 10 }, (_, i) => 
        generateMockThread(`search-${i}`, i)
      );
      
      return threads;
    } catch (error) {
      console.error('Error searching threads:', error);
      throw error;
    }
  },

  // Get trending threads
  async getTrendingThreads(limit = 10): Promise<Thread[]> {
    try {
      const threads = Array.from({ length: limit }, (_, i) => {
        const thread = generateMockThread(`trending-${i}`, i);
        thread.momentum = Math.floor(Math.random() * 5000) + 1000;
        return thread;
      });
      
      return threads.sort((a, b) => b.momentum - a.momentum);
    } catch (error) {
      console.error('Error fetching trending threads:', error);
      throw error;
    }
  },

  // Get boards list
  async getBoards(): Promise<Board[]> {
    try {
      const boards: Board[] = [
        { id: 'vip', name: 'VIP', category: '雑談', threadCount: 128, momentum: 5420 },
        { id: 'livejupiter', name: 'なんでも実況J', category: '実況', threadCount: 156, momentum: 8930 },
        { id: 'news', name: 'ニュース速報', category: 'ニュース', threadCount: 89, momentum: 3210 },
        { id: 'poverty', name: '嫌儲', category: 'ニュース', threadCount: 78, momentum: 2890 },
      ];
      
      return boards;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  },
};