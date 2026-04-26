'use client';

import { useState } from 'react';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_USER } from '@/lib/constants';

const VIP_FEATURES = [
  { icon: '🤖', title: 'AI陪聊不限时', desc: '随时随地，无限畅聊' },
  { icon: '👨‍👩‍👧‍👦', title: '子女代付', desc: '子女可一键帮助支付' },
  { icon: '📊', title: '详细周报', desc: '情绪分析、词云等高级功能' },
  { icon: '🔔', title: '个性化推送', desc: '定制专属您的暖心提醒' },
  { icon: '💬', title: '高级评论', desc: '解锁更多暖心评论模板' },
  { icon: '🎁', title: '专属活动', desc: 'VIP会员专属活动参与权' },
];

const PAYMENT_METHODS = [
  { id: 'wechat', name: '微信支付', icon: '💳' },
  { id: 'alipay', name: '支付宝', icon: '💰' },
  { id: 'children', name: '子女代付', icon: '👨‍👩‍👧‍👦', badge: '推荐' },
];

export default function VIPPage() {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'quarterly' | 'monthly'>('yearly');
  const [selectedPayment, setSelectedPayment] = useState('wechat');
  const [isVIP] = useState(MOCK_USER.isVIP);

  const plans = {
    yearly: { price: '99', original: '198', period: '年', savings: '省50%' },
    quarterly: { price: '29', original: '39', period: '季', savings: '省25%' },
    monthly: { price: '12', original: '', period: '月', savings: '' },
  };

  const currentPlan = plans[selectedPlan];

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-8">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-white px-4 pt-6 pb-20 rounded-b-[32px]">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => window.history.back()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <SpeakableText variant="inline" size="2xl" className="font-bold !text-white">
            开通VIP会员
          </SpeakableText>
        </div>
        
        {/* 当前状态 */}
        <div className="bg-white/20 backdrop-blur rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-5xl">👑</span>
            </div>
            <div>
              {isVIP ? (
                <>
                  <SpeakableText variant="block" size="2xl" className="font-bold !text-white">
                    您已是VIP会员
                  </SpeakableText>
                  <SpeakableText variant="inline" size="lg" className="!text-white/80">
                    有效期至 2027年4月20日
                  </SpeakableText>
                </>
              ) : (
                <>
                  <SpeakableText variant="block" size="2xl" className="font-bold !text-white">
                    尊享VIP服务
                  </SpeakableText>
                  <SpeakableText variant="inline" size="lg" className="!text-white/80">
                    温暖相伴每一天
                  </SpeakableText>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-10 space-y-4">
        {/* VIP特权 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <SpeakableText variant="inline" size="xl">
              VIP专属特权
            </SpeakableText>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {VIP_FEATURES.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <SpeakableText variant="inline" size="lg" className="font-bold !block">
                  {feature.title}
                </SpeakableText>
                <SpeakableText variant="inline" size="md" className="!text-gray-500 !block">
                  {feature.desc}
                </SpeakableText>
              </div>
            ))}
          </div>
        </div>

        {/* 套餐选择 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <SpeakableText variant="inline" size="xl">
              选择套餐
            </SpeakableText>
          </h2>
          
          <div className="space-y-3">
            {/* 年卡 */}
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                selectedPlan === 'yearly' 
                  ? 'border-[#FF6B6B] bg-[#FF6B6B]/5' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPlan === 'yearly' ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100'
                  }`}>
                    <span className="text-2xl">👑</span>
                  </div>
                  <div>
                    <SpeakableText variant="inline" size="lg" className="font-bold">
                      年卡
                    </SpeakableText>
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                      最划算
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <SpeakableText variant="inline" size="2xl" className="font-bold text-[#FF6B6B]">
                    ¥{currentPlan.price}
                  </SpeakableText>
                  {selectedPlan === 'yearly' && (
                    <>
                      <SpeakableText variant="inline" size="md" className="!text-gray-400 line-through">
                        ¥{currentPlan.original}
                      </SpeakableText>
                      <div className="text-xs text-green-500 font-bold">半价特惠</div>
                    </>
                  )}
                </div>
              </div>
            </button>

            {/* 季卡 */}
            <button
              onClick={() => setSelectedPlan('quarterly')}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                selectedPlan === 'quarterly' 
                  ? 'border-[#FF6B6B] bg-[#FF6B6B]/5' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPlan === 'quarterly' ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100'
                  }`}>
                    <span className="text-2xl">🌟</span>
                  </div>
                  <SpeakableText variant="inline" size="lg" className="font-bold">
                    季卡
                  </SpeakableText>
                </div>
                <div className="text-right">
                  <SpeakableText variant="inline" size="2xl" className="font-bold text-[#FF6B6B]">
                    ¥{currentPlan.price}
                  </SpeakableText>
                  {selectedPlan === 'quarterly' && (
                    <SpeakableText variant="inline" size="md" className="!text-gray-400 line-through">
                      /{currentPlan.period}
                    </SpeakableText>
                  )}
                </div>
              </div>
            </button>

            {/* 月卡 */}
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                selectedPlan === 'monthly' 
                  ? 'border-[#FF6B6B] bg-[#FF6B6B]/5' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPlan === 'monthly' ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100'
                  }`}>
                    <span className="text-2xl">🌙</span>
                  </div>
                  <SpeakableText variant="inline" size="lg" className="font-bold">
                    月卡
                  </SpeakableText>
                </div>
                <div className="text-right">
                  <SpeakableText variant="inline" size="2xl" className="font-bold text-[#FF6B6B]">
                    ¥{currentPlan.price}
                  </SpeakableText>
                  {selectedPlan === 'monthly' && (
                    <SpeakableText variant="inline" size="md" className="!text-gray-400">
                      /{currentPlan.period}
                    </SpeakableText>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 支付方式 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="text-2xl">💳</span>
            <SpeakableText variant="inline" size="xl">
              支付方式
            </SpeakableText>
          </h2>
          
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  selectedPayment === method.id 
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]/5' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{method.icon}</span>
                  <SpeakableText variant="inline" size="lg" className="font-medium">
                    {method.name}
                  </SpeakableText>
                  {method.badge && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                      {method.badge}
                    </span>
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === method.id 
                    ? 'border-[#FF6B6B] bg-[#FF6B6B]' 
                    : 'border-gray-300'
                }`}>
                  {selectedPayment === method.id && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 确认支付 */}
        <button className="w-full py-5 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          <SpeakableText variant="inline" size="xl" className="!text-white font-bold">
            确认支付 ¥{currentPlan.price}{currentPlan.period}
          </SpeakableText>
        </button>

        {/* 服务协议 */}
        <div className="text-center">
          <SpeakableText variant="inline" size="md" className="!text-gray-400">
            支付即表示同意
          </SpeakableText>
          <button className="text-[#4ECDC4]">
            <SpeakableText variant="inline" size="md" className="underline">
              《VIP会员服务协议》
            </SpeakableText>
          </button>
        </div>
      </div>
    </div>
  );
}
