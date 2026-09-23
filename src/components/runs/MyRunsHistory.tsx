/**
 * RunFam 'My Runs' Activity History with Comprehensive Filter System
 * Filters by Date Range, Distance Categories, and Club Participation
 */

import React, { useState, useMemo } from 'react';
import {
  Filter,
  Calendar,
  Layers,
  Users,
  Search,
  ArrowUpDown,
  RotateCcw,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Heart,
  MessageCircle,
  Plus,
  Play
} from 'lucide-react';
import { Activity, User, RunClub } from '../../types';
import { db } from '../../services/db';
import { formatDuration, formatPace } from '../../services/gps';
import { LeafletRouteMap } from '../gps/LeafletRouteMap';
import { WeeklyRunningChart } from '../charts/WeeklyRunningChart';

interface MyRunsHistoryProps {
  currentUser: User;
  onStartRun?: () => void;
  onSelectClub?: (clubId: string) => void;
  showWeeklyChart?: boolean;
}

type DateRangePreset = 'all' | 'this_week' | 'this_month' | 'last_30_days' | 'last_90_days' | 'custom';
type DistanceCategory = 'all' | 'short' | 'mid' | 'long' | 'half_marathon';
type SortOption = 'date_desc' | 'date_asc' | 'dist_desc' | 'dist_asc' | 'pace_asc';

