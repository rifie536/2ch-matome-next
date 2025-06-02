'use client';

import { TrendingUp, Cloud, DollarSign, BarChart3 } from 'lucide-react';
import { Thread } from '@/types/thread';
import { formatMomentum } from '@/lib/utils';
import Link from 'next/link';

interface SidebarProps {
  trendingThreads?: Thread[];
}

export function Sidebar({ trendingThreads = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Weather Widget */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <Cloud className="w-8 h-8" />
          <span className="text-sm opacity-80">東京</span>
        </div>
        <div className="text-4xl font-bold mb-2">22°</div>
        <div className="text-sm opacity-90">晴れ時々曇り</div>
      </div>

      {/* Trending Threads */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
        <div className="bg-blue-600 px-5 py-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold text-white">人気スレッドランキング</h2>
        </div>
        <div className="p-5 space-y-1">
          {trendingThreads.slice(0, 5).map((thread, index) => (
            <Link
              key={thread.id}
              href={`/thread/${thread.id}`}
              className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-blue-500 font-bold text-lg w-6 text-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-300 line-clamp-2 mb-1">{thread.title}</p>
                <p className="text-xs text-gray-500">{formatMomentum(thread.momentum)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stock Widget */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
        <div className="bg-blue-600 px-5 py-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          <h2 className="font-bold text-white">市況情報</h2>
        </div>
        <div className="p-5 space-y-4">
          <StockItem name="日経平均" value="29,850" change="+120" changePercent="+0.4%" isUp />
          <StockItem name="TOPIX" value="2,145" change="+15" changePercent="+0.7%" isUp />
          <StockItem name="ドル円" value="149.85" change="-0.25" changePercent="-0.2%" isUp={false} />
        </div>
      </div>

      {/* Board Stats */}
      <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
        <div className="bg-blue-600 px-5 py-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <h2 className="font-bold text-white">板別統計</h2>
        </div>
        <div className="p-5 space-y-3">
          <BoardStat name="VIP板" count={128} />
          <BoardStat name="なんでも実況J" count={156} />
          <BoardStat name="ニュース速報" count={89} />
          <BoardStat name="嫌儲" count={78} />
        </div>
      </div>
    </aside>
  );
}

function StockItem({
  name,
  value,
  change,
  changePercent,
  isUp,
}: {
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isUp: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-400">{name}</span>
      <div className="text-right">
        <div className="font-bold text-white">{value}</div>
        <div className={`text-xs ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {change} ({changePercent})
        </div>
      </div>
    </div>
  );
}

function BoardStat({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex justify-between items-center p-3 -mx-3 rounded-lg hover:bg-gray-700 transition-colors">
      <span className="text-sm text-gray-300">{name}</span>
      <span className="text-sm text-gray-500">{count}スレ</span>
    </div>
  );
}