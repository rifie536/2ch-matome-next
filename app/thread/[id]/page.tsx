'use client';

import { useThread } from '@/hooks/useThreads';
import { formatTimeAgo, formatMomentum } from '@/lib/utils';
import { MessageCircle, TrendingUp, Clock, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';

export default function ThreadPage() {
  const params = useParams();
  const threadId = params.id as string;
  const { data, isLoading } = useThread(threadId);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <p className="text-gray-600">スレッドが見つかりませんでした</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { thread, responses } = data;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/threads" className="text-gray-600 hover:text-blue-600 transition-colors">
              スレッド一覧
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{thread.board}</span>
          </nav>

          {/* Thread Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                {thread.board}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {thread.responseCount}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {formatMomentum(thread.momentum)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(new Date(thread.createdAt))}
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{thread.title}</h1>
            <p className="text-gray-700">{thread.preview}</p>
          </div>

          {/* Responses */}
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                id={`res${response.number}`}
                className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-baseline gap-3 mb-3 border-b pb-3">
                  <span className="text-blue-600 font-bold">{response.number}</span>
                  <span className="text-gray-700 font-medium">{response.name}</span>
                  <span className="text-gray-500 text-sm ml-auto">
                    {formatTimeAgo(new Date(response.date))}
                  </span>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {response.replies && response.replies.length > 0 && (
                    <div className="mb-2">
                      {response.replies.map((replyNum) => (
                        <a
                          key={replyNum}
                          href={`#res${replyNum}`}
                          className="inline-block mr-2 text-blue-600 hover:underline"
                        >
                          >>{replyNum}
                        </a>
                      ))}
                    </div>
                  )}
                  {response.content}
                </div>
                {response.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={response.imageUrl}
                      alt=""
                      className="max-w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">レスを投稿</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="名前（省略可）"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="email"
                  placeholder="メール（省略可）"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <textarea
                placeholder="本文"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                書き込む
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}