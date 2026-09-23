import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Trophy, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  Plus, 
  ChevronLeft,
  Flame,
  Award,
  QrCode,
  Copy,
  Check,
  Heart
} from 'lucide-react';
import { RunClub, User, Activity, ClubRunEvent } from '../../types';
import { db } from '../../services/db';
import { formatDuration, formatPace } from '../../services/gps';
import { RunFamLogo } from '../common/RunFamLogo';

interface ClubProfileProps {
  clubId: string;
  currentUser: User;
  onBack: () => void;
  onStartClubRun: () => void;
  onSelectUser?: (userId: string) => void;
}

export const ClubProfile: React.FC<ClubProfileProps> = ({
  clubId,
  currentUser,
  onBack,
  onStartClubRun,
}) => {
  const [club, setClub] = useState<RunClub | undefined>(db.getClubById(clubId));
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activities' | 'runs'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!club) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Club Not Found</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
          Back to Clubs
        </button>
      </div>
    );
  }

  const isMember = currentUser.joinedClubIds.includes(club.id);
  const isPrimary = currentUser.primaryClubId === club.id;
  const isOwner = club.ownerId === currentUser.id;

  const members = db.getClubMembers(club.id);
  const clubActivities = db.getActivities({ clubId: club.id, limit: 15 });
  const clubEvents = db.getEvents().filter((e) => e.clubId === club.id);

  const handleJoinToggle = () => {
    if (isMember) {
      if (window.confirm(`Leave ${club.name}?`)) {
        db.leaveClub(currentUser.id, club.id);
        setClub(db.getClubById(club.id));
      }
    } else {
      db.joinClub(currentUser.id, club.id);
      setClub(db.getClubById(club.id));
    }
  };

  const handleSetPrimary = () => {
    db.updateUser(currentUser.id, { primaryClubId: club.id });
    setClub(db.getClubById(club.id));
  };

  const handleCopyInvite = () => {
    const link = `https://runfam.app/club/${club.slug}?code=${club.inviteCode}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleEventRsvp = (eventId: string) => {
    const ev = clubEvents.find((e) => e.id === eventId);
    if (!ev) return;
    if (ev.participantUserIds.includes(currentUser.id)) {
      db.leaveEvent(eventId, currentUser.id);
    } else {
      db.joinEvent(eventId, currentUser.id);
    }
    setClub(db.getClubById(club.id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-24 md:pb-12 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>All Run Clubs</span>
      </button>

      {/* Hero Club Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#65C800]" />
                <span>{club.neighborhood}, {club.cityName}</span>
              </span>

              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-white font-mono">
                Club Rank #{club.clubRank}
              </span>

              {club.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official Verified</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
              {club.name}
            </h1>
            <p className="text-sm font-medium italic text-slate-600">
              "{club.tagline}"
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 self-start">
            <button
              onClick={() => setShowInviteModal(true)}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Share / Invite QR Code"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isMember ? (
              <div className="flex items-center gap-2">
                {!isPrimary && (
                  <button
                    onClick={handleSetPrimary}
                    className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Make Primary Club
                  </button>
                )}
                <button
                  onClick={handleJoinToggle}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Leave Club
                </button>
              </div>
            ) : (
              <button
                onClick={handleJoinToggle}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-[#72D600]" />
                <span>JOIN RUN CLUB</span>
              </button>
            )}
          </div>
        </div>

        {/* Club Cumulative Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              This Month
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-slate-900 font-mono tabular-nums mt-0.5">
              {club.monthlyDistanceKm.toFixed(0)} <span className="text-xs font-normal text-slate-500">KM</span>
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Runners
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-slate-900 font-mono tabular-nums mt-0.5">
              {club.activeMembersCount}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Runs
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-slate-900 font-mono tabular-nums mt-0.5">
              {club.totalActivitiesCount}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Avg / Member
            </span>
            <p className="text-xl sm:text-2xl font-display font-black text-[#529d00] font-mono tabular-nums mt-0.5">
              {club.avgDistancePerActiveMemberKm.toFixed(1)} <span className="text-xs font-normal text-slate-500">KM</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview & Rules
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'members' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('runs')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'runs' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Club Runs & Events ({clubEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'activities' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Recent Activity
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-display font-black text-base text-slate-900">
                About {club.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {club.description}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Club Standards & Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {club.rules?.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#529d00] shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
              <h4 className="font-display font-black text-sm text-slate-900">
                Schedule & Details
              </h4>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Meeting Time</span>
                <p className="font-semibold text-slate-800">{club.typicalTime}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Distance Range</span>
                <p className="font-semibold text-slate-800">{club.typicalDistance}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Pace / Level</span>
                <p className="font-semibold text-slate-800 capitalize">{club.runningLevel}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Invite Code</span>
                <p className="font-mono font-bold text-[#529d00]">{club.inviteCode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Members Leaderboard */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-black text-base text-slate-900">
              Club Member Contributions
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Ranked by this month's verified kilometers
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((m, idx) => (
              <div key={m.user.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-sm text-slate-400 w-5 text-center font-mono">
                    {idx + 1}
                  </span>
                  <img
                    src={m.user.avatarUrl}
                    alt={m.user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900">{m.user.name}</p>
                      {m.role === 'owner' && (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold">
                          Founder
                        </span>
                      )}
                      {m.role === 'admin' && (
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-bold">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">@{m.user.username} · 🔥 {m.user.streakDays}d streak</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-sm text-slate-900">
                    {m.contributionKm.toFixed(1)} KM
                  </span>
                  <p className="text-[10px] text-slate-400">contributed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Club Runs & Events */}
      {activeTab === 'runs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-base text-slate-900">
              Upcoming Club Runs
            </h3>
          </div>

          {clubEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubEvents.map((ev) => {
                const isAttending = ev.participantUserIds.includes(currentUser.id);

                return (
                  <div key={ev.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#529d00] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{ev.date} · {ev.time}</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {ev.targetDistanceKm} KM
                        </span>
                      </div>

                      <h4 className="font-display font-black text-base text-slate-900">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {ev.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700 space-y-1">
                        <p>📍 <strong>Meeting:</strong> {ev.meetingLocation}</p>
                        <p>⚡ <strong>Target Pace:</strong> {ev.estimatedPace}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {ev.participantUserIds.length} Runners Attending
                      </span>

                      <button
                        onClick={() => handleEventRsvp(ev.id)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                          isAttending
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isAttending ? '✓ Attending' : 'RSVP / Join Run'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No scheduled group runs right now for this club.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Recent Activities */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-display font-black text-base text-slate-900 mb-2">
            Club Feed
          </h3>
          {clubActivities.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {clubActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{act.userName}</p>
                      <p className="text-slate-500">{act.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">{act.distanceKm.toFixed(2)} KM</span>
                    <p className="text-[10px] text-slate-400">{formatPace(act.avgPaceSecondsPerKm)}/km</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No recent activities logged yet.</p>
          )}
        </div>
      )}

      {/* Invite QR Code Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <RunFamLogo variant="compact" size="sm" className="mx-auto mb-2" />
            <h3 className="text-lg font-display font-black text-slate-900">
              Invite Runners to {club.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Share the QR code or club link to bring your crew together.
            </p>

            {/* Generated QR Placeholder */}
            <div className="my-5 p-4 rounded-2xl bg-slate-900 text-white inline-block shadow-md">
              <QrCode className="w-36 h-36 mx-auto text-[#72D600]" />
              <p className="text-[10px] font-mono mt-1 text-slate-400">
                CODE: {club.inviteCode}
              </p>
            </div>

            <button
              onClick={handleCopyInvite}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#72D600]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full mt-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
