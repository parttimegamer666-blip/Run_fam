import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Calendar, 
  Medal,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { LeaderboardPeriod, LeaderboardMetric, User, CityData } from '../../types';
import { db } from '../../services/db';

interface CityLeaderboardProps {
  currentUser: User;
  cityData: CityData;
  onSelectUser?: (userId: string) => void;
  onSelectClub?: (clubId: string) => void;
}

export const CityLeaderboard: React.FC<CityLeaderboardProps> = ({
  currentUser,
  cityData,
  onSelectUser,
  onSelectClub,
}) => {
  const [boardType, setBoardType] = useState<'individual' | 'club'>('individual');
  const [period, setPeriod] = useState<LeaderboardPeriod>('month');
  const [metric, setMetric] = useState<LeaderboardMetric>('distance');

  const individualEntries = db.getIndividualLeaderboard(period, metric);
  const clubEntries = db.getClubLeaderboard(period);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-slate-950 font-black shadow-sm';
    if (rank === 2) return 'bg-slate-300 text-slate-900 font-bold';
    if (rank === 3) return 'bg-amber-600 text-white font-bold';
    return 'bg-slate-100 text-slate-700 font-semibold';
  };

  const renderMovement = (rank: number, prevRank: number) => {
    const diff = prevRank - rank;
    if (diff > 0) {
      return (
        <span className="flex items-center text-[10px] font-bold text-emerald-600">
          <ArrowUp className="w-3 h-3" />
          <span>{diff}</span>
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="flex items-center text-[10px] font-bold text-rose-500">
          <ArrowDown className="w-3 h-3" />
          <span>{Math.abs(diff)}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center text-[10px] text-slate-400">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#59ab02]">
          City Rankings
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          {cityData.name.toUpperCase()}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified GPS running performance. Walking and non-running sports are strictly excluded.
        </p>
      </div>

      {/* Board Type Switcher (Individual vs Run Club) */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl max-w-sm">
        <button
          onClick={() => setBoardType('individual')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            boardType === 'individual'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Individual Runners
        </button>
        <button
          onClick={() => setBoardType('club')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            boardType === 'club'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Run Clubs
        </button>
      </div>

      {/* Filter Controls: Period & Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm text-xs">
        
        {/* Period Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['today', 'week', 'month', 'year', 'all_time'] as LeaderboardPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-colors whitespace-nowrap ${
                period === p
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p === 'all_time' ? 'All Time' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : p === 'year' ? 'This Year' : 'Today'}
            </button>
          ))}
        </div>

        {/* Metric Selector (Only applicable for Individual) */}
        {boardType === 'individual' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Metric:</span>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as LeaderboardMetric)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-medium text-slate-800 focus:border-[#72D600]"
            >
              <option value="distance">Distance (KM)</option>
              <option value="active_days">Streak / Active Days</option>
              <option value="longest_run">Longest Single Run</option>
            </select>
          </div>
        )}
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 px-5 py-3 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
          <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
          <div className="col-span-7 sm:col-span-8">
            {boardType === 'individual' ? 'Runner & Fam' : 'Run Club & Area'}
          </div>
          <div className="col-span-3 text-right">
            {boardType === 'individual' ? metric.replace('_', ' ').toUpperCase() : 'TOTAL KM'}
          </div>
        </div>

        {/* Individual Entries */}
        {boardType === 'individual' && (
          <div className="divide-y divide-slate-100">
            {individualEntries.map((entry) => {
              const isCurrentUser = entry.id === currentUser.id;

              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 items-center px-5 py-3.5 text-xs transition-colors ${
                    isCurrentUser ? 'bg-lime-50/70 border-l-4 border-l-[#72D600]' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Rank with movement */}
                  <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono ${getRankBadge(
                        entry.rank
                      )}`}
                    >
                      {entry.rank}
                    </span>
                    <div className="mt-0.5">{renderMovement(entry.rank, entry.previousRank)}</div>
                  </div>

                  {/* Runner Info */}
                  <div className="col-span-7 sm:col-span-8 flex items-center gap-3 pl-2 sm:pl-0">
                    <img
                      src={entry.avatarUrl}
                      alt={entry.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 truncate">{entry.name}</span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#72D600] text-slate-950 text-[9px] font-black uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {entry.clubName}
                      </p>
                    </div>
                  </div>

                  {/* Metric Value */}
                  <div className="col-span-3 text-right">
                    <span className="font-mono font-black text-sm text-slate-900 tabular-nums">
                      {entry.metricDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Club Entries */}
        {boardType === 'club' && (
          <div className="divide-y divide-slate-100">
            {clubEntries.map((entry) => {
              const isUserClub = currentUser.primaryClubId === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => onSelectClub && onSelectClub(entry.id)}
                  className={`grid grid-cols-12 items-center px-5 py-3.5 text-xs transition-colors cursor-pointer ${
                    isUserClub ? 'bg-lime-50/70 border-l-4 border-l-[#72D600]' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Rank with movement */}
                  <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono ${getRankBadge(
                        entry.rank
                      )}`}
                    >
                      {entry.rank}
                    </span>
                  </div>

                  {/* Club Info */}
                  <div className="col-span-7 sm:col-span-8 pl-2 sm:pl-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 truncate text-sm">{entry.name}</span>
                      {isUserClub && (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-[#72D600] text-[9px] font-black uppercase">
                          YOUR CLUB
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      📍 {entry.clubName} · {entry.activeMembers} active runners · {entry.avgDistancePerMember?.toFixed(1)} km/runner
                    </p>
                  </div>

                  {/* Total KM */}
                  <div className="col-span-3 text-right">
                    <span className="font-mono font-black text-sm text-[#529d00] tabular-nums">
                      {entry.metricDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
