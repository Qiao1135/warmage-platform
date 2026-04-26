'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SpeakableText } from '@/components/SpeakableText';
import { VIPCard } from '@/components/VIPCard';

interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { icon: '👤', label: '个人信息' },
  { icon: '📚', label: '我的帖子' },
  { icon: '❤️', label: '我的收藏' },
  { icon: '👥', label: '我的关注' },
  { icon: '🔔', label: '消息通知', badge: 3 },
  { icon: '🔒', label: '隐私设置' },
  { icon: '⚙️', label: '系统设置' },
  { icon: '💬', label: '联系客服' },
];

export default function ProfilePage() {
  const [user] = useState({
    name: '张阿姨',
    isVIP: true,
    vipExpireDate: '2026年6月1日',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F0] to-white pb-8">
      {/* 顶部个人信息 */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white px-4 pt-6 pb-10">
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fff&color=FF6B6B&size=200&font-size=0.4&rounded=true`}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl"
          />
          <div className="flex-1">
            <SpeakableText variant="inline" size="2xl" className="font-bold">
              {user.name}
            </SpeakableText>
            <SpeakableText variant="inline" size="md" className="!text-white/80 !block mt-1">
              ID: 888888
            </SpeakableText>
            {user.isVIP && (
              <span className="inline-flex items-center gap-1 mt-2 px-4 py-1 bg-yellow-300 text-yellow-800 text-sm rounded-full font-medium">
                👑 VIP会员
              </span>
            )}
          </div>
          <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* 数据统计 */}
        <div className="flex justify-around mt-6 bg-white/10 rounded-3xl py-5">
          {[
            { num: '128', label: '关注' },
            { num: '256', label: '粉丝' },
            { num: '32', label: '帖子' },
            { num: '1024', label: '获赞' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <SpeakableText variant="inline" size="2xl" className="font-bold">
                {item.num}
              </SpeakableText>
              <SpeakableText variant="inline" size="md" className="!text-white/70 !block">
                {item.label}
              </SpeakableText>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* VIP卡片 */}
        <VIPCard
          isVIP={user.isVIP}
          expireDate={user.vipExpireDate}
          onUpgrade={() => window.location.href = '/vip'}
        />

        {/* 菜单列表 */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href || '/profile/settings'}
              className={`flex items-center gap-4 px-5 py-5 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <span className="text-3xl">{item.icon}</span>
              <SpeakableText variant="inline" size="lg" className="flex-1 font-medium">
                {item.label}
              </SpeakableText>
              {item.badge && (
                <span className="w-7 h-7 bg-[#FF6B6B] text-white text-sm rounded-full flex items-center justify-center font-medium">
                  {item.badge}
                </span>
              )}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* 退出登录 */}
        <button className="w-full py-4 bg-white rounded-2xl text-[#FF6B6B] font-bold text-lg shadow-lg">
          <SpeakableText variant="inline" size="xl" className="font-bold">
            退出登录
          </SpeakableText>
        </button>

        {/* 版本信息 */}
        <SpeakableText variant="block" size="md" className="text-center text-gray-400 mt-4">
          暖圈 v1.0.0
        </SpeakableText>
      </div>
    </div>
  );
}
