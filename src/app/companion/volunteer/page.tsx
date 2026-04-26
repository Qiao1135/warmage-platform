'use client';

import { useState } from 'react';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_USER, MOCK_VOLUNTEERS } from '@/lib/constants';

type RatingType = 'satisfied' | 'neutral' | 'dissatisfied' | null;

export default function VolunteerPage() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<typeof MOCK_VOLUNTEERS[0] | null>(null);
  const [showVolunteerList, setShowVolunteerList] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<RatingType>(null);
  const [isPaid, setIsPaid] = useState(false);

  const freeRemaining = MOCK_USER.weeklyFreeVolunteer - MOCK_USER.usedVolunteerThisWeek;

  const handleSelectVolunteer = (volunteer: typeof MOCK_VOLUNTEERS[0]) => {
    setSelectedVolunteer(volunteer);
    setShowVolunteerList(false);
  };

  const handleConfirm = () => {
    if (selectedVolunteer) {
      if (freeRemaining <= 0 && !isPaid) {
        const confirmed = confirm('本周免费次数已用完，需要支付5元才能预约，是否继续？');
        if (confirmed) {
          setIsPaid(true);
          setShowSuccess(true);
        }
      } else {
        setShowSuccess(true);
      }
    }
  };

  const handleCompleteCall = () => {
    setShowSuccess(false);
    setShowRating(true);
  };

  const handleRatingSubmit = () => {
    if (rating) {
      const messages: Record<string, string> = {
        satisfied: '我们会继续努力',
        neutral: '感谢您的反馈',
        dissatisfied: '对不起给您带来不好的体验',
      };
      alert(`感谢您的评价！${messages[rating]}`);
      setShowRating(false);
      setRating(null);
      setSelectedVolunteer(null);
      setIsPaid(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4ECDC4]/10 to-[#FFF9F0] pb-8">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white px-4 pt-6 pb-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => window.history.back()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">
            <SpeakableText variant="inline" size="xl" className="!text-white">
              志愿者电话陪聊
            </SpeakableText>
          </h1>
        </div>
        
        <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              {MOCK_VOLUNTEERS.slice(0, 3).map((v) => (
                <div 
                  key={v.id}
                  className="w-14 h-14 rounded-full bg-white border-3 border-white overflow-hidden shadow-lg"
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${v.name}&background=e8f5e9&color=4ECDC4&size=200&rounded=true`}
                    alt={v.name}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
            <div>
              <SpeakableText variant="inline" size="xl" className="!text-white font-bold">
                {MOCK_VOLUNTEERS.length}位志愿者
              </SpeakableText>
              <SpeakableText variant="inline" size="xl" className="!text-white bg-transparent">
                随时待命为您服务
              </SpeakableText>
            </div>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="px-4 -mt-6 space-y-5">
        {/* 免费次数 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <SpeakableText variant="inline" size="xl">
                本周剩余
              </SpeakableText>
            </h2>
            <span className="text-4xl font-bold text-[#FF6B6B]">{freeRemaining}</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-gradient-to-br from-[#FFF0F0] to-[#FFE0E0] rounded-2xl p-4 text-center">
              <SpeakableText variant="inline" size="md" className="!text-gray-500">
                免费次数
              </SpeakableText>
              <SpeakableText variant="inline" size="xl" className="!block font-bold">
                {freeRemaining}次
              </SpeakableText>
            </div>
            <div className="flex-1 bg-gradient-to-br from-[#FFF9E6] to-[#FFF0CC] rounded-2xl p-4 text-center">
              <SpeakableText variant="inline" size="md" className="!text-gray-500">
                超出费用
              </SpeakableText>
              <SpeakableText variant="inline" size="xl" className="!block font-bold text-[#F39C12]">
                ¥5/次
              </SpeakableText>
            </div>
          </div>
        </div>

        {/* 志愿者选择 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <SpeakableText variant="inline" size="xl">
              选择志愿者
            </SpeakableText>
          </h2>
          <SpeakableText variant="inline" size="lg" className="!text-gray-500 !block mb-5">
            选择您喜欢的志愿者，开始聊天
          </SpeakableText>

          {/* 已选志愿者 */}
          {selectedVolunteer && (
            <div className="bg-gradient-to-r from-[#e8f5e9] to-[#c8e6c9] rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedVolunteer.name}&background=4ECDC4&color=white&size=200&rounded=true`}
                  alt={selectedVolunteer.name}
                  className="w-16 h-16 rounded-full border-2 border-white"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <SpeakableText variant="inline" size="xl" className="font-bold">
                      {selectedVolunteer.name}
                    </SpeakableText>
                    <span className="px-2 py-1 bg-white/80 text-gray-600 text-sm rounded-full">
                      {selectedVolunteer.gender === '女' ? '👩' : '👨'} {selectedVolunteer.age}岁
                    </span>
                  </div>
                  <SpeakableText variant="inline" size="md" className="!text-gray-600">
                    {selectedVolunteer.profession}
                  </SpeakableText>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <SpeakableText variant="inline" size="md" className="!text-gray-500">
                      {selectedVolunteer.rating}
                    </SpeakableText>
                  </div>
                </div>
                <button 
                  onClick={() => setShowVolunteerList(true)}
                  className="px-4 py-2 bg-white text-[#4ECDC4] rounded-full font-medium"
                >
                  更换
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedVolunteer.specialties.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 bg-[#4ECDC4]/20 text-[#44a08d] text-sm rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 选择按钮 */}
          {!selectedVolunteer && (
            <button
              onClick={() => setShowVolunteerList(true)}
              className="w-full py-4 bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white rounded-2xl font-bold text-xl shadow-lg"
            >
              <SpeakableText variant="inline" size="xl" className="!text-white">
                选择志愿者
              </SpeakableText>
            </button>
          )}

          {/* 已选时的确认按钮 */}
          {selectedVolunteer && (
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-2xl font-bold text-xl shadow-lg mt-4"
            >
              <SpeakableText variant="inline" size="xl" className="!text-white">
                立即预约通话
              </SpeakableText>
            </button>
          )}
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 rounded-3xl p-5">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-blue-600">
            <span className="text-2xl">💡</span>
            <SpeakableText variant="inline" size="xl" className="!text-blue-600">
              温馨提示
            </SpeakableText>
          </h3>
          <ul className="text-lg text-blue-600 space-y-2">
            {[
              '预约成功后，志愿者会在30分钟内联系您',
              '通话时长约15-30分钟',
              '通话结束后请为服务评分',
              '每周可享受1次免费陪聊',
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span>
                <SpeakableText variant="inline" size="lg" className="!text-blue-600">
                  {text}
                </SpeakableText>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 志愿者列表弹窗 */}
      {showVolunteerList && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <SpeakableText variant="inline" size="xl" className="font-bold">
                选择志愿者
              </SpeakableText>
              <button 
                onClick={() => setShowVolunteerList(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {MOCK_VOLUNTEERS.map((volunteer) => (
                <button
                  key={volunteer.id}
                  onClick={() => handleSelectVolunteer(volunteer)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedVolunteer?.id === volunteer.id 
                      ? 'border-[#4ECDC4] bg-[#e8f5e9]/30' 
                      : 'border-gray-200 hover:border-[#4ECDC4]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${volunteer.name}&background=${volunteer.gender === '女' ? 'pink' : 'blue'}-100&color=333&size=200&rounded=true`}
                      alt={volunteer.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <SpeakableText variant="inline" size="xl" className="font-bold">
                          {volunteer.name}
                        </SpeakableText>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {volunteer.gender === '女' ? '👩' : '👨'} {volunteer.age}岁
                        </span>
                        <span className="text-yellow-500 text-sm">⭐ {volunteer.rating}</span>
                      </div>
                      <SpeakableText variant="inline" size="md" className="!text-gray-500">
                        {volunteer.profession}
                      </SpeakableText>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {volunteer.specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 bg-[#4ECDC4]/10 text-[#44a08d] text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <SpeakableText variant="inline" size="sm" className="!text-gray-400 !block mt-2">
                        {volunteer.intro}
                      </SpeakableText>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 预约成功弹窗 */}
      {showSuccess && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-5xl">✅</span>
            </div>
            <SpeakableText variant="block" size="2xl" className="font-bold mb-3">
              预约成功！
            </SpeakableText>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedVolunteer.name}&background=4ECDC4&color=white&size=200&rounded=true`}
                  alt={selectedVolunteer.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <SpeakableText variant="inline" size="lg" className="font-bold">
                    {selectedVolunteer.name}
                  </SpeakableText>
                  <SpeakableText variant="inline" size="md" className="!text-gray-500 !block">
                    志愿者
                  </SpeakableText>
                </div>
              </div>
              <SpeakableText variant="block" size="md" className="!text-gray-600">
                志愿者将很快拨打您的电话，请保持手机畅通~
              </SpeakableText>
            </div>
            <button
              onClick={handleCompleteCall}
              className="w-full py-4 bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white rounded-2xl font-bold text-xl"
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {/* 评分弹窗 */}
      {showRating && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <SpeakableText variant="block" size="2xl" className="font-bold mb-2">
              请为本次服务评分
            </SpeakableText>
            <SpeakableText variant="inline" size="lg" className="!text-gray-500 mb-6">
              感谢您使用志愿者陪聊服务
            </SpeakableText>
            
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setRating('satisfied')}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
                  rating === 'satisfied' ? 'bg-green-500 text-white scale-110' : 'bg-gray-100'
                }`}
              >
                <span className="text-3xl">😊</span>
                <span className="text-xs mt-1">满意</span>
              </button>
              <button
                onClick={() => setRating('neutral')}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
                  rating === 'neutral' ? 'bg-yellow-500 text-white scale-110' : 'bg-gray-100'
                }`}
              >
                <span className="text-3xl">😐</span>
                <span className="text-xs mt-1">一般</span>
              </button>
              <button
                onClick={() => setRating('dissatisfied')}
                className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all ${
                  rating === 'dissatisfied' ? 'bg-red-500 text-white scale-110' : 'bg-gray-100'
                }`}
              >
                <span className="text-3xl">😞</span>
                <span className="text-xs mt-1">不满</span>
              </button>
            </div>

            <button
              onClick={handleRatingSubmit}
              disabled={!rating}
              className={`w-full py-4 rounded-2xl font-bold text-xl ${
                rating 
                  ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              提交评价
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
