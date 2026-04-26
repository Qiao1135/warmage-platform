'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_USER, AI_TOPICS } from '@/lib/constants';

// 语音识别类型声明
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }
}

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      content: '您好呀！我是您的AI陪聊助手，叫我小暖就好~今天过得怎么样？有什么想聊的吗？',
      timestamp: new Date(),
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMinutes, setChatMinutes] = useState(MOCK_USER.freeChatMinutes);
  const [totalChatTime, setTotalChatTime] = useState(0);
  const [showRestReminder, setShowRestReminder] = useState(false);
  const [showUpgradeTip, setShowUpgradeTip] = useState(false);
  const [interimText, setInterimText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(1);
  const conversationHistoryRef = useRef<{ role: string; content: string }[]>([]);

  // 预定义的语音转文字结果
  const voiceTexts = useMemo(() => [
    '今天天气真好，心情不错！',
    '我昨天去公园跳舞了，和老姐妹们玩得很开心',
    '最近膝盖有点不舒服，想问问有什么缓解的办法',
    '我孙子今天要来看我，好期待啊！',
    '今天想聊聊天，打发一下时间',
    '我的血压最近有点高，要注意什么',
    '分享一下我年轻时候的故事',
    '最近学了一道新菜，做给家里人吃',
  ], []);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, scrollToBottom]);

  // 发送消息给AI
  const sendToAI = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      // 将用户消息添加到历史
      conversationHistoryRef.current.push({ role: 'user', content: userMessage });
      
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: conversationHistoryRef.current,
          userName: MOCK_USER.name
        }),
      });

      const data = await response.json();
      
      if (data.success && data.content) {
        // 将AI回复添加到历史
        conversationHistoryRef.current.push({ role: 'assistant', content: data.content });
        
        messageIdCounter.current++;
        const aiReply: Message = {
          id: messageIdCounter.current,
          role: 'ai',
          content: data.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiReply]);
      } else {
        throw new Error(data.error || 'AI回复失败');
      }
    } catch (error) {
      console.error('AI对话错误:', error);
      messageIdCounter.current++;
      const errorReply: Message = {
        id: messageIdCounter.current,
        role: 'ai',
        content: '抱歉，网络有点问题，请稍后再试试~ 🙏',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  // 发送用户消息
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    messageIdCounter.current++;
    const userMessage: Message = {
      id: messageIdCounter.current,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // 发送到AI
    sendToAI(text);

    // 更新聊天时长
    setTotalChatTime((prev) => {
      const newTime = prev + 1;
      if (newTime === 30) {
        setShowRestReminder(true);
      }
      return newTime;
    });

    // 非VIP用户扣减时长
    if (!MOCK_USER.isVIP) {
      setChatMinutes((prev) => {
        const newMinutes = Math.max(0, prev - 1);
        if (newMinutes <= 0) {
          setShowUpgradeTip(true);
        }
        return newMinutes;
      });
    }
  };

  // 获取下一条语音转文字内容
  const getNextVoiceText = () => {
    const index = totalChatTime % voiceTexts.length;
    return voiceTexts[index];
  };

  // 录音相关
  const handleRecordStart = () => {
    setIsRecording(true);
  };

  const handleRecordEnd = () => {
    setIsRecording(false);
    const text = getNextVoiceText();
    handleSendMessage(text);
  };

  // 快速话题
  const handleQuickTopic = (topic: string) => {
    const topicTexts: Record<string, string> = {
      '往事回忆': '我想聊聊年轻时候的事情，那时候日子虽然苦，但也有很多美好的回忆...',
      '健康咨询': '最近总觉得睡眠不太好，有什么养生建议吗？',
      '兴趣爱好': '我最近在学摄影，想把生活中的美好都记录下来',
      '家庭琐事': '我儿子工作太忙了，都没时间回家看看...',
    };
    handleSendMessage(topicTexts[topic] || topic);
  };

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      // 模拟模式
      setIsListening(true);
      setInterimText('正在听...');
      setTimeout(() => {
        const text = getNextVoiceText();
        handleSendMessage(text);
        setIsListening(false);
        setInterimText('');
      }, 2000);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      setInterimText('正在听...');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim || '正在听...');
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognition.onend = () => {
      if (finalTranscript) {
        handleSendMessage(finalTranscript);
      }
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimText('');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white px-4 pt-6 pb-4 rounded-b-[24px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <div>
              <SpeakableText variant="inline" size="xl" className="font-bold !text-white">
                AI陪聊
              </SpeakableText>
              <SpeakableText variant="inline" size="md" className="!text-white/70 !block">
                {MOCK_USER.isVIP ? 'VIP会员 · 不限时长' : `剩余 ${chatMinutes} 分钟`}
              </SpeakableText>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-auto py-4 px-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[85%] ${message.role === 'user' ? 'bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]' : 'bg-white border border-gray-200'} rounded-3xl px-5 py-4 shadow-sm`}
            >
              <SpeakableText variant="inline" size="lg" className={message.role === 'ai' ? 'text-gray-800' : 'text-gray-800'}>
                {message.content}
              </SpeakableText>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-3xl px-5 py-4 shadow-sm">
              <div className="flex gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        {interimText && !isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl px-4 py-2 text-gray-500 italic">
              {interimText}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 快速话题 */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <SpeakableText variant="inline" size="md" className="!text-gray-500 !block mb-3">
          想聊什么？
        </SpeakableText>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {AI_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleQuickTopic(topic)}
              className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 whitespace-nowrap hover:bg-gray-200 transition-colors"
            >
              <SpeakableText variant="inline" size="md">
                {topic}
              </SpeakableText>
            </button>
          ))}
        </div>
      </div>

      {/* 录音按钮 */}
      <div className="bg-white border-t border-gray-100 px-4 py-6 safe-area-bottom">
        <div className="flex items-center justify-center">
          <button
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] scale-110 animate-pulse' 
                : chatMinutes <= 0 && !MOCK_USER.isVIP
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] hover:shadow-lg'
            }`}
            onClick={isListening ? stopListening : startListening}
            disabled={chatMinutes <= 0 && !MOCK_USER.isVIP}
          >
            {isListening ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            )}
          </button>
        </div>
        <SpeakableText variant="block" size="md" className={`!text-center !mt-3 ${isListening ? 'text-[#FF6B6B] font-bold' : '!text-gray-500'}`}>
          {isListening ? '正在聆听，点击停止' : '长按说话，或点击开始聊天'}
        </SpeakableText>
      </div>

      {/* 时长不足提示 */}
      {showUpgradeTip && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">⏰</span>
              </div>
              <SpeakableText variant="block" size="2xl" className="font-bold mb-3">
                今日免费时长已用完
              </SpeakableText>
              <SpeakableText variant="block" size="lg" className="!text-gray-500 mb-6">
                开通VIP会员，即可享受不限时长的AI陪聊服务
              </SpeakableText>
              <button 
                onClick={() => window.location.href = '/vip'}
                className="w-full py-4 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-2xl font-bold text-xl mb-3"
              >
                开通VIP
              </button>
              <button 
                onClick={() => setShowUpgradeTip(false)}
                className="w-full py-3 text-gray-500"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 休息提醒 */}
      {showRestReminder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">☕</span>
              </div>
              <SpeakableText variant="block" size="2xl" className="font-bold mb-3">
                休息一下吧
              </SpeakableText>
              <SpeakableText variant="block" size="lg" className="!text-gray-500 mb-6">
                您已经聊了很久，去喝口水、活动活动肩膀吧~
              </SpeakableText>
              <button 
                onClick={() => setShowRestReminder(false)}
                className="w-full py-4 bg-gradient-to-r from-[#4ECDC4] to-[#44a08d] text-white rounded-2xl font-bold text-xl mb-3"
              >
                继续聊天
              </button>
              <button 
                onClick={() => {
                  setShowRestReminder(false);
                  window.history.back();
                }}
                className="w-full py-3 text-gray-500"
              >
                稍后再说
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
