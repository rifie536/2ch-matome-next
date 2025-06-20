export interface RSSItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  creator: string;
  categories: string[];
  description: string;
  source: string;
  sourceCategory: string;
  thumbnail?: string;
}

export interface RSSFeed {
  source: string;
  category: string;
  items: Omit<RSSItem, 'source' | 'sourceCategory'>[];
  error?: boolean;
}

export interface RSSResponse {
  feeds: RSSFeed[];
  allItems: RSSItem[];
  timestamp: string;
}