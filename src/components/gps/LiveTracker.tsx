import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Navigation, 
  Compass, 
  Signal, 
  AlertTriangle, 
  RotateCcw, 
  Activity as ActivityIcon,
  ChevronLeft,
  Info
} from 'lucide-react';
import { gpsEngine, RunTrackerState, formatDuration, formatPace } from '../../services/gps';
import { LeafletRouteMap } from './LeafletRouteMap';
import { RunCompletionModal } from './RunCompletionModal';
import { User } from '../../types';

interface LiveTrackerProps {
  currentUser: User;
  onBackToDashboard: () => void;
  onRunFinished: (activityId: string) => void;
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({
  currentUser,
  onBackToDashboard,
  onRunFinished,
}) => {
  const [state, setState] = useState<RunTrackerState>(gpsEngine.getState());
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [savedRunData, setSavedRunData] = useState<RunTrackerState | null>(null);
  const [simMode, setSimMode] = useState(false);

  useEffect(() => {
    const unsubscribe = gpsEngine.subscribe((newState) => {
      setState(newState);
    });

    // Check GPS permissions when tracker opens
    gpsEngine.checkGPSAvailability();

    return () => unsubscribe();
  }, []);

  const handleStart = (simulated: boolean = false) => {
    setSimMode(simulated);
    gpsEngine.startRun({ simulated });
  };

  const handlePause = () => {
    gpsEngine.pauseRun();
  };

  const handleResume = () => {
    gpsEngine.resumeRun();
  };

  const handleFinishPrompt = () => {
    if (state.distanceKm < 0.1) {
      if (window.confirm('Your run is very short (<100m). Are you sure you want to finish and save?')) {
        completeRun();
      }
    } else {
      setConfirmFinish(true);
    }
  };

  const completeRun = () => {
    const finalRun = gpsEngine.finishRun();
    setConfirmFinish(false);
    setSavedRunData(finalRun);
    setShowCompletionModal(true);
  };

  const handleDiscard = () => {
    if (window.confirm('Discard this run? This activity data will not be saved.')) {
      gpsEngine.discardRun();
      setConfirmFinish(false);
    }
  };

  const getStatusBadge = () => {
    switch (state.status) {
      case 'good':
        return { text: 'GPS GOOD', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'ready':
        return { text: 'GPS READY', bg: 'bg-lime-50 text-lime-700 border-lime-200', dot: 'bg-lime-500' };
      case 'weak':
        return { text: 'GPS WEAK', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'denied':
        return { text: 'GPS DENIED', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
      default:
        return { text: 'SEARCHING...', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 md:pb-12 max-w-4xl mx-auto px-3 sm:px-6 pt-2">
      {/* Header bar */}
      <div className="flex items-center justify-between py-2 mb-2">
        <button
          onClick={onBackToDashboard}
          disabled={state.isActive && !state.isPaused}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* GPS status pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot} ${state.isActive ? 'animate-pulse' : ''}`} />
            <span>{statusBadge.text}</span>
            {state.accuracyMeters && <span className="text-[10px] text-slate-500">±{state.accuracyMeters}m</span>}
          </div>

          {state.isSimulated && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase">
              Demo Sim Mode
            </span>
          )}
        </div>
      </div>

      {/* Weak GPS Alert */}
      {state.status === 'weak' && (
        <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">GPS accuracy is currently low.</span> Your route may be less precise. Move away from tall buildings or use the Sambhajinagar Demo Simulator for testing.
          </div>
        </div>
      )}

      {/* Main GPS Live Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left Column: Big Metrics Display (Optimized for one-handed mobile running) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Dominant Distance Metric */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 text-center relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Distance
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl sm:text-7xl font-display font-black text-slate-900 tracking-tight tabular-nums">
                {state.distanceKm.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-[#65C800]">KM</span>
            </div>

            {/* Target City contribution label */}
            <div className="mt-2 text-xs font-medium text-slate-500">
              Contributing to <span className="font-bold text-slate-800">Chhatrapati Sambhajinagar</span>
            </div>
          </div>

          {/* Time & Pace Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Duration
              </span>
              <span className="text-3xl font-display font-black text-slate-900 font-mono tabular-nums mt-1 block">
                {formatDuration(state.durationSeconds)}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Avg Pace
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-3xl font-display font-black text-slate-900 font-mono tabular-nums">
                  {formatPace(state.avgPaceSecPerKm)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">/KM</span>
              </div>
            </div>
          </div>

          {/* Speed & Elevation Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Speed
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-2xl font-display font-bold text-slate-900 font-mono tabular-nums">
                  {state.currentSpeedKmh.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">KM/H</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Elevation
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-2xl font-display font-bold text-slate-900 font-mono tabular-nums">
                  +{state.elevationGainMeters}
                </span>
                <span className="text-xs text-slate-400 font-semibold">M</span>
              </div>
            </div>
          </div>

          {/* Primary Mobile Controls */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
            {!state.isActive ? (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleStart(false)}
                  className="w-full h-14 rounded-2xl bg-[#72D600] text-slate-950 hover:bg-[#65C800] active:scale-[0.98] transition-all font-display font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/25"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>START RUN</span>
                </button>

                {/* Test Mode runner button for indoor/desktop testing */}
                <button
                  type="button"
                  onClick={() => handleStart(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ActivityIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Test Run: Sambhajinagar Live Simulator</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {state.isPaused ? (
                  <button
                    type="button"
                    onClick={handleResume}
                    className="flex-1 h-14 rounded-2xl bg-[#72D600] text-slate-950 font-display font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#72D600]/20 active:scale-[0.98] transition-transform"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>RESUME</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePause}
                    className="flex-1 h-14 rounded-2xl bg-amber-500 text-white font-display font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform"
                  >
                    <Pause className="w-5 h-5 fill-current" />
                    <span>PAUSE</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleFinishPrompt}
                  className="h-14 px-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-display font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <Square className="w-5 h-5 fill-current text-[#72D600]" />
                  <span>FINISH</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Route Map */}
        <div className="md:col-span-7 flex flex-col">
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Navigation className="w-4 h-4 text-[#72D600]" />
                <span>Live Route Map</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {state.points.length} GPS points logged
              </span>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="flex-1 min-h-[340px] md:min-h-[460px] rounded-2xl overflow-hidden relative">
              <LeafletRouteMap
                points={state.points}
                currentPoint={state.lastPoint}
                interactive={true}
                followRunner={true}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Finish Modal */}
      {confirmFinish && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-[#72D600]/20 text-[#65C800] flex items-center justify-center mx-auto mb-3 font-bold">
              <Square className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-xl font-display font-black text-slate-900">Finish Your Run?</h3>
            <p className="text-xs text-slate-600 mt-2">
              You ran <strong className="text-slate-900">{state.distanceKm.toFixed(2)} KM</strong> in {formatDuration(state.durationSeconds)}. 
              This will submit your distance to your personal stats, your Run Club, and Chhatrapati Sambhajinagar.
            </p>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={completeRun}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Yes, Complete & Submit
              </button>
              <button
                type="button"
                onClick={() => setConfirmFinish(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Resume Running
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="w-full py-2 text-red-600 text-xs font-semibold hover:underline"
              >
                Discard Run
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Completion Modal */}
      {showCompletionModal && savedRunData && (
        <RunCompletionModal
          runData={savedRunData}
          currentUser={currentUser}
          onClose={() => setShowCompletionModal(false)}
          onSaved={(actId) => {
            setShowCompletionModal(false);
            onRunFinished(actId);
          }}
        />
      )}
    </div>
  );
};
