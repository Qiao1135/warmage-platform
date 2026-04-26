'use client';

import { useState, useCallback, ReactNode, ReactElement } from 'react';

interface SpeakableTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'inline' | 'block';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'base';
}

// 方言选项 - 河南话
const DIALECTS = [
  { id: 'zh-CN', name: '普通话' },
  { id: 'zh-HN', name: '河南话' },
];

// 固定的SVG图标组件
function SpeakerIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function StopIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

const sizeClasses: Record<string, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  base: 'text-base',
};

const iconSizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
  '2xl': 'w-8 h-8',
  '3xl': 'w-9 h-9',
  '4xl': 'w-10 h-10',
  base: 'w-5 h-5',
};

export function SpeakableText({ children, className = '', variant = 'inline', size = 'md' }: SpeakableTextProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDialects, setShowDialects] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState('zh-CN');

  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) {
      return node.map(n => getTextContent(n)).join('');
    }
    if (node && typeof node === 'object' && 'props' in node) {
      const element = node as ReactElement;
      if (element.props && typeof element.props === 'object' && 'children' in element.props) {
        return getTextContent(element.props.children as ReactNode);
      }
    }
    return '';
  };

  const handleSpeak = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const text = getTextContent(children);
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 根据方言设置语速和音调来模拟河南话效果
    if (selectedDialect === 'zh-HN') {
      // 河南话特点：音调偏平，语速稍慢
      utterance.lang = 'zh-CN';
      utterance.rate = 0.75;  // 稍慢
      utterance.pitch = 0.9;   // 音调稍低
    } else {
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      utterance.pitch = 1;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  }, [children, isPlaying, selectedDialect]);

  if (variant === 'block') {
    return (
      <div className="relative">
        <div className={className}>
          {children}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-4 py-3 bg-[#FFF0F0] hover:bg-[#FFE0E0] rounded-full text-[#FF6B6B] transition-all active:scale-95 ${sizeClasses[size]}`}
          >
            {isPlaying ? (
              <StopIcon className={iconSizeClasses[size]} />
            ) : (
              <SpeakerIcon className={iconSizeClasses[size]} />
            )}
            <span className="font-medium">{isPlaying ? '停止' : '朗读'}</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDialects(!showDialects)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-all"
            >
              {DIALECTS.find(d => d.id === selectedDialect)?.name || '普通话'} ▼
            </button>
            
            {showDialects && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 min-w-[120px]">
                {DIALECTS.map((dialect) => (
                  <button
                    key={dialect.id}
                    onClick={() => {
                      setSelectedDialect(dialect.id);
                      setShowDialects(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      selectedDialect === dialect.id ? 'text-[#FF6B6B] font-medium' : 'text-gray-600'
                    }`}
                  >
                    {dialect.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className={sizeClasses[size]}>{children}</span>
      <span
        onClick={handleSpeak}
        role="button"
        tabIndex={0}
        className={`p-1 hover:bg-[#FFF0F0] rounded-full transition-all flex-shrink-0 cursor-pointer ${isPlaying ? 'text-[#FF6B6B] bg-[#FFF0F0]' : 'text-gray-400 hover:text-[#FF6B6B]'}`}
      >
        {isPlaying ? (
          <StopIcon className={iconSizeClasses[size]} />
        ) : (
          <SpeakerIcon className={iconSizeClasses[size]} />
        )}
      </span>
    </span>
  );
}

// 全局朗读设置Hook
export function useSpeech() {
  const speak = useCallback((text: string, dialect: string = 'zh-CN') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = dialect === 'zh-HN' ? 0.75 : 0.85;
    utterance.pitch = dialect === 'zh-HN' ? 0.9 : 1;
    speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}
