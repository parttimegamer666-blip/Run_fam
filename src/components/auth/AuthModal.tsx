import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Users, 
  User as UserIcon, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Mail,
  Zap
} from 'lucide-react';
import { User, CityData } from '../../types';
import { db } from '../../services/db';
import { RunFamLogo } from '../common/RunFamLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState('city_csn');
  const [neighborhood, setNeighborhood] = useState('Cannaught Place');
  const [selectedClubId, setSelectedClubId] = useState<string>('club_central_city');

  if (!isOpen) return null;

  const city = db.getCityData();
  const clubs = db.getClubs();
  const allUsers = db.getUsers();

  const handleQuickLogin = (u: User) => {
    db.setCurrentUserId(u.id);
    onAuthSuccess(u);
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    const newUser = db.createUser({
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      email: email.trim() || `${username.trim().toLowerCase()}@runfam.local`,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      bio: 'New runner on RunFam!',
      cityId: city.id,
      cityName: city.name,
      state: city.state,
      country: city.country,
      neighborhood,
      primaryClubId: selectedClubId || undefined,
      joinedClubIds: selectedClubId ? [selectedClubId] : [],
    });

    db.setCurrentUserId(newUser.id);
    onAuthSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-auto text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <RunFamLogo variant="compact" size="sm" />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 rounded-xl my-4">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Sign In / Quick Demo
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {mode === 'signin' ? (
          <div className="space-y-4">
            <div>
              <p className="font-bold text-slate-900 text-sm">One-Tap Runner Demo Accounts</p>
              <p className="text-slate-500 mt-0.5">
                Switch instantaneously between real Sambhajinagar runners and admin officers to test features:
              </p>
            </div>

            <div className="space-y-2">
              {allUsers.slice(0, 5).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-[#72D600] bg-slate-50 hover:bg-lime-50/40 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 group-hover:text-[#529d00]">
                          {u.name}
                        </span>
                        {u.isAdmin && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[8px] font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        @{u.username} · Rank #{u.cityRank} · {u.monthDistanceKm.toFixed(1)} KM
                      </p>
                    </div>
                  </div>

                  <Zap className="w-4 h-4 text-slate-400 group-hover:text-[#72D600]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanmay Kulkarni"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tanmay_strides"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City & State</label>
              <div className="p-2.5 rounded-xl bg-slate-100 font-semibold text-slate-800 flex items-center justify-between">
                <span>{city.name}, {city.state}</span>
                <span className="text-[10px] text-[#529d00] font-bold">LAUNCH CITY</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Neighborhood Area</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {city.neighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Choose Initial Run Club</label>
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.neighborhood})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors mt-2"
            >
              Complete Registration & Enter
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
