'use client';

interface VIPCardProps {
  isVIP: boolean;
  expireDate?: string;
  onUpgrade?: () => void;
}

export function VIPCard({ isVIP, expireDate, onUpgrade }: VIPCardProps) {
  if (!isVIP) {
    return (
      <div 
        className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onUpgrade}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-2xl">👑</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-700">开通VIP会员</h3>
            <p className="text-gray-500">解锁全部功能，享受更多权益</p>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="vip-card">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">👑</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">VIP会员</h3>
            <span className="px-2 py-0.5 bg-yellow-300 text-yellow-800 text-xs rounded-full font-medium">
              ACTIVE
            </span>
          </div>
          <p className="opacity-90 mt-1">
            到期时间: {expireDate || '永久有效'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <h4 className="font-semibold mb-2">VIP特权</h4>
        <ul className="space-y-2 text-sm opacity-90">
          <li className="flex items-center gap-2">
            <span>✓</span>
            <span>AI陪聊不限时长</span>
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span>
            <span>详细子女周报</span>
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span>
            <span>个性化语音推送</span>
          </li>
          <li className="flex items-center gap-2">
            <span>✓</span>
            <span>专属语音风格定制</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
