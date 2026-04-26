'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface RecordButtonProps {
  onRecordStart?: () => void;
  onRecordEnd?: (audioBlob?: Blob) => void;
  maxDuration?: number;
  disabled?: boolean;
}

export function RecordButton({ 
  onRecordStart, 
  onRecordEnd, 
  maxDuration = 60,
  disabled = false 
}: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(32).fill(4));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 清理函数
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setWaveHeights(Array(32).fill(4));
  }, []);

  // 振动反馈
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  // 开始录音
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // 设置音频分析
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // 设置录音
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordEnd?.(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      vibrate(50);
      onRecordStart?.();

      // 开始计时
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= maxDuration) {
            // 使用 ref 来跟踪停止函数
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
            vibrate(30);
            cleanup();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // 开始波形动画
      const updateWave = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          const heights = Array.from(dataArray).slice(0, 32).map((value) => {
            const normalized = value / 255;
            return 4 + normalized * 96; // 4px - 100px
          });
          
          setWaveHeights(heights.length > 0 ? heights : Array(32).fill(4));
        }
        animationFrameRef.current = requestAnimationFrame(updateWave);
      };
      updateWave();

    } catch (error) {
      console.error('录音失败:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  }, [maxDuration, onRecordEnd, onRecordStart, vibrate, cleanup]);

  // 停止录音
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    vibrate(30);
    cleanup();
  }, [cleanup, vibrate]);

  // 长按/触摸开始
  const handleStart = useCallback(() => {
    if (disabled) return;
    startRecording();
  }, [disabled, startRecording]);

  // 松开/触摸结束
  const handleEnd = useCallback(() => {
    if (isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 清理副作用
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 音量波形 */}
      <div className="volume-wave">
        {waveHeights.map((height, index) => (
          <div
            key={index}
            className="wave-bar"
            style={{ height: isRecording ? `${height}px` : '4px' }}
          />
        ))}
      </div>

      {/* 录音时长 */}
      {isRecording && (
        <div className="text-center">
          <span className="recording-hint flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            正在录音
          </span>
          <p className="text-2xl font-bold mt-2 text-[#FF6B6B]">
            {formatTime(duration)} / {formatTime(maxDuration)}
          </p>
        </div>
      )}

      {/* 录音按钮 */}
      <button
        className={`btn-record ${isRecording ? 'recording' : ''} ${disabled ? 'opacity-50' : ''}`}
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
        disabled={disabled}
      >
        {isRecording ? (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" />
            <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" />
            <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" />
          </svg>
        )}
      </button>

      {/* 提示文字 */}
      <p className="text-gray-500 text-lg">
        {isRecording ? '松开手指结束录音' : '长按麦克风开始说话'}
      </p>
    </div>
  );
}
