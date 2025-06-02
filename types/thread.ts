export interface Thread {
  id: string;
  title: string;
  board: string;
  boardId: string;
  preview: string;
  responseCount: number;
  momentum: number;
  createdAt: Date;
  updatedAt: Date;
  type?: 'featured' | 'large' | 'normal';
  thumbnail?: string;
  tags?: string[];
}

export interface ThreadResponse {
  id: string;
  number: number;
  name: string;
  email?: string;
  date: Date;
  content: string;
  replies?: string[];
  imageUrl?: string;
}

export interface Board {
  id: string;
  name: string;
  category: string;
  threadCount: number;
  momentum: number;
}

export interface SearchFilters {
  query?: string;
  board?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minResponses?: number;
  sortBy?: 'momentum' | 'responses' | 'latest';
}