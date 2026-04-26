'use client';

import { useState, useMemo } from 'react';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_WEEKLY_REPORT, MOCK_USER } from '@/lib/constants';

export default function ReportPage() {
  const [isVIP] = useState(MOCK_USER.isVIP);
  const report = MOCK_WEEKLY_REPORT;

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'sad': return '😔';
      default: return '😐';
    }
  };

  const getWordSize = (count: number) => {
    if (count >= 25) return 'text-2xl';
    if (count >= 15) return 'text-xl';
    if (count >= 10) return 'text-lg';
    return 'text-base';
  };

  // 预定义颜色映射
  const wordColors = useMemo(() => [
    'bg-red-100 text-red-600',
    'bg-orange-100 text-orange-600',
    'bg-yellow-100 text-yellow-600',
    'bg-green-100 text-green-600',
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
  ], []);

  const getWordColor = (index: number) => {
    return wordColors[index % wordColors.length];
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-8">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-[#FFE66D] to-[#f1c40f] px-4 pt-6 pb-10 rounded-b-[32px]">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => window.history.back()} className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <SpeakableText variant="inline" size="2xl" className="font-bold text-gray-800">
            本周周报
          </SpeakableText>
        </div>
        <SpeakableText variant="inline" size="lg" className="!text-gray-600">
          2026年4月20日 - 4月26日
        </SpeakableText>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* 基础数据 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <SpeakableText variant="inline" size="xl">
              活跃概览
            </SpeakableText>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] rounded-2xl p-5 text-white text-center shadow-md">
              <SpeakableText variant="block" size="4xl" className="font-bold">
                {report.activeDays}
              </SpeakableText>
              <SpeakableText variant="inline" size="lg" className="!text-white/80">
                活跃天数
              </SpeakableText>
            </div>
            <div className="bg-gradient-to-br from-[#4ECDC4] to-[#44a08d] rounded-2xl p-5 text-white text-center shadow-md">
              <SpeakableText variant="block" size="4xl" className="font-bold">
                {report.postCount}
              </SpeakableText>
              <SpeakableText variant="inline" size="lg" className="!text-white/80">
                发帖数量
              </SpeakableText>
            </div>
          </div>
        </div>

        {/* VIP专属：词云 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">☁️</span>
              <SpeakableText variant="inline" size="xl">
                高频词云
              </SpeakableText>
            </h2>
            {!isVIP && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                VIP专属
              </span>
            )}
          </div>
          
          {isVIP ? (
            <div className="word-cloud">
              {report.wordCloud.map((item, index) => (
                <span
                  key={index}
                  className={`word-item ${getWordSize(item.count)} ${getWordColor(index)}`}
                >
                  <SpeakableText variant="inline" size="base" className={getWordSize(item.count)}>
                    {item.word} ({item.count})
                  </SpeakableText>
                </span>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <SpeakableText variant="block" size="lg" className="!text-gray-500 mb-3">
                开通VIP查看详细词云分析
              </SpeakableText>
              <SpeakableText variant="block" size="md" className="!text-gray-400">
                了解您本周关注的重点话题
              </SpeakableText>
              <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-full font-bold text-lg">
                开通VIP
              </button>
            </div>
          )}
        </div>

        {/* VIP专属：情绪趋势 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📈</span>
              <SpeakableText variant="inline" size="xl">
                情绪趋势
              </SpeakableText>
            </h2>
            {!isVIP && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                VIP专属
              </span>
            )}
          </div>
          
          {isVIP ? (
            <div className="flex items-center justify-between">
              {report.emotionTrend.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className={`emotion-dot w-14 h-14 bg-${
                    item.emotion === 'happy' ? '[#FF6B6B]' : 
                    item.emotion === 'calm' ? '[#4ECDC4]' : 'gray-400'
                  }`}>
                    <span className="text-2xl">{getEmotionEmoji(item.emotion)}</span>
                  </div>
                  <SpeakableText variant="inline" size="sm" className="!text-gray-500">
                    {item.day}
                  </SpeakableText>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <SpeakableText variant="block" size="lg" className="!text-gray-500 mb-3">
                开通VIP查看情绪趋势分析
              </SpeakableText>
              <SpeakableText variant="block" size="md" className="!text-gray-400">
                了解您一周的情绪变化
              </SpeakableText>
              <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-full font-bold text-lg">
                开通VIP
              </button>
            </div>
          )}
        </div>

        {/* VIP专属：AI建议 */}
        {isVIP && report.suggestions && (
          <div className="bg-green-50 rounded-3xl p-6 border border-green-200">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-green-600">
              <span className="text-2xl">💡</span>
              <SpeakableText variant="inline" size="xl" className="!text-green-600">
                AI建议
              </SpeakableText>
            </h2>
            <SpeakableText variant="block" size="lg" className="!text-green-700">
              {report.suggestions}
            </SpeakableText>
          </div>
        )}

        {/* 分享给子女 */}
        <button className="w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <SpeakableText variant="inline" size="xl" className="!text-white font-bold">
            分享给子女
          </SpeakableText>
        </button>
      </div>
    </div>
  );
}
