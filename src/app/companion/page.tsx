'use client';

import Link from 'next/link';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_USER } from '@/lib/constants';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  badgeType?: 'vip' | 'free';
  href: string;
}

function FeatureCard({ icon, title, description, badge, badgeType = 'free', href }: FeatureCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-98">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-4xl">{icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <SpeakableText variant="inline" size="xl" className="font-bold">
                {title}
              </SpeakableText>
              {badge && (
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  badgeType === 'vip' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {badge}
                </span>
              )}
            </div>
            <SpeakableText variant="inline" size="md" className="!text-gray-500 !block mt-1">
              {description}
            </SpeakableText>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function CompanionPage() {
  const user = MOCK_USER;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4ECDC4]/10 to-[#FFF9F0] pb-8">
      {/* 顶部标题 */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white px-4 pt-6 pb-10 rounded-b-[32px] shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">💕</span>
          <SpeakableText variant="inline" size="2xl" className="font-bold !text-white">
            暖伴中心
          </SpeakableText>
        </div>
        <SpeakableText variant="inline" size="lg" className="!text-white/80">
          温暖相伴，贴心关怀
        </SpeakableText>
      </div>

      {/* 功能入口 */}
      <div className="px-4 -mt-6 space-y-4">
        <FeatureCard
          icon="🤖"
          title="AI语音陪聊"
          description={user.isVIP ? '不限时长，随时聊天' : `今日剩余 ${user.freeChatMinutes} 分钟`}
          badge={user.isVIP ? 'VIP' : '免费'}
          badgeType="vip"
          href="/companion/chat"
        />

        <FeatureCard
          icon="📞"
          title="志愿者电话陪聊"
          description={`本周剩余 ${user.weeklyFreeVolunteer - user.usedVolunteerThisWeek} 次免费机会`}
          href="/companion/volunteer"
        />

        <FeatureCard
          icon="📊"
          title="子女周报"
          description={user.isVIP ? '查看详细周报' : '本周活跃6天，发帖3篇'}
          badge={user.isVIP ? undefined : '基础版'}
          href="/companion/report"
        />

        <FeatureCard
          icon="🔔"
          title="每日暖心推送"
          description={user.isVIP ? '每天早上8点准时送达' : '开通VIP解锁个性化推送'}
          badge={user.isVIP ? '已开启' : 'VIP专属'}
          badgeType="vip"
          href="/companion/push"
        />
      </div>

      {/* 底部提示 */}
      <div className="px-4 mt-8">
        <div className="bg-blue-50 rounded-3xl p-5">
          <SpeakableText variant="block" size="md" className="text-blue-600 flex items-start gap-2">
            <span className="text-2xl flex-shrink-0">💡</span>
            <span>
              暖心提示：连续AI陪聊30分钟后，系统会自动提醒您休息。适当的休息对健康很重要哦！
            </span>
          </SpeakableText>
        </div>
      </div>
    </div>
  );
}
