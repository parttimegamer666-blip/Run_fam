import React, { useState } from 'react';
import { 
  User as UserIcon, 
  MapPin, 
  Flame, 
  Trophy, 
  Calendar, 
  Award, 
  Users, 
  Edit3, 
  CheckCircle2, 
  Save, 
  X,
  Share2
} from 'lucide-react';
import { User, Activity, Achievement } from '../../types';
import { db } from '../../services/db';
import { formatDuration, formatPace } from '../../services/gps';
import { LeafletRouteMap } from '../gps/LeafletRouteMap';
import { WeeklyRunningChart } from '../charts/WeeklyRunningChart';
import { MyRunsHistory } from '../runs/MyRunsHistory';
import { LogOut } from 'lucide-react';

interface UserProfileProps {
  currentUser: User;
  onProfileUpdated: (updated: User) => void;
  onSelectClub: (clubId: string) => void;
  onStartRun?: () => void;
  onLogout?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  onProfileUpdated,
  onSelectClub,
  onStartRun,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || 'Waluj');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [age, setAge] = useState(currentUser.age?.toString() || '26');
  const [gender, setGender] = useState(currentUser.gender || 'Male');

  const userActivities = db.getActivities({ userId: currentUser.id });
  const achievements = db.getAchievements().filter((a) => a.isUnlocked);
  const primaryClub = currentUser.primaryClubId ? db.getClubById(currentUser.primaryClubId) : null;
  const joinedClubs = currentUser.joinedClubIds.map((id) => db.getClubById(id)).filter(Boolean);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateUser(currentUser.id, {
      name: name.trim(),
      bio: bio.trim(),
      neighborhood: neighborhood.trim(),
      avatarUrl: avatarUrl.trim() || currentUser.avatarUrl,
      age: parseInt(age, 10) || undefined,
      gender,
    });
    onProfileUpdated(updated);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#72D600]"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-display font-black text-slate-900">
                  {currentUser.name}
                </h1>
                <span className="text-xs font-mono font-bold text-slate-400">
                  @{currentUser.username}
                </span>
              </div>

              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#65C800]" />
                <span>{currentUser.neighborhood || 'Central'}, {currentUser.cityName}</span>
              </p>

              {currentUser.bio && (
                <p className="text-xs text-slate-600 mt-2 max-w-md leading-relaxed">
                  {currentUser.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-center sm:self-start">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Log Out from RunFam"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Lifetime Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              All-Time Distance
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-slate-900 font-mono tabular-nums mt-0.5">
              {currentUser.totalDistanceKm.toFixed(1)} <span className="text-xs font-normal text-slate-500">KM</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Streak
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-orange-600 font-mono tabular-nums mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{currentUser.streakDays}d</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              City Rank
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-[#529d00] font-mono tabular-nums mt-0.5">
              #{currentUser.cityRank}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Longest Run
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-slate-900 font-mono tabular-nums mt-0.5">
              {currentUser.longestRunKm.toFixed(1)} <span className="text-xs font-normal text-slate-500">KM</span>
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Running Distance Trends (Recharts) */}
      <WeeklyRunningChart
        currentUser={currentUser}
        title="Weekly Running Distance & Rhythm"
      />

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-display font-black text-base text-slate-900">
              Edit Runner Profile
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Neighborhood Area</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-[#72D600]" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Your Run Clubs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-display font-black text-base text-slate-900">
          My Run Clubs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {joinedClubs.map((club) => {
            const isPrimary = currentUser.primaryClubId === club!.id;

            return (
              <div
                key={club!.id}
                onClick={() => onSelectClub(club!.id)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  isPrimary
                    ? 'border-[#72D600] bg-lime-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900 text-sm">{club!.name}</p>
                    {isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-[#72D600] text-slate-950 text-[9px] font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    📍 {club!.neighborhood} · Rank #{club!.clubRank}
                  </p>
                </div>

                <span className="font-mono font-bold text-slate-900">
                  {club!.monthlyDistanceKm.toFixed(0)} KM
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Badges */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-display font-black text-base text-slate-900">
          Earned Badges ({achievements.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div key={ach.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="text-2xl mb-1 block">{ach.icon}</span>
              <p className="font-bold text-xs text-slate-900">{ach.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 'My Runs' Activity History with Filter System */}
      <MyRunsHistory
        currentUser={currentUser}
        onStartRun={onStartRun}
        onSelectClub={onSelectClub}
        showWeeklyChart={false}
      />

    </div>
  );
};
