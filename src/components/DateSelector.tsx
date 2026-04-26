'use client';

import { useState } from 'react';

interface DateSelectorProps {
  onSelect?: (date: Date) => void;
  disabled?: boolean;
}

// 固定的时间映射，避免在渲染中使用 Math.random
const TIME_SLOTS = [
  '下午3:00',
  '下午4:00',
  '下午2:00',
  '上午10:00',
  '下午5:00',
  '上午9:00',
  '下午3:00',
];

export function DateSelector({ onSelect, disabled = false }: DateSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [randomSeed] = useState(() => Math.floor(Math.random() * 7));

  const getDateLabel = (daysFromNow: number) => {
    if (daysFromNow === 0) return '今天';
    if (daysFromNow === 1) return '明天';
    if (daysFromNow === 2) return '后天';
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getTimeSlot = (index: number) => {
    return TIME_SLOTS[(index + randomSeed) % 7];
  };

  const handleSelect = (index: number) => {
    if (disabled) return;
    setSelectedIndex(index);
    const date = new Date();
    date.setDate(date.getDate() + index);
    onSelect?.(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {[0, 1, 2].map((index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={index}
              className={`btn-date ${isSelected ? 'selected' : ''} ${disabled ? 'opacity-50' : ''}`}
              onClick={() => handleSelect(index)}
              disabled={disabled}
            >
              <div>{getDateLabel(index)}</div>
              <div className="text-sm font-normal mt-1 opacity-80">
                {getTimeSlot(index)}
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedIndex !== null && (
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-[#2ECC71] text-lg">
            ✓ 已预约 {getDateLabel(selectedIndex)} {getTimeSlot(selectedIndex)} 的志愿者陪聊
          </p>
          <p className="text-gray-500 text-sm mt-2">
            预约时间到达前30分钟会发送短信提醒您
          </p>
        </div>
      )}
    </div>
  );
}
