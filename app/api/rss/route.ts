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
  },
  {
    name: 'ニュー速VIPブログ',
    url: 'https://news4vip.livedoor.biz/index.rdf',
    category: 'VIP'
  },
  {
    name: 'ニュース23',
    url: 'http://blog.livedoor.jp/news23vip/index.rdf',
    category: 'ニュース'
  },
  {
    name: 'ハムスター速報',
    url: 'https://hamusoku.com/index.rdf',
    category: '総合'
  },
  {
    name: '気になるニュース',
    url: 'http://blog.livedoor.jp/kinisoku/index.rdf',
    category: 'ニュース'
  },
  {
    name: 'オレ的ゲーム速報',
    url: 'https://orusoku.com/index.rdf',
    category: 'ゲーム'
  },
  {
    name: 'イミフwwwうはwwwwおkwww',
    url: 'https://imihu.net/index.rdf',
    category: '総合'
  },
  {
    name: 'ゴールデンタイムズ',
    url: 'http://blog.livedoor.jp/goldennews/index.rdf',
    category: 'ニュース'
  },
  {
    name: 'ぶる速-VIP',
    url: 'http://burusoku-vip.com/index.rdf',
    category: 'VIP'
  },
  {
    name: 'ワロタじゃねーよ',
    url: 'http://brow2ing.com/index.rdf',
    category: '総合'
  },
  {
    name: 'ツインテール速報',
    url: 'https://twintailsokuhou.blog.jp/index.rdf',
    category: 'アニメ'
  },
  {
    name: 'ひまゲ速報',
    url: 'http://himasoku.com/index.rdf',
    category: 'ゲーム'
  },
  {
    name: '流速VIP',
    url: 'http://ryusoku.com/index.rdf',
    category: 'VIP'
  },
  {
    name: '痛いニュース(ノ∀`)',
    url: 'http://itaishinja.com/index.rdf',
    category: 'ニュース'
  },
  {
    name: 'ワーキングニュース',
    url: 'http://workingnews117.com/index.rdf',
    category: '仕事'
  },
  {
    name: 'NWKニュース',
    url: 'https://nwknews.jp/index.rdf',
    category: 'ニュース'
  },
  {
    name: '哲学ニュース',
    url: 'https://news.2chblog.jp/index.rdf',
    category: '哲学'
  },
  {
    name: 'VSNP',
    url: 'http://www.vsnp.net/index.rdf',
    category: '総合'
  },
  {
    name: 'カオスちゃんねる',
    url: 'http://chaos2ch.com/index.rdf',
    category: '総合'
  },
  {
    name: 'まとめたニュース',
    url: 'http://matometanews.com/index.rdf',
    category: 'ニュース'
  },
  {
    name: 'BigCity東京',
    url: 'http://bipblog.com/index.rdf',
    category: '総合'
  },
  {
    name: 'おたくニュース',
    url: 'https://otanews.livedoor.biz/index.rdf',
    category: 'オタク'
  },
  {
    name: 'なんでもまとめ',
    url: 'http://nantuka.blog119.fc2.com/index.rdf',
    category: '総合'
  },
  {
    name: 'フットボールネット',
    url: 'https://footballnet.2chblog.jp/index.rdf',
    category: 'スポーツ'
  },
  {
    name: 'おりょうり速報',
    url: 'https://oryouri.2chblog.jp/index.rdf',
    category: '料理'
  },
  {
    name: 'ライフハックちゃんねる',
    url: 'https://lifehack2ch.livedoor.biz/index.rdf',
    category: 'ライフハック'
  },
  {
    name: 'お金の教養講座',
    url: 'https://money-life.doorblog.jp/index.rdf',
    category: 'マネー'
  },
  {
    name: '2chコピペ',
    url: 'http://2chcopipe.com/index.rdf',
    category: 'コピペ'
  },
  {
    name: 'らむせくと',
    url: 'http://lamsect.jp/index.rdf',
    category: '総合'
  },
  {
    name: 'ガハろぐNews',
    url: 'https://gahalog.2chblog.jp/index.rdf',
    category: '総合'
  },
  {
    name: '2ch名人',
    url: 'https://i2chmeijin.blog.fc2.com/index.rdf',
    category: '将棋'
  },
  {
    name: 'あやちゃんニュース',
    url: 'https://ayacnews2nd.com/index.rdf',
    category: 'ニュース'
  },
  {
    name: 'カルカンタイムズ',
    url: 'https://karukantimes.com/index.rdf',
    category: '総合'
  },
  {
    name: 'ねたAtoZ',
    url: 'http://www.negisoku.com/index.rdf',
    category: 'ネタ'
  },
  {
    name: '登山ちゃんねる',
    url: 'https://tozanchannel.blog.jp/index.rdf',
    category: '登山'
  },
  {
    name: 'アウトドアまとめちゃん',
    url: 'https://outdoormatome.com/index.rdf',
    category: 'アウトドア'
  },
  {
    name: '不思議.net',
    url: 'http://world-fusigi.net/index.rdf',
    category: '不思議'
  },
  {
    name: 'ほぼ日刊たまご',
    url: 'http://blog.livedoor.jp/bluejay01-review/index.rdf',
    category: 'レビュー'
  },
  {
    name: 'ねこめ〜わく',
    url: 'http://blog.livedoor.jp/waruneko00326-002/index.rdf',
    category: '猫'
  },
  {
    name: 'IT速報',
    url: 'http://blog.livedoor.jp/itsoku/index.rdf',
    category: 'IT'
  },
  {
    name: '理系にゅーす',
    url: 'https://rikeinews.blog.jp/index.rdf',
    category: '理系'
  },
  {
    name: 'くるまにあ速報',
    url: 'https://kurumachannel.com/index.rdf',
    category: '車'
  },
  {
    name: '疑問ある？',
    url: 'http://shitsumonaru.com/index.rdf',
    category: '疑問'
  },
  {
    name: '音楽業界ぶっかけ術',
    url: 'https://otonary.net/index.rdf',
    category: '音楽'
  },
  {
    name: 'GFoodd',
    url: 'http://gfoodd.com/index.rdf',
    category: 'グルメ'
  },
  {
    name: 'えいご速報',
    url: 'https://eigotoka.com/index.rdf',
    category: '英語'
  },
  {
    name: 'フード速報',
    url: 'https://foodsokuhou.com/index.rdf',
    category: 'グルメ'
  },
  {
    name: 'うしみつ',
    url: 'http://usi32.com/index.rdf',
    category: 'オカルト'
  },
  {
    name: '修羅場まとめ',
    url: 'https://shuraba-matome.com/index.rdf',
    category: '修羅場'
  },
  {
    name: 'わたるきち',
    url: 'https://watarukiti.com/index.rdf',
    category: '総合'
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