export const MyRunsHistory: React.FC<MyRunsHistoryProps> = ({
  currentUser,
  onStartRun,
  onSelectClub,
  showWeeklyChart = true,
}) => {
  // Load activities for the current user
  const allUserActivities = useMemo(() => {
    return db.getActivities({ userId: currentUser.id });
  }, [currentUser.id]);

  // Available clubs that user has participated in or joined
  const availableClubs = useMemo(() => {
    const clubIds = new Set<string>();
    allUserActivities.forEach((a) => {
      if (a.clubId) clubIds.add(a.clubId);
    });
    currentUser.joinedClubIds.forEach((id) => clubIds.add(id));

    return Array.from(clubIds)
      .map((id) => db.getClubById(id))
      .filter((c): c is RunClub => c !== undefined);
  }, [allUserActivities, currentUser.joinedClubIds]);

  // Filter States
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [distanceCategory, setDistanceCategory] = useState<DistanceCategory>('all');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('all'); // 'all' | 'solo' | clubId
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [expandedRouteActId, setExpandedRouteActId] = useState<string | null>(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(true);

  // Reference dates for filtering
  const now = useMemo(() => new Date(), []);

  // Filter logic
  const filteredActivities = useMemo(() => {
    return allUserActivities.filter((act) => {
      const actDate = new Date(act.startTime);

      // 1. Date Range Filter
      if (datePreset === 'this_week') {
        const currentDayOfWeek = now.getDay();
        const distToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + distToMonday);
        monday.setHours(0, 0, 0, 0);

        if (actDate.getTime() < monday.getTime()) return false;
      } else if (datePreset === 'this_month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        if (actDate.getTime() < startOfMonth.getTime()) return false;
      } else if (datePreset === 'last_30_days') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        if (actDate.getTime() < thirtyDaysAgo.getTime()) return false;
      } else if (datePreset === 'last_90_days') {
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(now.getDate() - 90);
        if (actDate.getTime() < ninetyDaysAgo.getTime()) return false;
      } else if (datePreset === 'custom') {
        if (customStartDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          if (actDate.getTime() < start.getTime()) return false;
        }
        if (customEndDate) {
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          if (actDate.getTime() > end.getTime()) return false;
        }
      }

      // 2. Distance Categories Filter
      // short: < 5km, mid: 5-10km, long: 10-15km, half_marathon: >= 15km
      if (distanceCategory === 'short' && act.distanceKm >= 5.0) return false;
      if (distanceCategory === 'mid' && (act.distanceKm < 5.0 || act.distanceKm > 10.0)) return false;
      if (distanceCategory === 'long' && (act.distanceKm <= 10.0 || act.distanceKm > 15.0)) return false;
      if (distanceCategory === 'half_marathon' && act.distanceKm < 15.0) return false;

      // 3. Club Participation Filter
      if (selectedClubFilter === 'solo') {
        if (act.clubId) return false; // must be independent
      } else if (selectedClubFilter !== 'all') {
        if (act.clubId !== selectedClubFilter) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(q);
        const matchesClub = act.clubName?.toLowerCase().includes(q);
        const matchesCity = act.cityName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesClub && !matchesCity) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      if (sortBy === 'dist_desc') {
        return b.distanceKm - a.distanceKm;
      }
      if (sortBy === 'dist_asc') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'pace_asc') {
        return a.avgPaceSecondsPerKm - b.avgPaceSecondsPerKm; // fastest first
      }
      return 0;
    });
  }, [
    allUserActivities,
    datePreset,
    customStartDate,
    customEndDate,
    distanceCategory,
    selectedClubFilter,
    searchQuery,
    sortBy,
    now,
  ]);

  // Aggregate stats for current filtered selection
  const filteredMetrics = useMemo(() => {
    const totalDist = filteredActivities.reduce((acc, a) => acc + a.distanceKm, 0);
    const totalDuration = filteredActivities.reduce((acc, a) => acc + a.durationSeconds, 0);
    const avgPace =
      totalDist > 0 ? Math.round(totalDuration / totalDist) : 0;
    const totalElevation = filteredActivities.reduce((acc, a) => acc + (a.elevationGainMeters || 0), 0);

    return {
      count: filteredActivities.length,
      totalDist: Number(totalDist.toFixed(1)),
      avgPace,
      totalDuration,
      totalElevation,
    };
  }, [filteredActivities]);

  // Check if any filter is active
  const isFilterActive =
    datePreset !== 'all' ||
    distanceCategory !== 'all' ||
    selectedClubFilter !== 'all' ||
    searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setDistanceCategory('all');
    setSelectedClubFilter('all');
    setSearchQuery('');
    setSortBy('date_desc');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Optional Weekly Running Chart */}
      {showWeeklyChart && (
        <WeeklyRunningChart
          currentUser={currentUser}
          activities={allUserActivities}
          title="Weekly Running Trends & Cadence"
        />
      )}

      {/* 2. Filter & History Control Center */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        
        {/* Top Bar: Title, Search & Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-900 text-[#72D600]">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="font-display font-black text-lg text-slate-900 tracking-tight">
                My Runs & Activity History
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered history of all verified runs, paces, and club contributions
            </p>
          </div>

          {/* Quick Actions: Start Run & Filter Collapse Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onStartRun && (
              <button
                type="button"
                onClick={onStartRun}
                className="px-4 py-2 rounded-xl bg-[#72D600] hover:bg-[#65C800] text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START RUN</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isFilterActive
                  ? 'border-[#72D600] bg-lime-50/50 text-[#529d00]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-[#72D600]" />
              )}
              {showFilterDrawer ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search runs by title, location, or route..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#72D600]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#72D600]"
            >
              <option value="date_desc">Date: Newest First</option>
              <option value="date_asc">Date: Oldest First</option>
              <option value="dist_desc">Distance: Longest First</option>
              <option value="dist_asc">Distance: Shortest First</option>
              <option value="pace_asc">Pace: Fastest First</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Collapsible Filter Categories Box */}
        {showFilterDrawer && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            
            {/* Filter 1: Date Range */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Date Range:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'this_week', label: 'This Week' },
                  { id: 'this_month', label: 'This Month' },
                  { id: 'last_30_days', label: 'Last 30 Days' },
                  { id: 'last_90_days', label: 'Last 90 Days' },
                  { id: 'custom', label: 'Custom Range...' },
                ].map((preset) => {
                  const isActive = datePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setDatePreset(preset.id as DateRangePreset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Date Inputs */}
              {datePreset === 'custom' && (
                <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">From:</span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500">To:</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  {(customStartDate || customEndDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomStartDate('');
                        setCustomEndDate('');
                      }}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Clear dates
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Filter 2: Distance Categories */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <Zap className="w-3.5 h-3.5 text-slate-500" />
                <span>Distance Category:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Distances' },
                  { id: 'short', label: 'Short (< 5 KM)' },
                  { id: 'mid', label: 'Mid (5 - 10 KM)' },
                  { id: 'long', label: 'Long (10 - 15 KM)' },
                  { id: 'half_marathon', label: 'Half Marathon+ (15+ KM)' },
                ].map((cat) => {
                  const isActive = distanceCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDistanceCategory(cat.id as DistanceCategory)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#72D600] text-slate-950 font-bold shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter 3: Club Participation */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Club Participation:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedClubFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedClubFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  All Runs
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedClubFilter('solo')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedClubFilter === 'solo'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Solo / Independent
                </button>

                {availableClubs.map((club) => {
                  const isActive = selectedClubFilter === club.id;
                  return (
                    <button
                      key={club.id}
                      type="button"
                      onClick={() => setSelectedClubFilter(club.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-lime-200 border-lime-300 text-slate-950 font-bold'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{club.name}</span>
                      {currentUser.primaryClubId === club.id && (
                        <span className="text-[9px] px-1 py-0.2 bg-[#72D600] text-slate-900 rounded font-bold">
                          Primary
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filters Summary & Reset */}
            {isFilterActive && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span>Active filters applied</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Filtered Results Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 text-white rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Showing</span>
            <span className="font-mono font-bold text-white text-sm">
              {filteredMetrics.count} {filteredMetrics.count === 1 ? 'Run' : 'Runs'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">Total Distance</span>
              <strong className="text-[#72D600] text-sm">{filteredMetrics.totalDist} KM</strong>
            </div>

            {filteredMetrics.count > 0 && (
              <>
                <div className="w-px h-6 bg-slate-700" />
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">Avg Pace</span>
                  <strong className="text-white text-sm">{formatPace(filteredMetrics.avgPace)}/km</strong>
                </div>

                <div className="w-px h-6 bg-slate-700 hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-slate-400 text-[10px] block font-sans">Total Duration</span>
                  <strong className="text-white text-sm">{formatDuration(filteredMetrics.totalDuration)}</strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Run Activity Cards List */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-3.5">
            {filteredActivities.map((act) => {
              const isExpanded = expandedRouteActId === act.id;
              const hasMap = act.routePoints && act.routePoints.length > 1;

              return (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all space-y-3"
                >
                  {/* Top line: Title & Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-base text-slate-900">
                          {act.title}
                        </h4>
                        {act.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            GPS Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>
                          {new Date(act.startTime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>·</span>
                        <span>
                          {new Date(act.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>·</span>
                        <span className="capitalize">{act.subType.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Club Tag */}
                    {act.clubName ? (
                      <button
                        type="button"
                        onClick={() => act.clubId && onSelectClub?.(act.clubId)}
                        className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-xl bg-lime-50 text-[#529d00] font-bold border border-lime-200 hover:bg-lime-100 transition-colors flex items-center gap-1"
                      >
                        <Users className="w-3 h-3" />
                        <span>{act.clubName}</span>
                      </button>
                    ) : (
                      <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-semibold">
                        Solo Run
                      </span>
                    )}
                  </div>

                  {/* Primary Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3.5 bg-slate-50 rounded-2xl text-xs font-mono text-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans font-medium uppercase tracking-wider">
                        Distance
                      </span>
                      <strong className="text-base sm:text-lg font-display font-black text-slate-900">
                        {act.distanceKm.toFixed(2)} <span className="text-xs font-normal">KM</span>
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans font-medium uppercase tracking-wider">
                        Avg Pace
                      </span>
                      <strong className="text-base sm:text-lg font-display font-black text-slate-900">
                        {formatPace(act.avgPaceSecondsPerKm)}
                        <span className="text-xs font-normal">/km</span>
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans font-medium uppercase tracking-wider">
                        Duration
                      </span>
                      <strong className="text-base sm:text-lg font-display font-black text-slate-900">
                        {formatDuration(act.durationSeconds)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block font-sans font-medium uppercase tracking-wider">
                        Elevation
                      </span>
                      <strong className="text-base sm:text-lg font-display font-black text-slate-900">
                        +{act.elevationGainMeters}m
                      </strong>
                    </div>
                  </div>

                  {/* Optional Interactive Route Map Drawer */}
                  {isExpanded && hasMap && (
                    <div className="pt-2 animate-in fade-in-50">
                      <div className="rounded-2xl overflow-hidden border border-slate-200">
                        <LeafletRouteMap
                          points={act.routePoints}
                          className="h-52 w-full"
                          interactive={true}
                          followRunner={false}
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Footer: GPS Map toggle & Kudos */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      {hasMap && (
                        <button
                          type="button"
                          onClick={() => setExpandedRouteActId(isExpanded ? null : act.id)}
                          className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#65C800]" />
                          <span>{isExpanded ? 'Hide Route Map' : 'View Route Map'}</span>
                        </button>
                      )}

                      <span className="text-slate-400">·</span>

                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{act.kudosUserIds.length} kudos</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      📍 {act.cityName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-3xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-200/80 mx-auto flex items-center justify-center text-slate-500">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-display font-black text-base text-slate-900">
              No runs match your current filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your date range, distance categories, or club participation filters to see your logged miles.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
              {onStartRun && (
                <button
                  type="button"
                  onClick={onStartRun}
                  className="px-4 py-2 rounded-xl bg-[#72D600] text-slate-950 font-bold text-xs hover:bg-[#65C800] transition-colors"
                >
                  Track New Run
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
