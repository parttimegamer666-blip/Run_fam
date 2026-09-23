import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Users, 
  MapPin, 
  Trophy, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Navigation,
  Compass,
  Sparkles
} from 'lucide-react';
import { RunFamLogo } from '../common/RunFamLogo';
import { CityData, RunClub } from '../../types';
import heroImg from '../../assets/images/hero_runners_crew_1790140607404.jpg';
import clubImg from '../../assets/images/club_run_morning_1790140620757.jpg';

interface LandingPageProps {
  cityData: CityData;
  featuredClubs: RunClub[];
  onStartRunning: () => void;
  onFindFam: () => void;
  onJoinClub: (clubId: string) => void;
  onViewCity: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToSignUp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  cityData,
  featuredClubs,
  onStartRunning,
  onFindFam,
  onJoinClub,
  onViewCity,
  onNavigateToLogin,
  onNavigateToSignUp,
}) => {
  const [animatedDistance, setAnimatedDistance] = useState(0);

  useEffect(() => {
    // Subtle upward counter for city total distance
    const target = cityData.currentMonthProgressKm;
    const duration = 1200;
    const steps = 30;
    const stepVal = target / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepVal;
      if (current >= target) {
        setAnimatedDistance(target);
        clearInterval(interval);
      } else {
        setAnimatedDistance(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [cityData.currentMonthProgressKm]);

  const percentGoal = Math.min(
    100,
    Math.round((cityData.currentMonthProgressKm / cityData.monthlyGoalKm) * 100)
  );

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Launch City Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200/80">
              <span className="w-2 h-2 rounded-full bg-[#72D600] animate-pulse" />
              <span>Launch City: {cityData.name}, India</span>
            </div>

            {/* Official Logo Banner */}
            <div className="py-1">
              <RunFamLogo variant="full" size="lg" />
            </div>

            {/* Core Manifesto Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 leading-[1.05]">
                YOUR RUN.<br />
                <span className="text-[#65C800]">YOUR CREW.</span><br />
                YOUR CITY.
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl font-normal pt-2">
                Track your runs. Find your crew. Compete with your city. Every kilometer you log updates your profile, powers your Run Club, and drives your city leaderboard.
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onStartRunning}
                className="h-14 px-8 rounded-2xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#72D600]/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START RUNNING</span>
              </button>

              <button
                type="button"
                onClick={onFindFam}
                className="h-14 px-7 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#72D600]" />
                <span>FIND YOUR FAM</span>
              </button>
            </div>

            {/* Quick auth helper links */}
            {(onNavigateToLogin || onNavigateToSignUp) && (
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                <span>Already have a crew?</span>
                {onNavigateToLogin && (
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="font-bold text-slate-900 hover:text-[#529d00] underline underline-offset-2"
                  >
                    Log In
                  </button>
                )}
                <span>•</span>
                {onNavigateToSignUp && (
                  <button
                    type="button"
                    onClick={onNavigateToSignUp}
                    className="font-bold text-[#529d00] hover:underline"
                  >
                    Create Account
                  </button>
                )}
              </div>
            )}

            {/* Live City Metric Kicker */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-600 border-t border-slate-100">
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {animatedDistance.toLocaleString()} KM
                </span>
                <p className="text-[11px] text-slate-600">Logged in {cityData.name}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {cityData.totalRunnersCount.toLocaleString()}
                </span>
                <p className="text-[11px] text-slate-600">Active Runners</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {cityData.totalRunClubsCount}
                </span>
                <p className="text-[11px] text-slate-600">Run Clubs</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Cinematic Photography & Active Run HUD Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={heroImg}
                alt="Runners pacing together in morning light"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

              {/* Floating Overlay HUD Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-100 text-slate-900 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#529d00] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#72D600] animate-ping" />
                    Live Club Run
                  </div>
                  <p className="font-display font-black text-sm text-slate-900 mt-0.5">
                    Sunday Prozone Classic 10K
                  </p>
                  <p className="text-xs text-slate-500">
                    6:00 AM · CSN Weekend Warriors
                  </p>
                </div>
                <button
                  onClick={onStartRunning}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <span>Track</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#72D600]" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW RUNFAM WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#59ab02]">
            The Core Product Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 mt-1">
            HOW RUNFAM WORKS
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every step you take matters to your stats, your crew, and your hometown.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#72D600] transition-colors">
            <span className="text-3xl font-display font-black text-slate-200 group-hover:text-[#72D600]/30 transition-colors">
              01
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 mt-2">
              Join Your City
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Create your runner profile and choose Chhatrapati Sambhajinagar to connect directly into your local running ecosystem.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#72D600] transition-colors">
            <span className="text-3xl font-display font-black text-slate-200 group-hover:text-[#72D600]/30 transition-colors">
              02
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 mt-2">
              Find Your Fam
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Join an existing Run Club like Waluj Runners or CSN Weekend Warriors, or build your own neighborhood crew.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#72D600] transition-colors">
            <span className="text-3xl font-display font-black text-slate-200 group-hover:text-[#72D600]/30 transition-colors">
              03
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 mt-2">
              Track Your Run
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Accurate live GPS tracking with noise filtering, pace measurement, route mapping, and offline resilience.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#72D600] transition-colors">
            <span className="text-3xl font-display font-black text-slate-200 group-hover:text-[#72D600]/30 transition-colors">
              04
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 mt-2">
              Power Your City
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Climb verified leaderboards, unlock streak badges, and help push Sambhajinagar past its 100,000 KM target.
            </p>
          </div>

        </div>
      </section>

      {/* SIGNATURE CITY GOAL SHOWCASE: CHHATRAPATI SAMBHAJINAGAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-[#72D600]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Launch City Living Entity</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
                CHHATRAPATI SAMBHAJINAGAR
              </h2>

              <p className="text-sm text-slate-300 max-w-lg">
                When you run 7 KM, your city gains 7 KM. Watch the collective total move in real time as thousands of local runners hit the roads.
              </p>

              {/* Signature City Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Monthly Collective Progress</span>
                  <span className="font-bold text-[#72D600] tabular-nums">
                    {cityData.currentMonthProgressKm.toLocaleString()} / {cityData.monthlyGoalKm.toLocaleString()} KM ({percentGoal}%)
                  </span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-[#72D600] to-[#8EF700] rounded-full transition-all duration-1000"
                    style={{ width: `${percentGoal}%` }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onViewCity}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore City Leaderboard & Stats</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#72D600]" />
                </button>
              </div>
            </div>

            {/* City Stat Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
                <p className="text-3xl font-display font-black text-white font-mono tabular-nums">
                  {cityData.totalDistanceKm.toLocaleString()}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Total KM
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
                <p className="text-3xl font-display font-black text-[#72D600] font-mono tabular-nums">
                  {cityData.totalRunnersCount.toLocaleString()}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Runners
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
                <p className="text-3xl font-display font-black text-white font-mono tabular-nums">
                  {cityData.totalRunClubsCount}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Run Clubs
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
                <p className="text-3xl font-display font-black text-white font-mono tabular-nums">
                  {cityData.totalRunsCount.toLocaleString()}
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Logged Runs
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FIND YOUR FAM — FEATURED RUN CLUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#59ab02]">
              <Users className="w-4 h-4" />
              <span>Find Your Fam</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 mt-1">
              RUNNING IS BETTER TOGETHER.
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Join a local Run Club in your neighborhood or create a crew of your own.
            </p>
          </div>

          <button
            onClick={onFindFam}
            className="text-xs font-bold text-slate-900 hover:text-[#529d00] transition-colors flex items-center gap-1"
          >
            <span>Discover All {featuredClubs.length} Clubs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredClubs.slice(0, 3).map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <span>{club.neighborhood}</span>
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    Rank #{club.clubRank}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-[#529d00] transition-colors">
                  {club.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {club.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase">Members</span>
                    <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                      {club.activeMembersCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase">This Month</span>
                    <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                      {club.monthlyDistanceKm.toFixed(0)} <span className="text-xs font-normal text-slate-700">KM</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <button
                  onClick={() => onJoinClub(club.id)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-[#72D600]" />
                  <span>JOIN CLUB</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
