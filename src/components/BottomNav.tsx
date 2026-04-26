'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SpeakableText } from '@/components/SpeakableText';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const HomeActiveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" fill="white" />
  </svg>
);

const CompanionIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CompanionActiveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PostIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const PostActiveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" stroke="white" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="white" />
  </svg>
);

const VIPIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const VIPActiveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ProfileActiveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="white" />
    <circle cx="12" cy="7" r="4" fill="white" />
  </svg>
);

const navItems: NavItem[] = [
  { path: '/', label: '首页', icon: <HomeIcon />, activeIcon: <HomeActiveIcon /> },
  { path: '/companion', label: '暖伴', icon: <CompanionIcon />, activeIcon: <CompanionActiveIcon /> },
  { path: '/post', label: '发帖', icon: <PostIcon />, activeIcon: <PostActiveIcon /> },
  { path: '/vip', label: 'VIP', icon: <VIPIcon />, activeIcon: <VIPActiveIcon /> },
  { path: '/profile', label: '我的', icon: <ProfileIcon />, activeIcon: <ProfileActiveIcon /> },
];

export function BottomNav() {
  const pathname = usePathname();

  // 移动端底部导航
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-[80px] px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || 
            (item.path !== '/' && pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive ? 'scale-105' : ''
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-[#FF6B6B] to-[#ff8e8e] text-white shadow-lg'
                    : 'text-gray-400'
                }`}
              >
                {isActive ? item.activeIcon : item.icon}
              </div>
              <SpeakableText 
                variant="inline" 
                size="sm" 
                className={`mt-1 ${isActive ? '!text-[#FF6B6B] font-bold' : '!text-gray-400'}`}
              >
                {item.label}
              </SpeakableText>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
