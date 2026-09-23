import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Flame, 
  Bell, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut,
  ChevronDown,
  Layers
} from 'lucide-react';
import { RunFamLogo } from '../common/RunFamLogo';
import { User, CityData, NotificationItem } from '../../types';
import { db } from '../../services/db';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User | null;
  cityData: CityData;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  notifications: NotificationItem[];
  onSwitchUser: (userId: string) => void;
  onLogout?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignUp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  cityData,
  onOpenAuth,
  onOpenNotifications,
  notifications,
  onSwitchUser,
  onLogout,
  onNavigateToLogin,
  onNavigateToSignUp,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const allUsers = db.getUsers();

  const navLinks = currentUser ? [
    { id: 'home', label: 'Home' },
    { id: 'my_runs', label: 'My Runs' },
    { id: 'track', label: 'Track' },
    { id: 'clubs', label: 'Run Clubs' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'city', label: 'Your City' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'social', label: 'Community' },
  ] : [
    { id: 'landing', label: 'Explore' },
    { id: 'clubs', label: 'Run Clubs' },
    { id: 'city', label: 'City Collective' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Official RunFam logo) */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
        >
          <RunFamLogo variant="compact" size="md" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#72D600] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (City Pill, Notifications, User Switcher/Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Active City indicator */}
          <button
            onClick={() => onTabChange('city')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#65C800]" />
            <span className="truncate max-w-[140px]">{cityData.name}</span>
          </button>

          {/* Notifications bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#72D600] ring-2 ring-white" />
            )}
          </button>

          {/* Unauthenticated Actions (Log In / Join) */}
          {!currentUser ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToLogin || onOpenAuth}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                LOG IN
              </button>
              <button
                type="button"
                onClick={onNavigateToSignUp || onOpenAuth}
                className="px-4 py-2 rounded-xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-xs shadow-sm transition-all"
              >
                JOIN RUNFAM
              </button>
            </div>
          ) : (
            <>
              {/* Quick Track Run Button on Desktop */}
              <button
                onClick={() => onTabChange('track')}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-bold text-xs shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5 fill-current" />
                <span>START RUN</span>
              </button>

              {/* User Profile / Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition-colors"
                >
                  <div className="flex flex-col text-right leading-none hidden xl:block">
                    <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentUser.monthDistanceKm.toFixed(1)} KM
                    </span>
                  </div>
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                      <p className="text-slate-500 font-mono">@{currentUser.username}</p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50 text-[11px] text-slate-600">
                        <span>Rank <strong className="text-slate-900">#{currentUser.cityRank}</strong></span>
                        <span>·</span>
                        <span>Streak <strong className="text-slate-900">🔥 {currentUser.streakDays}d</strong></span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onTabChange('profile');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium text-slate-700"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>My Profile & Stats</span>
                      </button>

                      <button
                        onClick={() => {
                          onTabChange('my_runs');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium text-slate-700"
                      >
                        <Layers className="w-4 h-4 text-[#529d00]" />
                        <span>My Runs & History</span>
                      </button>

                      {(currentUser.isAdmin || currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'MODERATOR') && (
                        <button
                          onClick={() => {
                            onTabChange('admin');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium text-slate-700"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#65C800]" />
                          <span>Admin & Moderation Console</span>
                        </button>
                      )}
                    </div>

                    {/* Quick Persona Switcher for Evaluation */}
                    <div className="border-t border-slate-100 pt-2 px-4 pb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Switch Test Runner
                      </p>
                      <div className="space-y-1">
                        {allUsers.slice(0, 5).map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u.id);
                              setShowUserDropdown(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs ${
                              u.id === currentUser.id
                                ? 'bg-lime-50 text-[#529d00] font-bold'
                                : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="font-mono text-[10px]">{u.monthDistanceKm.toFixed(1)}k</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          if (onLogout) {
                            onLogout();
                          } else {
                            onOpenAuth();
                          }
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 flex items-center gap-2 font-medium text-rose-600"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out / Switch Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
