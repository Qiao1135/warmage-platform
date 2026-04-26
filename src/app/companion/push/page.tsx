'use client';

import { useState } from 'react';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_USER } from '@/lib/constants';

interface SettingToggleProps { 
  title: string; 
  description: string; 
  value: boolean; 
  onToggle: () => void; 
  disabled?: boolean;
  isVipOnly?: boolean;
}

function SettingToggle({ 
  title, 
  description, 
  value, 
  onToggle, 
  disabled = false,
  isVipOnly = false 
}: SettingToggleProps) {
  return (
    <div className={`flex items-center justify-between py-4 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <SpeakableText variant="inline" size="lg" className="font-medium">
            {title}
          </SpeakableText>
          {isVipOnly && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              VIP
            </span>
          )}
        </div>
        <SpeakableText variant="inline" size="md" className="!text-gray-500 !block mt-1">
          {description}
        </SpeakableText>
      </div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-16 h-10 rounded-full transition-colors ${
          value ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44a08d]' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform ${
            value ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function PushPage() {
  const [pushSettings, setPushSettings] = useState({
    dailyReminder: true,
    weatherPush: true,
    healthReminder: true,
    activityReminder: false,
    familyNotify: false,
  });

  const [reminderTime, setReminderTime] = useState('08:00');
  const [weatherCity, setWeatherCity] = useState('郑州');
  const [isVIP] = useState(MOCK_USER.isVIP);

  const toggleSetting = (key: keyof typeof pushSettings) => {
    if (!isVIP && (key === 'activityReminder' || key === 'familyNotify')) {
      return;
    }
    setPushSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-8">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white px-4 pt-6 pb-10 rounded-b-[32px]">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => window.history.back()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <SpeakableText variant="inline" size="2xl" className="font-bold !text-white">
            暖心推送设置
          </SpeakableText>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔔</span>
          <SpeakableText variant="inline" size="lg" className="!text-white/80">
            每天准时送达的温暖问候
          </SpeakableText>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* 推送开关 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <SpeakableText variant="inline" size="xl">
              推送开关
            </SpeakableText>
          </h2>
          
          <div className="border-t border-gray-100 mt-2">
            <SettingToggle
              title="每日暖心问候"
              description="每天早8点发送温馨问候"
              value={pushSettings.dailyReminder}
              onToggle={() => toggleSetting('dailyReminder')}
            />
            
            <SettingToggle
              title="天气提醒"
              description={`${weatherCity}天气变化及时通知`}
              value={pushSettings.weatherPush}
              onToggle={() => toggleSetting('weatherPush')}
            />
            
            <SettingToggle
              title="健康提醒"
              description="按时喝水、活动提醒"
              value={pushSettings.healthReminder}
              onToggle={() => toggleSetting('healthReminder')}
            />
            
            <SettingToggle
              title="活动通知"
              description="社区活动第一时间知道"
              value={pushSettings.activityReminder}
              onToggle={() => toggleSetting('activityReminder')}
              disabled={!isVIP}
              isVipOnly={true}
            />
            
            <SettingToggle
              title="子女通知"
              description="异常情况自动通知子女"
              value={pushSettings.familyNotify}
              onToggle={() => toggleSetting('familyNotify')}
              disabled={!isVIP}
              isVipOnly={true}
            />
          </div>
        </div>

        {/* 提醒时间 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <SpeakableText variant="inline" size="xl">
              提醒时间
            </SpeakableText>
          </h2>
          
          <div className="flex items-center gap-4">
            <SpeakableText variant="inline" size="lg" className="!text-gray-600">
              每日暖心问候时间：
            </SpeakableText>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-[#4ECDC4] rounded-2xl text-xl text-center font-bold focus:outline-none focus:border-[#44a08d]"
            />
          </div>
          
          <div className="mt-4 flex gap-2">
            {(['07:00', '08:00', '09:00'] as const).map((time) => (
              <button
                key={time}
                onClick={() => setReminderTime(time)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                  reminderTime === time
                    ? 'bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <SpeakableText variant="inline" size="md">
                  {time}
                </SpeakableText>
              </button>
            ))}
          </div>
        </div>

        {/* 天气城市 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">🌤️</span>
            <SpeakableText variant="inline" size="xl">
              天气推送城市
            </SpeakableText>
          </h2>
          
          <div className="flex items-center gap-4">
            <SpeakableText variant="inline" size="lg" className="!text-gray-600">
              当前城市：
            </SpeakableText>
            <select
              value={weatherCity}
              onChange={(e) => setWeatherCity(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-[#4ECDC4] rounded-2xl text-xl font-bold focus:outline-none focus:border-[#44a08d] bg-white"
            >
              {['郑州', '北京', '上海', '广州', '深圳', '杭州', '武汉', '西安'].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 预览 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <SpeakableText variant="inline" size="xl">
              推送预览
            </SpeakableText>
          </h2>
          
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">☀️</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <SpeakableText variant="inline" size="lg" className="font-bold">
                    暖圈
                  </SpeakableText>
                  <span className="px-2 py-1 bg-[#FF6B6B] text-white text-xs rounded-full">官方</span>
                </div>
                <SpeakableText variant="block" size="md" className="!text-gray-700 leading-relaxed">
                  早上好呀，张阿姨！🌹 今天{weatherCity}天气晴朗，气温15-26°C，适合出门散步。记得吃早餐哦，健康每一天！
                </SpeakableText>
              </div>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <button className="w-full py-4 bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
          <SpeakableText variant="inline" size="xl" className="!text-white font-bold">
            保存设置
          </SpeakableText>
        </button>
      </div>
    </div>
  );
}
