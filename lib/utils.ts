import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMomentum(momentum: number): string {
  if (momentum >= 1000) {
    return `${(momentum / 1000).toFixed(1)}k/h`;
  }
  return `${momentum}/h`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (minutes > 0) return `${minutes}分前`;
  return '今';
}

export function getThreadEmoji(board: string): string {
  const emojiMap: Record<string, string> = {
    'VIP': '🔥',
    'なんJ': '⚾',
    'ニュー速': '📰',
    '嫌儲': '💸',
    'アニメ': '🎬',
    'ゲーム': '🎮',
    '芸スポ': '🎭',
    'IT': '💻',
    '料理': '🍳',
    '旅行': '✈️',
  };
  return emojiMap[board] || '💬';
}