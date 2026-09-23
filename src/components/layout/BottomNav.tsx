import React from 'react';
import { Home, Trophy, Navigation, Users, User as UserIcon } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        
        {/* Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'home' ? 'text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Home</span>
        </button>

        {/* Leaderboard */}
        <button
          type="button"
          onClick={() => onTabChange('leaderboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'leaderboard' ? 'text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className={`w-5 h-5 ${currentTab === 'leaderboard' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Ranks</span>
        </button>

        {/* Central High-Priority TRACK Action */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onTabChange('track')}
            className={`w-14 h-14 rounded-full bg-[#72D600] text-slate-950 shadow-lg shadow-[#72D600]/40 flex items-center justify-center transition-transform active:scale-95 border-4 border-white ${
              currentTab === 'track' ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' : ''
            }`}
            aria-label="Track Run"
          >
            <Navigation className="w-6 h-6 fill-current stroke-[1.5px]" />
          </button>
        </div>

        {/* Run Clubs */}
        <button
          type="button"
          onClick={() => onTabChange('clubs')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'clubs' ? 'text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className={`w-5 h-5 ${currentTab === 'clubs' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Clubs</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'profile' || currentTab === 'my_runs' ? 'text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserIcon className={`w-5 h-5 ${currentTab === 'profile' || currentTab === 'my_runs' ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Profile</span>
        </button>

      </div>
    </nav>
  );
};
