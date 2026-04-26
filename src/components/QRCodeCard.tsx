'use client';

import { useState, useEffect } from 'react';

interface QRCodeCardProps {
  userName: string;
  price: number;
  period: string;
  onPaymentComplete?: () => void;
}

export function QRCodeCard({ userName, price, period, onPaymentComplete }: QRCodeCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // 生成包含信息的二维码URL (使用API生成)
    const data = JSON.stringify({
      type: 'vip_payment',
      user: userName,
      amount: price,
      period: period,
      time: new Date().toISOString(),
    });
    // 使用 qrserver.com API 生成二维码
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`);
  }, [userName, price, period]);

  const handleSaveImage = () => {
    // 模拟保存图片到相册
    alert('图片已保存到相册，请发送给子女扫码支付');
  };

  const handleShare = () => {
    // 模拟分享到微信
    if (navigator.share) {
      navigator.share({
        title: '暖圈VIP开通请求',
        text: `${userName}邀请您帮忙支付暖圈VIP会员（${price}元/${period}）`,
        url: window.location.href,
      });
    } else {
      alert('已复制链接，请发送给子女');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">👑</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">暖圈VIP开通</h2>
        <p className="text-gray-500 mt-2">让子女帮您支付</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">会员昵称</span>
          <span className="font-semibold">{userName}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">套餐类型</span>
          <span className="font-semibold">{period}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">支付金额</span>
          <span className="text-2xl font-bold text-[#FF6B6B]">¥{price}</span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="支付二维码" 
              className="w-48 h-48"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mb-6">
        请让子女扫描上方二维码完成支付
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleSaveImage}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          保存图片
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-3 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#ff5252] transition-colors"
        >
          发送给子女
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          支付成功后VIP权限将自动开通<br />
          如有问题请联系客服
        </p>
      </div>
    </div>
  );
}
