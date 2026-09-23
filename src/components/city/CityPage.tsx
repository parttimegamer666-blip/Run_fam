import React, { useState } from 'react';
import { 
  MapPin, 
  Trophy, 
  Users, 
  Activity, 
  Flame, 
  ArrowRight, 
  Target, 
  CheckCircle2, 
  Globe2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CityData, User } from '../../types';
import { db } from '../../services/db';
import cityImg from '../../assets/images/city_sambhajinagar_skyline_1790140638658.jpg';

interface CityPageProps {
  cityData: CityData;
  currentUser: User;
  onExploreClubs: () => void;
  onViewLeaderboard: () => void;
  onCityChanged: (cityId: string) => void;
}

export const CityPage: React.FC<CityPageProps> = ({
  cityData,
  currentUser,
  onExploreClubs,
  onViewLeaderboard,
  onCityChanged,
}) => {
  const [showCitySwitchModal, setShowCitySwitchModal] = useState(false);

  const percentGoal = Math.min(
    100,
    Math.round((cityData.currentMonthProgressKm / cityData.monthlyGoalKm) * 100)
  );

  const supportedCities = [
    { id: 'city_csn', name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', active: true, tag: 'Official Launch City' },
    { id: 'city_pune', name: 'Pune', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
    { id: 'city_mumbai', name: 'Mumbai', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
    { id: 'city_nashik', name: 'Nashik', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
    { id: 'city_nagpur', name: 'Nagpur', state: 'Maharashtra', active: false, tag: 'Coming Soon' },
    { id: 'city_bangalore', name: 'Bengaluru', state: 'Karnataka', active: false, tag: 'Coming Soon' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#59ab02]">
            Active City Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
            {cityData.name.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {cityData.state}, {cityData.country} · Launch City of the RunFam Movement
          </p>
        </div>

        <button
          onClick={() => setShowCitySwitchModal(true)}
          className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Switch City</span>
        </button>
      </div>

      {/* Living Entity Hero Card with scenic golden morning background */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800 p-6 sm:p-10">
        <img
          src={cityImg}
          alt="Chhatrapati Sambhajinagar morning skyline"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#72D600]/20 text-[#72D600] text-xs font-bold border border-[#72D600]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Living City Entity</span>
          </div>

          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
              EVERY KILOMETER YOU LOG IS PERMANENTLY RECORDED FOR YOUR CITY.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              In RunFam, your city is not a setting — it’s a living collective. Waluj, CIDCO, Kranti Chowk, and Cannaught Place runners are united under one banner.
            </p>
          </div>

          {/* 100,000 KM Goal Progress */}
          <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                September City Threshold: 100,000 KM
              </span>
              <span className="text-[#72D600] font-black text-sm tabular-nums">
                {cityData.currentMonthProgressKm.toLocaleString()} / {cityData.monthlyGoalKm.toLocaleString()} KM ({percentGoal}%)
              </span>
            </div>

            <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#72D600] via-[#8EF700] to-[#72D600] rounded-full transition-all duration-1000"
                style={{ width: `${percentGoal}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>0 KM</span>
              <span>25,000 KM (Unlocked)</span>
              <span>50,000 KM (Unlocked)</span>
              <span className="text-white font-bold">100,000 KM Goal</span>
            </div>
          </div>

          {/* City Aggregate Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <p className="text-2xl sm:text-3xl font-display font-black text-white font-mono tabular-nums">
                {cityData.totalDistanceKm.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                All-Time Distance
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <p className="text-2xl sm:text-3xl font-display font-black text-[#72D600] font-mono tabular-nums">
                {cityData.totalRunnersCount.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Active Runners
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <p className="text-2xl sm:text-3xl font-display font-black text-white font-mono tabular-nums">
                {cityData.totalRunClubsCount}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Run Clubs
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <p className="text-2xl sm:text-3xl font-display font-black text-white font-mono tabular-nums">
                {cityData.totalRunsCount.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Verified Runs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Neighborhood Hotspots */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-display font-black text-base text-slate-900">
          Neighborhood Running Hubs
        </h3>
        <p className="text-xs text-slate-500">
          Where Chhatrapati Sambhajinagar runners hit their morning strides.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {cityData.neighborhoods.map((n) => (
            <div
              key={n}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors text-center"
            >
              <MapPin className="w-4 h-4 text-[#65C800] mx-auto mb-1" />
              <p className="font-bold text-xs text-slate-900 truncate">{n}</p>
              <span className="text-[10px] text-slate-500">Active Sector</span>
            </div>
          ))}
        </div>
      </div>

      {/* Switch City Modal */}
      {showCitySwitchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-display font-black text-slate-900">
              Select City
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              RunFam is rolling out across Maharashtra and India.
            </p>

            <div className="mt-4 space-y-2 max-h-72 overflow-y-auto">
              {supportedCities.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    if (c.active) {
                      onCityChanged(c.id);
                      setShowCitySwitchModal(false);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-colors ${
                    c.active
                      ? 'border-[#72D600] bg-lime-50/50 cursor-pointer'
                      : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-500">{c.state}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.active ? 'bg-[#72D600] text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.tag}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCitySwitchModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
