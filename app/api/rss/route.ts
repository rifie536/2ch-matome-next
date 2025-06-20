import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// RSSフィードのURL一覧
const RSS_FEEDS = [
  {
    name: 'アルファルファモザイク',
    url: 'https://alfalfalfa.com/index.rdf',
    category: '総合'
  },
  {
    name: '痛いニュース',
    url: 'https://itainews.com/index.rdf',
    category: 'ニュース'
  }
];

export async function GET() {
  try {
    const allFeeds = await Promise.all(
      RSS_FEEDS.map(async (feedInfo) => {
        try {
          const feed = await parser.parseURL(feedInfo.url);
          
          return {
            source: feedInfo.name,
            category: feedInfo.category,
            items: feed.items.map((item) => {
              // content:encodedから画像を抽出
              const contentEncoded = item['content:encoded'] || '';
              let thumbnail = '';
              
              // アイキャッチ画像を優先的に取得
              const eyeCatchMatch = contentEncoded.match(/<div class="eye-catch">[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>/);
              if (eyeCatchMatch) {
                thumbnail = eyeCatchMatch[1];
              } else {
                // 通常の画像タグから最初の画像を取得
                const imgMatch = contentEncoded.match(/<img[^>]+src="([^"]+)"[^>]*>/);
                if (imgMatch) {
                  thumbnail = imgMatch[1];
                }
              }
              
              return {
                id: item.guid || item.link || '',
                title: item.title || '',
                link: item.link || '',
                pubDate: item.pubDate || item.isoDate || '',
                content: item.content || item.contentSnippet || '',
                creator: item.creator || feedInfo.name,
                categories: item.categories || [feedInfo.category],
                description: item['content:encoded'] || item.description || '',
                thumbnail: thumbnail,
              };
            })
          };
        } catch (error) {
          console.error(`Error fetching feed from ${feedInfo.name}:`, error);
          return {
            source: feedInfo.name,
            category: feedInfo.category,
            items: [],
            error: true
          };
        }
      })
    );

    // すべてのアイテムを統合して時系列順にソート
    const allItems = allFeeds.flatMap(feed => 
      feed.items.map(item => ({
        ...item,
        source: feed.source,
        sourceCategory: feed.category
      }))
    );

    // 日付でソート（新しい順）
    allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      feeds: allFeeds,
      allItems: allItems.slice(0, 50), // 最新50件を返す
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}