'use client';

import { useState } from 'react';
import { SpeakableText } from './SpeakableText';

interface Post {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  topic: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onLike?: (id: number) => void;
  onComment?: (id: number) => void;
  onDoubleClick?: (id: number) => void;
}

export function PostCard({ post, onLike, onComment, onDoubleClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? likes + 1 : likes - 1);
    onLike?.(post.id);
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(likes + 1);
      setShowLikeAnimation(true);
      
      // 播放提示音（模拟）
      if (typeof window !== 'undefined') {
        // 使用 Web Audio API 播放简单的提示音
        try {
          const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        } catch {
          // 音频不可用，静默处理
        }
        
        // 语音播报
        const utterance = new SpeechSynthesisUtterance('收到一个赞');
        utterance.lang = 'zh-CN';
        utterance.rate = 1.2;
        speechSynthesis.speak(utterance);
      }
      
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
    onDoubleClick?.(post.id);
  };

  const getImageGridClass = () => {
    const count = post.images.length;
    if (count === 0) return '';
    if (count === 1) return 'image-grid col-1';
    if (count <= 3) return 'image-grid col-2';
    return 'image-grid col-3';
  };

  return (
    <div 
      className="post-card cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      {/* 用户信息 */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userAvatar}
          alt={post.userName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{post.userName}</span>
            <span className="px-2 py-0.5 bg-pink-50 text-pink-500 text-sm rounded-full">
              {post.topic}
            </span>
          </div>
          <span className="text-gray-400 text-sm">{post.createdAt}</span>
        </div>
      </div>

      {/* 内容 */}
      <div className="mb-3">
        <SpeakableText variant="inline" size="lg" className="leading-relaxed">
          {post.content}
        </SpeakableText>
      </div>

      {/* 图片 */}
      {post.images.length > 0 && (
        <div className={getImageGridClass()}>
          {post.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`图片${index + 1}`}
              className="w-full object-cover rounded-lg"
              style={{ maxHeight: '400px' }}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* 互动栏 */}
      <div className="flex items-center gap-8 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-lg"
        >
          <span className={showLikeAnimation ? 'like-animation' : ''}>
            {isLiked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </span>
          <span className={isLiked ? 'text-[#FF6B6B]' : 'text-gray-500'}>
            {likes}
          </span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-2 text-lg text-gray-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>{post.comments}</span>
        </button>

        <button className="flex items-center gap-2 text-lg text-gray-500 ml-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* 点赞动画 */}
      {showLikeAnimation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="#FF6B6B">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      )}
    </div>
  );
}
