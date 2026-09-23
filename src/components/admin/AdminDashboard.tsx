import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Check, 
  X, 
  MapPin, 
  RotateCcw,
  Activity as ActivityIcon
} from 'lucide-react';
import { Activity, User, RunClub, VerificationStatus } from '../../types';
import { db } from '../../services/db';
import { formatPace, formatDuration } from '../../services/gps';

interface AdminDashboardProps {
  currentUser: User;
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onDataChanged }) => {
  const [activeTab, setActiveTab] = useState<'flagged' | 'users' | 'clubs'>('flagged');
  const [activities, setActivities] = useState<Activity[]>(db.getActivities());
  const [users, setUsers] = useState<User[]>(db.getUsers());
  const [clubs, setClubs] = useState<RunClub[]>(db.getClubs());

  const isAuthorized =
    currentUser.isAdmin ||
    currentUser.role === 'ADMIN' ||
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'MODERATOR';

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900">
          ACCESS RESTRICTED
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The RunFam Moderation & Anti-Cheat console requires an authorized Administrator or Moderator role. Your current account (@{currentUser.username}) has role <strong>{currentUser.role || 'USER'}</strong>.
        </p>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
          <p className="font-bold text-slate-700">Need to test admin functionality?</p>
          <p className="text-slate-500">Sign in with the demo admin account: <code>admin@runfam.com</code></p>
        </div>
      </div>
    );
  }

  const flaggedRuns = activities.filter((a) => a.verificationStatus === 'flagged');

  const handleModerateRun = (activityId: string, status: VerificationStatus) => {
    db.updateActivityStatus(activityId, status);
    setActivities(db.getActivities());
    onDataChanged();
  };

  const handleToggleUserSuspension = (userId: string) => {
    db.toggleUserSuspension(userId);
    setUsers(db.getUsers());
    onDataChanged();
  };

  const handleToggleClubSuspension = (clubId: string) => {
    db.toggleClubSuspension(clubId);
    setClubs(db.getClubs());
    onDataChanged();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean factory state?')) {
      db.resetToDefaultDemo();
      setActivities(db.getActivities());
      setUsers(db.getUsers());
      setClubs(db.getClubs());
      onDataChanged();
      alert('Data reset successfully.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#59ab02]">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            ADMIN & ANTI-CHEAT CONSOLE
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain leaderboard integrity for Chhatrapati Sambhajinagar.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo State</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
            activeTab === 'flagged' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Flagged Runs ({flaggedRuns.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Runners ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'clubs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Run Clubs ({clubs.length})
        </button>
      </div>

      {/* Flagged Runs Tab */}
      {activeTab === 'flagged' && (
        <div className="space-y-4">
          {flaggedRuns.length > 0 ? (
            flaggedRuns.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{act.userName}</p>
                      <p className="text-[10px] text-slate-500">{act.clubName || 'Independent'} · {act.cityName}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    FLAGGED BY ALGORITHM
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Violation Diagnostics:</span>
                  <p>{act.verificationNotes || 'Abnormal pace or GPS telemetry pattern detected.'}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <strong>{act.distanceKm.toFixed(2)} KM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <strong>{formatDuration(act.durationSeconds)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pace</span>
                    <strong className="text-red-600">{formatPace(act.avgPaceSecondsPerKm)}/km</strong>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleModerateRun(act.id, 'rejected')}
                    className="py-1.5 px-4 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 font-bold text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Disqualify Run</span>
                  </button>
                  <button
                    onClick={() => handleModerateRun(act.id, 'verified')}
                    className="py-1.5 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Run</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-display font-bold text-sm text-slate-900">
                All Runs Verified
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                No flagged activities pending anti-cheat review.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {users.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <span className="text-[10px] text-slate-400">@{u.username}</span>
                    {u.isAdmin && (
                      <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[9px] font-bold">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {u.totalDistanceKm.toFixed(1)} KM lifetime · Rank #{u.cityRank} · {u.cityName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleUserSuspension(u.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                    u.isSuspended
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {u.isSuspended ? 'Reinstate' : 'Suspend'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clubs Tab */}
      {activeTab === 'clubs' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {clubs.map((c) => (
            <div key={c.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-sm text-slate-900">{c.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  📍 {c.neighborhood} · {c.activeMembersCount} members · {c.monthlyDistanceKm.toFixed(0)} KM this month
                </p>
              </div>

              <button
                onClick={() => handleToggleClubSuspension(c.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                  c.isSuspended
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {c.isSuspended ? 'Activate' : 'Suspend'}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
