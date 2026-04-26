'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SpeakableText } from '@/components/SpeakableText';

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  // 获取当前问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了';
  };

  // 获取当前日期
  const getDateString = () => {
    const now = new Date();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
  };

  const quickActions = [
    { icon: '🤝', label: 'AI陪聊', desc: '随时倾诉', color: 'from-[#4ECDC4] to-[#44a08d]', href: '/companion/chat' },
    { icon: '📝', label: '发帖分享', desc: '记录生活', color: 'from-[#FF6B6B] to-[#ff8e8e]', href: '/post' },
    { icon: '📞', label: '志愿者', desc: '温暖通话', color: 'from-[#9B59B6] to-[#8E44AD]', href: '/companion/volunteer' },
    { icon: '💊', label: '健康提醒', desc: '守护健康', color: 'from-[#E74C3C] to-[#C0392B]', href: '/companion/push' },
    { icon: '📊', label: '周报', desc: '子女关怀', color: 'from-[#F39C12] to-[#E67E22]', href: '/companion/report' },
    { icon: '👑', label: 'VIP会员', desc: '尊享服务', color: 'from-[#FFE66D] to-[#F39C12]', href: '/vip' },
  ];

  // 如果显示欢迎弹窗
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#ff8e8e] to-[#FFE66D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* 丰富的背景装饰层 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 多个渐变圆形 - 左上 */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse" />
          <div className="absolute top-5 left-5 w-32 h-32 bg-gradient-to-br from-[#FFE66D]/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          
          {/* 右上 */}
          <div className="absolute -top-5 -right-5 w-40 h-40 bg-gradient-to-bl from-white/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-10 right-10 w-28 h-28 bg-gradient-to-bl from-[#FFB347]/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 right-1/4 w-16 h-16 bg-gradient-to-br from-white/15 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
          
          {/* 左下 */}
          <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-gradient-to-tr from-white/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-20 left-10 w-36 h-36 bg-gradient-to-tr from-[#ff8e8e]/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* 右下 */}
          <div className="absolute -bottom-5 -right-10 w-44 h-44 bg-gradient-to-tl from-white/25 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-5 right-20 w-30 h-30 bg-gradient-to-tl from-[#FFE66D]/25 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.9s' }} />
          
          {/* 中央周围装饰圆形 */}
          <div className="absolute top-1/4 left-1/6 w-14 h-14 bg-gradient-to-br from-white/15 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-1/3 right-1/6 w-12 h-12 bg-gradient-to-bl from-[#FF6B6B]/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1.4s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1.6s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-gradient-to-tl from-[#FFE66D]/20 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1.8s' }} />
          
          {/* 装饰图案 - 散布在各角落 */}
          <div className="absolute top-16 left-1/4 text-5xl opacity-25 animate-bounce" style={{ animationDuration: '3s' }}>🌸</div>
          <div className="absolute top-24 right-1/4 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3.5s' }}>🌺</div>
          <div className="absolute top-1/2 left-8 text-3xl opacity-15 animate-bounce" style={{ animationDuration: '4s' }}>🌹</div>
          <div className="absolute top-1/3 right-10 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '4.2s' }}>🌻</div>
          <div className="absolute bottom-1/3 left-1/6 text-3xl opacity-15 animate-bounce" style={{ animationDuration: '4.5s' }}>❤️</div>
          <div className="absolute bottom-1/4 right-1/6 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4.8s' }}>💕</div>
          <div className="absolute top-1/2 right-8 text-3xl opacity-15 animate-bounce" style={{ animationDuration: '5s' }}>🌷</div>
          <div className="absolute bottom-1/2 left-10 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '5.2s' }}>☘️</div>
          
          {/* 装饰星星 */}
          <div className="absolute top-1/4 right-1/3 text-2xl opacity-30 animate-pulse">✨</div>
          <div className="absolute bottom-1/3 left-1/3 text-2xl opacity-25 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
          <div className="absolute top-1/3 left-1/2 text-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute bottom-1/2 right-1/4 text-2xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
          
          {/* 底部波浪 */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 320" className="w-full h-24 opacity-15">
              <path fill="white" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,218.7C672,235,768,213,864,197.3C960,181,1056,171,1152,170.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 320" className="w-full h-16 opacity-10" style={{ marginBottom: '-8px' }}>
              <path fill="white" d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,234.7C960,235,1056,213,1152,197.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
          </div>
        </div>
        
        {/* 内容层 - 居中 */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Logo - 大且居中 */}
          <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 animate-bounce" style={{ animationDuration: '2.5s' }}>
            <span className="text-8xl">🏠</span>
          </div>
          
          {/* 欢迎文字 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              你好，张奶奶！
            </h1>
            <h2 className="text-2xl text-white/90 mb-5">
              欢迎来到暖龄圈
            </h2>
            {/* 一行的标语 - 带背景框 */}
            <div className="bg-white/25 backdrop-blur-sm rounded-2xl px-8 py-4 inline-block">
              <p className="text-xl text-white font-medium">
                让科技温暖生活，让陪伴时刻在线
              </p>
            </div>
          </div>

          {/* 进入按钮 */}
          <button
            onClick={() => setShowWelcome(false)}
            className="px-16 py-5 bg-white text-[#FF6B6B] rounded-full font-bold text-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all active:scale-95"
          >
            <SpeakableText variant="inline" size="xl" className="!text-[#FF6B6B] font-bold">
              进入暖龄圈
            </SpeakableText>
          </button>
        </div>

        {/* 底部装饰文字 */}
        <div className="absolute bottom-8 flex gap-3 z-10">
          <span className="text-4xl opacity-50">🌸</span>
          <span className="text-4xl opacity-50">❤️</span>
          <span className="text-4xl opacity-50">🌹</span>
          <span className="text-4xl opacity-50">💕</span>
          <span className="text-4xl opacity-50">🌸</span>
        </div>
      </div>
    );
  }

  // 主页面
  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-24">
      {/* 顶部问候区域 */}
      <div className="bg-gradient-to-br from-[#FF6B6B] via-[#ff8e8e] to-[#FFB347] px-4 pt-6 pb-20 rounded-b-[32px] shadow-xl">
        {/* 装饰圆形 */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute top-20 right-8 w-24 h-24 bg-white/10 rounded-full" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=张阿姨&background=FF6B6B&color=fff&size=200&font-size=0.4&rounded=true"
                alt="头像"
                className="w-16 h-16 rounded-full border-4 border-white/30 shadow-lg"
              />
              <div className="text-white">
                <SpeakableText variant="block" size="lg" className="!text-white">
                  <p className="font-bold">{getGreeting()}，张阿姨</p>
                </SpeakableText>
                <SpeakableText variant="inline" size="sm" className="!text-white/80">
                  {getDateString()}
                </SpeakableText>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center relative">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFE66D] rounded-full text-xs font-bold flex items-center justify-center text-[#FF6B6B]">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 天气卡片 */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFE66D] to-[#FFB347] rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-5xl">☀️</span>
              </div>
              <div>
                <SpeakableText variant="inline" size="xl" className="font-bold">
                  24°C
                </SpeakableText>
                <SpeakableText variant="inline" size="md" className="!text-gray-500 !block">
                  晴朗 · 空气优
                </SpeakableText>
              </div>
            </div>
            <div className="text-right">
              <SpeakableText variant="inline" size="md" className="!text-[#2ECC71]">
                适合户外活动
              </SpeakableText>
            </div>
          </div>
        </div>
      </div>

      {/* 快捷入口 - 重新设计 */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-[#4ECDC4] to-[#44a08d] rounded-lg flex items-center justify-center text-white text-sm">🎯</span>
          <SpeakableText variant="inline" size="xl">
            快捷服务
          </SpeakableText>
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-white text-center shadow-lg hover:shadow-xl transition-all active:scale-95`}
            >
              <span className="text-4xl block mb-2">{action.icon}</span>
              <span className="text-lg font-bold block">{action.label}</span>
              <span className="text-sm opacity-80">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 暖心提示 */}
      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-3xl p-5 border border-pink-100">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💝</span>
            <div>
              <SpeakableText variant="inline" size="lg" className="font-bold text-[#FF6B6B]">
                今日暖心提示
              </SpeakableText>
              <SpeakableText variant="block" size="md" className="!text-gray-600 mt-2 leading-relaxed">
                天气晴朗，适合出门散步或与老朋友聚会。记得按时吃药，多喝水，保持心情愉快！
              </SpeakableText>
            </div>
          </div>
        </div>
      </div>

      {/* 底部功能区 */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] rounded-lg flex items-center justify-center text-white text-sm">👥</span>
          <SpeakableText variant="inline" size="xl">
            暖圈动态
          </SpeakableText>
        </h2>
        
        <Link 
          href="/posts"
          className="block bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] rounded-2xl flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <div className="text-left">
                <SpeakableText variant="inline" size="xl" className="font-bold">
                  浏览动态
                </SpeakableText>
                <SpeakableText variant="block" size="md" className="!text-gray-500">
                  看看大家都在分享什么
                </SpeakableText>
              </div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </div>
        </Link>
      </div>

      {/* 品牌标语 */}
      <div className="px-4 mt-8 text-center">
        <SpeakableText variant="block" size="md" className="!text-gray-400">
          暖龄圈 · 让陪伴更有温度
        </SpeakableText>
      </div>
    </div>
  );
}
