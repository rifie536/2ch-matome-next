import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// 簡易インメモリキャッシュ
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5分間

// カテゴリ別の色設定
function generatePlaceholderImage(siteName: string, category: string): string {
  const categoryColors: { [key: string]: string } = {
    'ネタ速報': '3182CE', // 青
    'ニュース': 'E53E3E', // 赤
    'VIP': '38A169', // 緑
    'ゲーム': '3182CE', // 青
    '総合': '805AD5', // 紫
    'アニメ': 'D69E2E', // オレンジ
    'スポーツ': '319795', // ティール
    '料理': 'DD6B20', // オレンジ系
    'IT': '2D3748', // ダークグレー
    '理系': '1A365D', // ダークブルー
    'オカルト': '553C9A', // ダークパープル
    '猫': 'F56565', // ピンク
    '音楽': 'ED64A6', // マゼンタ
  };
  
  const backgroundColor = categoryColors[category] || '4F46E5'; // デフォルトは紫
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(siteName)}&size=300&background=${backgroundColor}&color=FFFFFF&bold=true`;
}

// RSSフィードのURL一覧
const RSS_FEEDS = [
  {
    name: 'アルファルファモザイク',
    url: 'https://alfalfalfa.com/index.rdf',
    category: 'ネタ速報',
    headerImage: 'https://alfalfalfa.com/image/header_logo.png'
  },
  {
    name: '痛いニュース',
    url: 'https://itainews.com/index.rdf',
    category: 'ネタ速報',
    headerImage: 'https://itainews.com/image/logo.png'
  },
  {
    name: 'ニュー速VIPブログ',
    url: 'https://news4vip.livedoor.biz/index.rdf',
    category: 'ネタ速報',
    headerImage: 'https://news4vip.livedoor.biz/img/header.png'
  },
  {
    name: 'ニュース23',
    url: 'http://blog.livedoor.jp/news23vip/index.rdf',
    category: 'ネタ速報',
    headerImage: 'https://blog.livedoor.jp/news23vip/imgs/blog_logo.gif'
  },
  {
    name: 'ハムスター速報',
    url: 'https://hamusoku.com/index.rdf',
    category: 'ネタ速報',
    headerImage: 'https://hamusoku.com/img/header_logo.png'
  },
  {
    name: '気になるニュース',
    url: 'http://blog.livedoor.jp/kinisoku/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'オレ的ゲーム速報',
    url: 'https://orusoku.com/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'イミフwwwうはwwwwおkwww',
    url: 'https://imihu.net/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'ゴールデンタイムズ',
    url: 'http://blog.livedoor.jp/goldennews/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'ぶる速-VIP',
    url: 'http://burusoku-vip.com/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'ワロタじゃねーよ',
    url: 'http://brow2ing.com/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'ツインテール速報',
    url: 'https://twintailsokuhou.blog.jp/index.rdf',
    category: 'ネタ速報',
    headerImage: null
  },
  {
    name: 'ひまゲ速報',
    url: 'http://himasoku.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '流速VIP',
    url: 'http://ryusoku.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '痛いニュース(ノ∀`)',
    url: 'http://itaishinja.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'ワーキングニュース',
    url: 'http://workingnews117.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'NWKニュース',
    url: 'https://nwknews.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '哲学ニュース',
    url: 'https://news.2chblog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'VSNP',
    url: 'http://www.vsnp.net/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'カオスちゃんねる',
    url: 'http://chaos2ch.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'まとめたニュース',
    url: 'http://matometanews.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'BigCity東京',
    url: 'http://bipblog.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'おたくニュース',
    url: 'https://otanews.livedoor.biz/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'なんでもまとめ',
    url: 'http://nantuka.blog119.fc2.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'フットボールネット',
    url: 'https://footballnet.2chblog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'おりょうり速報',
    url: 'https://oryouri.2chblog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'ライフハックちゃんねる',
    url: 'https://lifehack2ch.livedoor.biz/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'お金の教養講座',
    url: 'https://money-life.doorblog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '2chコピペ',
    url: 'http://2chcopipe.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'らむせくと',
    url: 'http://lamsect.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'ガハろぐNews',
    url: 'https://gahalog.2chblog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '2ch名人',
    url: 'https://i2chmeijin.blog.fc2.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'あやちゃんニュース',
    url: 'https://ayacnews2nd.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'カルカンタイムズ',
    url: 'https://karukantimes.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'ねたAtoZ',
    url: 'http://www.negisoku.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '登山ちゃんねる',
    url: 'https://tozanchannel.blog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'アウトドアまとめちゃん',
    url: 'https://outdoormatome.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '不思議.net',
    url: 'http://world-fusigi.net/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'ほぼ日刊たまご',
    url: 'http://blog.livedoor.jp/bluejay01-review/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'ねこめ〜わく',
    url: 'http://blog.livedoor.jp/waruneko00326-002/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'IT速報',
    url: 'http://blog.livedoor.jp/itsoku/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '理系にゅーす',
    url: 'https://rikeinews.blog.jp/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'くるまにあ速報',
    url: 'https://kurumachannel.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '疑問ある？',
    url: 'http://shitsumonaru.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '音楽業界ぶっかけ術',
    url: 'https://otonary.net/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'GFoodd',
    url: 'http://gfoodd.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'えいご速報',
    url: 'https://eigotoka.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'フード速報',
    url: 'https://foodsokuhou.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'うしみつ',
    url: 'http://usi32.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: '修羅場まとめ',
    url: 'https://shuraba-matome.com/index.rdf',
    category: 'ネタ速報'
  },
  {
    name: 'わたるきち',
    url: 'https://watarukiti.com/index.rdf',
    category: 'ネタ速報'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // キャッシュチェック
    const cacheKey = `rss-feeds-${page}-${limit}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }
    
    // 高速化: 各フィードから少ない件数で取得し、並列処理を最適化
    const allFeeds = await Promise.allSettled(
      RSS_FEEDS.map(async (feedInfo) => {
        try {
          // タイムアウト付きでフィードを取得
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000) // 3秒タイムアウト
          );
          
          const feed = await Promise.race([
            parser.parseURL(feedInfo.url),
            timeoutPromise
          ]) as any;
          
          return {
            source: feedInfo.name,
            category: feedInfo.category,
            items: feed.items.slice(0, 15).map((item: any) => { // 各フィードから15件に制限
              // 画像取得を簡略化（最初の画像のみ）
              const contentEncoded = item['content:encoded'] || '';
              const imgMatch = contentEncoded.match(/<img[^>]+src="([^"]+)"[^>]*>/);
              const thumbnail = imgMatch ? imgMatch[1] : null;
              
              return {
                id: item.guid || item.link || '',
                title: item.title || '',
                link: item.link || '',
                pubDate: item.pubDate || item.isoDate || '',
                content: item.content || item.contentSnippet || '',
                creator: item.creator || feedInfo.name,
                categories: item.categories || [feedInfo.category],
                description: item['content:encoded'] || item.description || '',
                thumbnail: thumbnail || generatePlaceholderImage(feedInfo.name, feedInfo.category),
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

    // 成功したフィードのみを処理
    const successfulFeeds = allFeeds
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    // すべてのアイテムを統合して時系列順にソート
    const allItems = successfulFeeds.flatMap(feed => 
      feed.items.map((item: any) => ({
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

    // ページネーション
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    const responseData = {
      feeds: successfulFeeds,
      allItems: paginatedItems,
      pagination: {
        page,
        limit,
        total: allItems.length,
        hasMore: endIndex < allItems.length
      },
      timestamp: new Date().toISOString()
    };

    // キャッシュに保存
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('RSS feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feeds' },
      { status: 500 }
    );
  }
}