import React from 'react';
import { 
  Play, 
  Navigation, 
  Trophy, 
  Flame, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import { User, CityData, RunClub, Activity } from '../../types';
import { db } from '../../services/db';
import { formatDuration, formatPace } from '../../services/gps';
import { RunFamLogo } from '../common/RunFamLogo';
import { WeeklyRunningChart } from '../charts/WeeklyRunningChart';

interface HomeDashboardProps {
  currentUser: User;
  cityData: CityData;
  recentActivities: Activity[];
  onStartRun: () => void;
  onNavigate: (tab: string, meta?: any) => void;
  onToggleKudos: (activityId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentUser,
  cityData,
  recentActivities,
  onStartRun,
  onNavigate,
  onToggleKudos,
}) => {
  const primaryClub = currentUser.primaryClubId
    ? db.getClubById(currentUser.primaryClubId)
    : null;

  // Real dynamic user stats calculated from verified activities
  const userVerifiedActivities = db
    .getActivities({ userId: currentUser.id })
    .filter((a) => a.verificationStatus === 'verified');

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // If user has activities, calculate real values from database
  const computedWeekDistance = userVerifiedActivities.length > 0
    ? userVerifiedActivities
        .filter((a) => new Date(a.startTime).getTime() >= sevenDaysAgo)
        .reduce((sum, a) => sum + a.distanceKm, 0)
    : currentUser.weekDistanceKm;

  const computedMonthDistance = userVerifiedActivities.length > 0
    ? userVerifiedActivities
        .filter((a) => {
          const d = new Date(a.startTime);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, a) => sum + a.distanceKm, 0)
    : currentUser.monthDistanceKm;

  const computedLongestRun = userVerifiedActivities.length > 0
    ? userVerifiedActivities.reduce((max, a) => Math.max(max, a.distanceKm), 0)
    : currentUser.longestRunKm;

  const totalRunsCount = userVerifiedActivities.length > 0 ? userVerifiedActivities.length : currentUser.totalRuns;

  // Dynamic City Rank calculation
  const allCityUsers = db.getUsers().filter((u) => !u.isSuspended);
  const sortedByMonth = [...allCityUsers].sort((a, b) => b.monthDistanceKm - a.monthDistanceKm);
  const userRankIdx = sortedByMonth.findIndex((u) => u.id === currentUser.id);
  const calculatedCityRank = userRankIdx !== -1 ? userRankIdx + 1 : currentUser.cityRank;

  const hasNoActivities = totalRunsCount === 0 && userVerifiedActivities.length === 0;

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const percentCityGoal = Math.min(
    100,
    Math.round((cityData.currentMonthProgressKm / cityData.monthlyGoalKm) * 100)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* 1. Header Greeting & Quick Profile Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {currentUser.cityName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            {getGreeting()}, {currentUser.name.split(' ')[0]}.
          </h1>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{currentUser.streakDays} Day Streak</span>
        </div>
      </div>

      {/* 2. Primary Mobile CTA: START RUN or FIRST RUN WAITING */}
      {hasNoActivities ? (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800 animate-in fade-in-50">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/20 text-[#72D600] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#72D600] animate-ping" />
                <span>Begin Your Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                YOUR FIRST RUN IS WAITING 🏃
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                Every verified kilometer pushes you onto the {currentUser.cityName} leaderboard and fuels your crew.
              </p>
            </div>

            <button
              type="button"
              onClick={onStartRun}
              className="h-14 px-8 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/30 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START RUN</span>
            </button>
          </div>

          <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none">
            <RunFamLogo variant="icon" size="xl" darkTheme />
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 shadow-xl border border-slate-800">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#72D600] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-[#72D600] animate-ping" />
                <span>Ready for Today's Miles?</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                YOUR RUN. YOUR CREW. YOUR CITY.
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                GPS tracked road, trail, or track run. All kilometers contribute to {cityData.name}.
              </p>
            </div>

            <button
              type="button"
              onClick={onStartRun}
              className="h-14 px-8 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/30 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START RUN</span>
            </button>
          </div>

          {/* Subtle decorative background vector mark */}
          <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none">
            <RunFamLogo variant="icon" size="xl" darkTheme />
          </div>
        </div>
      )}

      {/* 3. Core Stats Grid (Weekly Distance, City Rank, Month Total) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Weekly Distance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            This Week
          </span>
          <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 font-mono tabular-nums mt-1">
            {computedWeekDistance.toFixed(1)} <span className="text-xs font-normal text-slate-500">KM</span>
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> {hasNoActivities ? 'Ready to Start' : 'On Track'}
          </span>
        </div>

        {/* City Rank */}
        <button
          onClick={() => onNavigate('leaderboard')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center hover:border-slate-300 transition-colors cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            City Rank
          </span>
          <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 font-mono tabular-nums mt-1">
            #{calculatedCityRank}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            of {cityData.totalRunnersCount} runners
          </span>
        </button>

        {/* Month Total */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            This Month
          </span>
          <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 font-mono tabular-nums mt-1">
            {computedMonthDistance.toFixed(1)} <span className="text-xs font-normal text-slate-500">KM</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            {totalRunsCount} {totalRunsCount === 1 ? 'total run' : 'total runs'}
          </span>
        </div>

        {/* Longest Run */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Longest Run
          </span>
          <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 font-mono tabular-nums mt-1">
            {computedLongestRun.toFixed(1)} <span className="text-xs font-normal text-slate-500">KM</span>
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Personal Best
          </span>
        </div>
      </div>

      {/* Weekly Running Distance Trends (Recharts) */}
      <WeeklyRunningChart
        currentUser={currentUser}
        compact={true}
        onViewAllRuns={() => onNavigate('my_runs')}
        title="Weekly Running Distance & Rhythm"
      />

      {/* 4. Your Fam Card (Primary Run Club) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-lime-100 text-[#529d00]">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="font-display font-black text-sm text-slate-900 uppercase tracking-wider">
              Your Fam
            </h3>
          </div>

          <button
            onClick={() => onNavigate('clubs')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <span>All Clubs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {primaryClub ? (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-base text-slate-900">
                  {primaryClub.name}
                </h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Rank #{primaryClub.clubRank}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                📍 {primaryClub.neighborhood} · {primaryClub.activeMembersCount} active runners
              </p>
              <p className="text-xs text-slate-700 font-medium mt-1">
                This month:{' '}
                <strong className="text-slate-900">{primaryClub.monthlyDistanceKm.toFixed(0)} KM</strong>{' '}
                · Your contribution:{' '}
                <strong className="text-[#529d00]">{currentUser.monthDistanceKm.toFixed(1)} KM</strong>
              </p>
            </div>

            <button
              onClick={() => onNavigate('club_detail', { clubId: primaryClub.id })}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shrink-0"
            >
              Club Space
            </button>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <h4 className="font-display font-black text-slate-900 text-base">
              FIND YOUR FAM
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Running with a crew builds camaraderie and unlocks club leaderboards in {currentUser.cityName}.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('clubs')}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-xs transition-all shadow-sm cursor-pointer"
              >
                JOIN A RUN CLUB
              </button>
              <button
                type="button"
                onClick={() => onNavigate('clubs')}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs transition-all cursor-pointer"
              >
                CREATE A RUN CLUB
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. City Pulse: Chhatrapati Sambhajinagar Live Counter */}
      <button
        onClick={() => onNavigate('city')}
        className="w-full text-left bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-5 shadow-lg border border-slate-800 hover:border-slate-700 transition-all group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#72D600]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              City Pulse: {cityData.name}
            </span>
          </div>
          <span className="text-xs font-bold text-[#72D600] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View City</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <p className="text-sm text-slate-300">
          Sambhajinagar has logged{' '}
          <strong className="text-white font-mono">{cityData.currentMonthProgressKm.toLocaleString()} KM</strong>{' '}
          toward the 100,000 KM threshold.
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#72D600] rounded-full transition-all duration-700"
            style={{ width: `${percentCityGoal}%` }}
          />
        </div>
      </button>

      {/* 6. Recent Community Activities */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-sm text-slate-900 uppercase tracking-wider">
            Recent Community Runs
          </h3>
          <button
            onClick={() => onNavigate('social')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <span>Community Feed</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recentActivities.slice(0, 3).map((act) => {
            const hasKudos = act.kudosUserIds.includes(currentUser.id);
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{act.userName}</p>
                      <p className="text-[10px] text-slate-500">
                        {act.clubName || 'Independent'} · {act.cityName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-sm font-display font-bold text-slate-900">
                  {act.title}
                </p>

                {/* Quick Run metrics */}
                <div className="flex items-center gap-4 mt-2 py-2 px-3 rounded-xl bg-slate-50 text-xs font-mono text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Distance</span>
                    <strong className="text-slate-900 font-bold">{act.distanceKm.toFixed(2)} KM</strong>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Pace</span>
                    <strong className="text-slate-900 font-bold">{formatPace(act.avgPaceSecondsPerKm)}/km</strong>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Time</span>
                    <strong className="text-slate-900 font-bold">{formatDuration(act.durationSeconds)}</strong>
                  </div>
                </div>

                {/* Kudos & Comments bar */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <button
                    onClick={() => onToggleKudos(act.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      hasKudos
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasKudos ? 'fill-current text-rose-500' : ''}`} />
                    <span>{act.kudosUserIds.length} Kudos</span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {act.verificationStatus === 'verified' ? '✓ Verified GPS' : 'Under Review'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
