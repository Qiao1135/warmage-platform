'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { SpeakableText } from '@/components/SpeakableText';
import { MOCK_USER } from '@/lib/constants';

const HOT_TOPICS = [
  { id: 1, name: '#今早的日出真美#', count: '2.3万' },
  { id: 2, name: '#老年大学的快乐时光#', count: '1.8万' },
  { id: 3, name: '#养生食谱分享#', count: '1.5万' },
  { id: 4, name: '#退休生活新体验#', count: '1.2万' },
];

const QUICK_REPLIES = [
  '太暖心了👍',
  '同感！握手🤝',
  '写的真好，赞一个！',
  '愿您每天都开心😊',
  '好温馨的画面🌹',
  '健康最重要💪',
];

// 语音识别类型声明
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function PostPage() {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isVIP] = useState(MOCK_USER.isVIP);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 检查语音识别支持
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      console.log('语音识别不支持，使用模拟模式');
    }
  }, []);

  // 停止语音识别
  const stopSpeechRecognition = useCallback(() => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    setIsRecording(false);
    setInterimText('');
  }, []);

  // 启动语音识别
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      // 不支持时模拟
      setIsRecording(true);
      setContent(prev => prev + '今天天气真好，和老姐妹们一起去公园跳舞了，心情特别舒畅...');
      setTimeout(() => setIsRecording(false), 2000);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN'; // 中文
    
    recognition.onstart = () => {
      setIsRecording(true);
      setInterimText('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }
      
      setInterimText(interim);
      
      if (finalText) {
        setContent(prev => prev + finalText);
        setInterimText('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('语音识别错误:', event.error);
      setIsRecording(false);
      setInterimText('');
      
      if (event.error === 'not-allowed') {
        alert('请允许使用麦克风以使用语音输入功能');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    recognition.start();

    // 最多录制30秒
    recordingTimerRef.current = setTimeout(() => {
      stopSpeechRecognition();
    }, 30000);
  }, [stopSpeechRecognition]);

  // 清理
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
    };
  }, []);

  const handlePublish = () => {
    if (content.trim()) {
      alert('发布成功！');
      setContent('');
      setSelectedTopic('');
    } else {
      alert('请输入内容或使用语音输入');
    }
  };

  const handleQuickReply = (reply: string) => {
    setContent(prev => prev + reply);
    setShowQuickReplies(false);
  };

  const handleSpeakContent = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.85;
        utterance.pitch = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] pb-32">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white px-4 pt-6 pb-4 rounded-b-[24px] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <SpeakableText variant="inline" size="xl" className="font-bold !text-white">
              发布动态
            </SpeakableText>
          </div>
          <button 
            onClick={handlePublish}
            className="px-5 py-2 bg-white text-[#FF6B6B] rounded-full font-bold text-lg"
          >
            发布
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 用户信息 */}
        <div className="flex items-center gap-3">
          <img 
            src={MOCK_USER.avatar} 
            alt={MOCK_USER.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#FF6B6B]"
          />
          <div>
            <SpeakableText variant="inline" size="xl" className="font-bold">
              {MOCK_USER.name}
            </SpeakableText>
            {isVIP && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                VIP
              </span>
            )}
          </div>
        </div>

        {/* 话题选择 */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowTopicPicker(!showTopicPicker)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-full"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
            <SpeakableText variant="inline" size="md">
              添加话题
            </SpeakableText>
          </button>
          
          {selectedTopic && (
            <div className="px-3 py-1 bg-[#FF6B6B] text-white rounded-full text-lg flex items-center gap-2">
              <SpeakableText variant="inline" size="md" className="!text-white">
                {selectedTopic}
              </SpeakableText>
              <button onClick={() => setSelectedTopic('')} className="ml-1">✕</button>
            </div>
          )}
        </div>

        {/* 话题列表 */}
        {showTopicPicker && (
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <SpeakableText variant="block" size="lg" className="font-bold mb-3">
              选择热门话题
            </SpeakableText>
            {HOT_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic.name);
                  setShowTopicPicker(false);
                }}
                className="block w-full text-left py-3 border-b border-gray-100 last:border-0"
              >
                <SpeakableText variant="inline" size="lg" className="text-[#FF6B6B]">
                  {topic.name}
                </SpeakableText>
                <SpeakableText variant="inline" size="md" className="!text-gray-400 !float-right">
                  {topic.count}浏览
                </SpeakableText>
              </button>
            ))}
          </div>
        )}

        {/* 内容输入 */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享您的晚年生活..."
            className="w-full h-48 text-xl leading-relaxed resize-none focus:outline-none placeholder-gray-300"
          />
          
          {/* 实时转写显示 */}
          {interimText && (
            <div className="mt-2 text-lg text-gray-400 italic">
              {interimText}
            </div>
          )}
          
          {content && (
            <button
              onClick={handleSpeakContent}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isSpeaking 
                  ? 'bg-[#4ECDC4] text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
                <path d="M15.54,8.46a5,5,0,0,1,0,7.07" />
                <path d="M19.07,4.93a10,10,0,0,1,0,14.14" />
              </svg>
              <SpeakableText variant="inline" size="md">
                {isSpeaking ? '停止播放' : '朗读内容'}
              </SpeakableText>
            </button>
          )}
        </div>

        {/* 一键暖心评论 */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💖</span>
              <SpeakableText variant="inline" size="xl" className="font-bold">
                一键暖心评论
              </SpeakableText>
            </div>
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="text-[#FF6B6B]"
            >
              {showQuickReplies ? '收起' : '展开'}
            </button>
          </div>
          
          {showQuickReplies && (
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-50 to-orange-50 text-gray-700 rounded-full text-lg hover:shadow-md transition-shadow"
                >
                  <SpeakableText variant="inline" size="md">
                    {reply}
                  </SpeakableText>
                </button>
              ))}
            </div>
          )}
          
          {!showQuickReplies && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {QUICK_REPLIES.slice(0, 3).map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-50 to-orange-50 text-gray-700 rounded-full whitespace-nowrap"
                >
                  <SpeakableText variant="inline" size="md">
                    {reply}
                  </SpeakableText>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 图片/视频/语音 */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21,15 16,10 5,21" />
                </svg>
              </div>
              <SpeakableText variant="inline" size="md" className="!text-gray-600">
                图片
              </SpeakableText>
            </button>
            
            <button className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B59B6" strokeWidth="2">
                  <polygon points="23,7 16,12 23,17 23,7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <SpeakableText variant="inline" size="md" className="!text-gray-600">
                视频
              </SpeakableText>
            </button>
            
            <button className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isRecording ? 'bg-red-100' : 'bg-red-50'}`}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                </svg>
              </div>
              <SpeakableText variant="inline" size="md" className={`${isRecording ? '!text-red-500' : '!text-gray-600'}`}>
                {isRecording ? '录音中' : '语音'}
              </SpeakableText>
            </button>
          </div>
        </div>
      </div>

      {/* 语音输入按钮 */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-6 safe-area-bottom transition-all ${isRecording ? 'bg-gradient-to-r from-[#FF6B6B]/10 to-[#ff8e8e]/10' : ''}`}>
        {isRecording ? (
          <div className="flex flex-col items-center">
            {/* 录音动画 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <SpeakableText variant="block" size="xl" className="font-bold text-red-500">
                正在说话...
              </SpeakableText>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </div>
            
            {/* 实时转写预览 */}
            {(content || interimText) && (
              <div className="w-full max-w-md bg-white rounded-2xl p-4 mb-4 shadow-md max-h-32 overflow-auto">
                <div className="text-lg text-gray-700">
                  {content}
                  {interimText && <span className="text-gray-400">{interimText}</span>}
                </div>
              </div>
            )}
            
            <button
              onClick={stopSpeechRecognition}
              className="w-20 h-20 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
            <SpeakableText variant="block" size="lg" className="!text-gray-500 mt-2">
              点击停止
            </SpeakableText>
          </div>
        ) : (
          <button
            onClick={startSpeechRecognition}
            className="w-full py-5 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e8e] text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <SpeakableText variant="inline" size="xl" className="!text-white font-bold">
              一键语音输入
            </SpeakableText>
          </button>
        )}
        
        {!speechSupported && !isRecording && (
          <div className="text-center mt-2">
            <SpeakableText variant="inline" size="sm" className="!text-gray-400">
              浏览器不支持语音识别，将使用模拟输入
            </SpeakableText>
          </div>
        )}
      </div>
    </div>
  );
}
