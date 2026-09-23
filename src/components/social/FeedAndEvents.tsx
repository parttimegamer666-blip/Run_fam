import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Users,
  Send
} from 'lucide-react';
import { Activity, ClubRunEvent, User } from '../../types';
import { db } from '../../services/db';
import { formatDuration, formatPace } from '../../services/gps';
import { LeafletRouteMap } from '../gps/LeafletRouteMap';

interface FeedAndEventsProps {
  currentUser: User;
  onSelectClub?: (clubId: string) => void;
  onSelectUser?: (userId: string) => void;
}

export const FeedAndEvents: React.FC<FeedAndEventsProps> = ({
  currentUser,
  onSelectClub,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'events'>('feed');
  const [activities, setActivities] = useState<Activity[]>(db.getActivities());
  const [events, setEvents] = useState<ClubRunEvent[]>(db.getEvents());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeCommentActId, setActiveCommentActId] = useState<string | null>(null);

  const handleKudos = (actId: string) => {
    db.toggleKudos(actId, currentUser.id);
    setActivities(db.getActivities());
  };

  const handleEventToggle = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;
    if (ev.participantUserIds.includes(currentUser.id)) {
      db.leaveEvent(eventId, currentUser.id);
    } else {
      db.joinEvent(eventId, currentUser.id);
    }
    setEvents(db.getEvents());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-24 md:pb-12 space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#59ab02]">
          Social & Meetups
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
          COMMUNITY
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          See recent runs across Chhatrapati Sambhajinagar and join weekend club meetups.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-200/80 rounded-2xl max-w-xs">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'feed'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          City Run Feed
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Club Meetups ({events.length})
        </button>
      </div>

      {/* FEED TAB */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {activities.map((act) => {
            const hasKudos = act.kudosUserIds.includes(currentUser.id);

            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
              >
                {/* User & Club header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={act.userAvatar}
                      alt={act.userName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{act.userName}</span>
                        {act.clubName && (
                          <span
                            onClick={() => act.clubId && onSelectClub && onSelectClub(act.clubId)}
                            className="text-[11px] font-semibold text-[#529d00] hover:underline cursor-pointer"
                          >
                            · {act.clubName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {new Date(act.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                        {new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {act.cityName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {act.subType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Activity title */}
                <h3 className="font-display font-bold text-base text-slate-900">
                  {act.title}
                </h3>

                {/* Metrics Bar */}
                <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Distance</span>
                    <p className="font-mono font-black text-sm text-slate-900">
                      {act.distanceKm.toFixed(2)} <span className="text-[10px] font-normal text-slate-500">KM</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pace</span>
                    <p className="font-mono font-black text-sm text-slate-900">
                      {formatPace(act.avgPaceSecondsPerKm)}/km
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Time</span>
                    <p className="font-mono font-black text-sm text-slate-900">
                      {formatDuration(act.durationSeconds)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Elevation</span>
                    <p className="font-mono font-black text-sm text-slate-900">
                      +{act.elevationGainMeters}m
                    </p>
                  </div>
                </div>

                {/* Route Map Preview */}
                {act.routePoints.length > 0 && (
                  <div className="pt-1">
                    <LeafletRouteMap
                      points={act.routePoints}
                      interactive={false}
                      followRunner={false}
                      className="h-44 w-full rounded-2xl"
                    />
                  </div>
                )}

                {/* Kudos and Action Bar */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleKudos(act.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                        hasKudos
                          ? 'bg-rose-50 text-rose-600 font-bold'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasKudos ? 'fill-current text-rose-500' : ''}`} />
                      <span>{act.kudosUserIds.length} Kudos</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveCommentActId(activeCommentActId === act.id ? null : act.id)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comments</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400">
                    {act.verificationStatus === 'verified' ? '✓ Verified Run' : 'Under Review'}
                  </span>
                </div>

                {/* Comment Section Toggle */}
                {activeCommentActId === act.id && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Say congrats or drop a running tip..."
                        value={commentInputs[act.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [act.id]: e.target.value })
                        }
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-[#72D600]"
                      />
                      <button
                        onClick={() => {
                          if ((commentInputs[act.id] || '').trim()) {
                            alert('Comment posted! Great encouragement.');
                            setCommentInputs({ ...commentInputs, [act.id]: '' });
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CLUB MEETUPS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {events.map((ev) => {
            const isAttending = ev.participantUserIds.includes(currentUser.id);

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#529d00] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ev.date} · {ev.time}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {ev.targetDistanceKm} KM
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-slate-900">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Hosted by {ev.clubName}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <p>📍 <strong>Meeting Location:</strong> {ev.meetingLocation}</p>
                    <p>⚡ <strong>Pace Group:</strong> {ev.estimatedPace}</p>
                    {ev.routeDescription && (
                      <p>🗺️ <strong>Route:</strong> {ev.routeDescription}</p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {ev.participantUserIds.length} Runners Going
                  </span>

                  <button
                    onClick={() => handleEventToggle(ev.id)}
                    className={`py-2 px-5 rounded-xl font-bold text-xs transition-all ${
                      isAttending
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isAttending ? '✓ Attending' : 'RSVP / Join Crew'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
