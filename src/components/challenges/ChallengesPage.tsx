import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  Users, 
  Sparkles,
  Award
} from 'lucide-react';
import { Challenge, Achievement, User } from '../../types';
import { db } from '../../services/db';

interface ChallengesPageProps {
  currentUser: User;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({ currentUser }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(db.getChallenges());
  const [achievements, setAchievements] = useState<Achievement[]>(db.getAchievements());
  const [filterCategory, setFilterCategory] = useState<'all' | 'personal' | 'club' | 'city'>('all');

  const handleJoinChallenge = (id: string) => {
    db.joinChallenge(id, currentUser.id);
    setChallenges(db.getChallenges());
  };

  const filteredChallenges = challenges.filter(
    (c) => filterCategory === 'all' || c.category === filterCategory
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#59ab02]">
          Goals & Milestones
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          CHALLENGES & ACHIEVEMENTS
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Push your boundaries. Earn badges. Power your Run Club and city milestones.
        </p>
      </div>

      {/* Streak Spotlight Card */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              <Flame className="w-4 h-4 fill-white" />
              <span>Active Running Streak</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              {currentUser.streakDays} CONSECUTIVE DAYS
            </h2>
            <p className="text-xs text-orange-100 max-w-md">
              Runs must be at least 1.5 KM to qualify for streak continuation. Keep the fire burning tomorrow!
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-orange-100">
              Next Streak Reward
            </span>
            <span className="text-xl font-display font-black text-white">14-Day On Fire</span>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display font-black text-lg text-slate-900">
            Active Challenges
          </h2>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
            {(['all', 'personal', 'club', 'city'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((chal) => {
            const isJoined = chal.participantUserIds.includes(currentUser.id);
            const percent = Math.min(100, Math.round((chal.currentKm / chal.targetKm) * 100));

            return (
              <div
                key={chal.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {chal.category} challenge
                    </span>
                    <span className="text-lg">{chal.badgeIcon}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900">
                    {chal.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {chal.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Progress</span>
                      <strong className="text-slate-900 font-bold">
                        {chal.currentKm.toLocaleString()} / {chal.targetKm.toLocaleString()} KM ({percent}%)
                      </strong>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#72D600] rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {chal.participantUserIds.length} Runners In
                  </span>

                  {isJoined ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinChallenge(chal.id)}
                      className="py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="space-y-4">
        <h2 className="font-display font-black text-lg text-slate-900">
          Earned Badges & Milestones
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-3xl border text-center transition-all ${
                ach.isUnlocked
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200/60 opacity-50'
              }`}
            >
              <div className="text-3xl mb-1.5">{ach.icon}</div>
              <h3 className="font-display font-bold text-xs text-slate-900">
                {ach.title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                {ach.description}
              </p>

              <div className="mt-2 pt-2 border-t border-slate-100">
                {ach.isUnlocked ? (
                  <span className="text-[10px] font-bold text-[#529d00] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
