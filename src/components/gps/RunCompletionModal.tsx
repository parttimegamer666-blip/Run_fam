import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  MapPin, 
  Flame, 
  Share2, 
  CheckCircle2, 
  Lock, 
  Globe2, 
  ChevronRight,
  Sparkles,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { RunTrackerState, formatDuration, formatPace } from '../../services/gps';
import { db } from '../../services/db';
import { User, ActivityPrivacy } from '../../types';
import { RunFamLogo } from '../common/RunFamLogo';
import { LeafletRouteMap } from './LeafletRouteMap';

interface RunCompletionModalProps {
  runData: RunTrackerState;
  currentUser: User;
  onClose: () => void;
  onSaved: (activityId: string) => void;
}

export const RunCompletionModal: React.FC<RunCompletionModalProps> = ({
  runData,
  currentUser,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState(`${getGreetingTime()} Sambhajinagar Run`);
  const [selectedClubId, setSelectedClubId] = useState<string>(currentUser.primaryClubId || '');
  const [privacy, setPrivacy] = useState<ActivityPrivacy>('public');
  const [animationStep, setAnimationStep] = useState(0); // 0: reveal, 1: personal, 2: club, 3: city, 4: challenge, 5: ready
  const [isSaving, setIsSaving] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Available clubs for the user
  const userClubs = currentUser.joinedClubIds.map((id) => db.getClubById(id)).filter(Boolean);
  const selectedClub = db.getClubById(selectedClubId);

  // Sequential signature RunFam impact animation
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStep(1), 400),  // Personal stat
      setTimeout(() => setAnimationStep(2), 1100), // Club stat
      setTimeout(() => setAnimationStep(3), 1800), // City stat
      setTimeout(() => setAnimationStep(4), 2500), // Challenge stat
      setTimeout(() => setAnimationStep(5), 3200), // Final "KEEP MOVING"
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  function getGreetingTime() {
    const hr = new Date().getHours();
    if (hr < 12) return 'Morning';
    if (hr < 17) return 'Afternoon';
    return 'Evening';
  }

  const handleSaveActivity = () => {
    setIsSaving(true);

    const saved = db.saveRunActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      title,
      sport: 'running',
      subType: 'road_run',
      distanceKm: runData.distanceKm,
      durationSeconds: runData.durationSeconds,
      avgPaceSecondsPerKm: runData.avgPaceSecPerKm || Math.round(runData.durationSeconds / Math.max(0.1, runData.distanceKm)),
      avgSpeedKmh: runData.currentSpeedKmh || Number(((runData.distanceKm / (runData.durationSeconds / 3600)) || 0).toFixed(1)),
      elevationGainMeters: runData.elevationGainMeters,
      routePoints: runData.points,
      startTime: new Date(runData.startTime || Date.now() - runData.durationSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      privacy,
      clubId: selectedClub?.id,
      clubName: selectedClub?.name,
      cityId: currentUser.cityId,
      cityName: currentUser.cityName,
      isSimulated: runData.isSimulated,
    });

    setIsSaving(false);
    onSaved(saved.activity.id);
  };

  const handleCopyShare = () => {
    const text = `I just ran ${runData.distanceKm.toFixed(2)} KM at ${formatPace(runData.avgPaceSecPerKm)}/km in Chhatrapati Sambhajinagar with ${selectedClub?.name || 'RunFam'}! 🏃💨 Join the movement: https://runfam.app`;
    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-auto">
        
        {/* Celebration Header Banner */}
        <div className="relative px-6 pt-7 pb-6 bg-gradient-to-b from-[#72D600]/15 via-white to-white border-b border-slate-100 text-center">
          <div className="flex justify-center mb-2">
            <RunFamLogo variant="compact" size="sm" />
          </div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="text-xs font-bold tracking-widest text-[#59ab02] uppercase">
              Run Complete
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight mt-0.5">
              YOU RAN <span className="text-[#65C800]">{runData.distanceKm.toFixed(2)}</span> KM
            </h2>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 mt-4 max-w-md mx-auto text-center bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Distance</p>
              <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {runData.distanceKm.toFixed(2)} <span className="text-xs font-normal text-slate-500">KM</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Time</p>
              <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {formatDuration(runData.durationSeconds)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Avg Pace</p>
              <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                {formatPace(runData.avgPaceSecPerKm)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Elevation</p>
              <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                +{runData.elevationGainMeters} <span className="text-xs font-normal text-slate-500">M</span>
              </p>
            </div>
          </div>
        </div>

        {/* Route Map Preview */}
        {runData.points.length > 0 && (
          <div className="px-6 pt-3">
            <LeafletRouteMap
              points={runData.points}
              interactive={false}
              followRunner={false}
              className="h-44 w-full rounded-2xl"
            />
          </div>
        )}

        {/* THE SIGNATURE RUNFAM MOMENT — SEQUENTIAL IMPACT ANIMATION */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Community Impact
            </h3>
            <span className="text-[11px] font-medium text-[#59ab02] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Live Loop Updates
            </span>
          </div>

          <div className="space-y-2">
            {/* 1. Personal Stats */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={animationStep >= 1 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#72D600] flex items-center justify-center font-bold text-xs">
                  ME
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Personal Profile</p>
                  <p className="text-[11px] text-slate-500">
                    Month total increases to {(currentUser.monthDistanceKm + runData.distanceKm).toFixed(1)} KM
                  </p>
                </div>
              </div>
              <span className="text-sm font-black font-mono text-slate-900 tabular-nums">
                +{runData.distanceKm.toFixed(2)} KM
              </span>
            </motion.div>

            {/* 2. Run Club */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={animationStep >= 2 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.35 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                selectedClub ? 'bg-lime-50/70 border-lime-200' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#72D600] text-slate-950 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {selectedClub ? selectedClub.name : 'Personal / No Club'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {selectedClub ? `Club monthly ranking points credited` : 'Not linked to a Run Club'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-black font-mono text-[#529d00] tabular-nums">
                +{runData.distanceKm.toFixed(2)} KM
              </span>
            </motion.div>

            {/* 3. City Impact */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={animationStep >= 3 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.cityName}</p>
                  <p className="text-[11px] text-slate-500">
                    Contributed toward 100,000 KM City Goal
                  </p>
                </div>
              </div>
              <span className="text-sm font-black font-mono text-slate-900 tabular-nums">
                +{runData.distanceKm.toFixed(2)} KM
              </span>
            </motion.div>

            {/* 4. Active Challenges & Streak */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={animationStep >= 4 ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between p-3 rounded-xl bg-orange-50/80 border border-orange-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Streak & Challenge Progress
                  </p>
                  <p className="text-[11px] text-orange-800">
                    🔥 {currentUser.streakDays + (runData.distanceKm >= 1.5 ? 1 : 0)} Day Streak Active · City 100K progress
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-orange-700">EXTENDED</span>
            </motion.div>
          </div>

          {/* 5. Keep Moving Finale Banner */}
          {animationStep >= 5 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-3 py-2 text-center text-xs font-bold uppercase tracking-widest text-[#529d00]"
            >
              KEEP MOVING. 🔥
            </motion.div>
          )}
        </div>

        {/* Activity Details Form */}
        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Run Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#72D600] font-medium"
              placeholder="e.g. Sunrise Waluj 7K Tempo"
            />
          </div>

          {/* Primary Club Attribution */}
          {userClubs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contribute This Run To (Primary Run Club)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {userClubs.map((club) => (
                  <button
                    key={club!.id}
                    type="button"
                    onClick={() => setSelectedClubId(club!.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      selectedClubId === club!.id
                        ? 'border-[#72D600] bg-lime-50/60 text-slate-900 font-semibold ring-1 ring-[#72D600]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedClubId === club!.id ? 'border-[#72D600] bg-[#72D600]' : 'border-slate-300'
                      }`}
                    >
                      {selectedClubId === club!.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="truncate">{club!.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Activity Privacy</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  privacy === 'public'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('club_only')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  privacy === 'club_only'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Club Only</span>
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('private')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  privacy === 'private'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private</span>
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleSaveActivity}
              disabled={isSaving}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
            >
              {isSaving ? (
                <span>Saving Run...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#72D600]" />
                  <span>Save & Update Leaderboards</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowShareCard(!showShareCard)}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Card</span>
            </button>
          </div>

          {/* Share Card Modal Accordion */}
          {showShareCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <RunFamLogo variant="compact" size="sm" darkTheme />
                <span className="text-[10px] font-bold text-[#72D600] tracking-widest uppercase">
                  Verified Run Card
                </span>
              </div>
              <div className="py-4 text-center">
                <p className="text-4xl font-display font-black text-white">
                  {runData.distanceKm.toFixed(2)} <span className="text-xl text-[#72D600]">KM</span>
                </p>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Pace {formatPace(runData.avgPaceSecPerKm)}/km · Time {formatDuration(runData.durationSeconds)}
                </p>
                <p className="text-xs font-semibold text-slate-300 mt-2">
                  📍 {currentUser.cityName} · {selectedClub?.name || 'Independent Runner'}
                </p>
                <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-widest uppercase">
                  YOUR RUN. YOUR CREW. YOUR CITY.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center justify-center gap-1.5"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-[#72D600]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedShare ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};
