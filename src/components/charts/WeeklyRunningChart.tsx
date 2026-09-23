/**
 * RunFam Weekly Running Distance Bar Chart
 * Powered by Recharts
 * Visualizes running trends with daily and multi-week perspectives
 */

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Calendar, Zap, ArrowUpRight, Flame } from 'lucide-react';
import { Activity, User } from '../../types';
import { db } from '../../services/db';

interface WeeklyRunningChartProps {
  currentUser: User;
  activities?: Activity[];
  compact?: boolean;
  onViewAllRuns?: () => void;
  title?: string;
}

interface DailyChartData {
  dayName: string;
  dayShort: string;
  dateStr: string;
  dateLabel: string;
  distanceKm: number;
  runsCount: number;
  isToday: boolean;
  isFuture: boolean;
  activities: Activity[];
}

interface WeeklyTrendData {
  weekLabel: string;
  weekShort: string;
  startDate: string;
  endDate: string;
  distanceKm: number;
  runsCount: number;
  isCurrentWeek: boolean;
}

export const WeeklyRunningChart: React.FC<WeeklyRunningChartProps> = ({
  currentUser,
  activities: propActivities,
  compact = false,
  onViewAllRuns,
  title = 'Weekly Running Distance',
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'trends'>('daily');

  // Load activities if not passed
  const userActivities = useMemo(() => {
    if (propActivities) return propActivities;
    return db.getActivities({ userId: currentUser.id });
  }, [propActivities, currentUser.id]);

  // Compute reference date (defaults to current date, or fallback)
  const now = useMemo(() => new Date(), []);

  // 1. Calculate Daily Breakdown for This Week (Monday -> Sunday)
  const dailyData: DailyChartData[] = useMemo(() => {
    // Determine current Monday
    const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const days: DailyChartData[] = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      // Match user activities on this date
      const matched = userActivities.filter((act) => {
        const actDate = new Date(act.startTime).toISOString().split('T')[0];
        return actDate === dateStr && act.verificationStatus !== 'rejected';
      });

      const dist = matched.reduce((sum, a) => sum + a.distanceKm, 0);
      const isToday = dateStr === now.toISOString().split('T')[0];
      const isFuture = d.getTime() > now.getTime() && !isToday;

      days.push({
        dayName: dayNames[i],
        dayShort: `${dayNames[i]} ${d.getDate()}`,
        dateStr,
        dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        distanceKm: Number(dist.toFixed(2)),
        runsCount: matched.length,
        isToday,
        isFuture,
        activities: matched,
      });
    }

    return days;
  }, [userActivities, now]);

  // 2. Calculate Past 8 Weeks Trend
  const weeklyTrends: WeeklyTrendData[] = useMemo(() => {
    const trends: WeeklyTrendData[] = [];
    const currentDayOfWeek = now.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() + distanceToMonday);
    currentMonday.setHours(0, 0, 0, 0);

    // Compute last 8 weeks (from oldest to current)
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(currentMonday);
      weekStart.setDate(currentMonday.getDate() - w * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const matched = userActivities.filter((act) => {
        const actTime = new Date(act.startTime).getTime();
        return (
          actTime >= weekStart.getTime() &&
          actTime <= weekEnd.getTime() &&
          act.verificationStatus !== 'rejected'
        );
      });

      const totalKm = matched.reduce((sum, a) => sum + a.distanceKm, 0);
      const isCurrentWeek = w === 0;

      const label = isCurrentWeek
        ? 'This Week'
        : `W-${w}`;
      const shortLabel = `${weekStart.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`;

      trends.push({
        weekLabel: label,
        weekShort: shortLabel,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        distanceKm: Number(totalKm.toFixed(1)),
        runsCount: matched.length,
        isCurrentWeek,
      });
    }

    return trends;
  }, [userActivities, now]);

  // Summary Metrics
  const thisWeekTotalKm = useMemo(() => {
    return dailyData.reduce((acc, d) => acc + d.distanceKm, 0);
  }, [dailyData]);

  const activeDaysThisWeek = useMemo(() => {
    return dailyData.filter((d) => d.distanceKm > 0).length;
  }, [dailyData]);

  const eightWeeksAvgKm = useMemo(() => {
    const total = weeklyTrends.reduce((acc, w) => acc + w.distanceKm, 0);
    return Number((total / weeklyTrends.length).toFixed(1));
  }, [weeklyTrends]);

  const maxDaily = useMemo(() => {
    return Math.max(...dailyData.map((d) => d.distanceKm), 5);
  }, [dailyData]);

  const maxWeekly = useMemo(() => {
    return Math.max(...weeklyTrends.map((w) => w.distanceKm), 10);
  }, [weeklyTrends]);

  // Custom Tooltip for Daily Breakdown
  const CustomDailyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailyChartData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md text-xs min-w-[170px] z-50 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-bold text-slate-200">
              {data.dayName}, {data.dateLabel}
            </span>
            {data.isToday && (
              <span className="px-1.5 py-0.5 rounded bg-[#72D600] text-slate-950 font-black text-[9px] uppercase tracking-wide">
                Today
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-xl font-display font-black text-[#72D600] font-mono">
              {data.distanceKm.toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-slate-400">KM</span>
          </div>

          {data.runsCount > 0 ? (
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                {data.runsCount} {data.runsCount === 1 ? 'Run Logged' : 'Runs Logged'}
              </span>
              {data.activities.map((act) => (
                <div key={act.id} className="text-[11px] text-slate-300 truncate">
                  • {act.title}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">
              {data.isFuture ? 'Upcoming day' : 'Rest day (0 KM)'}
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Weekly Trends
  const CustomWeeklyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: WeeklyTrendData = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md text-xs min-w-[170px] z-50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-bold text-slate-200">{data.weekLabel}</span>
            {data.isCurrentWeek && (
              <span className="px-1.5 py-0.5 rounded bg-[#72D600] text-slate-950 font-black text-[9px]">
                Active
              </span>
            )}
          </div>

          <p className="text-[10px] text-slate-400 mb-1">
            {data.startDate} to {data.endDate}
          </p>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-display font-black text-[#72D600] font-mono">
              {data.distanceKm.toFixed(1)}
            </span>
            <span className="text-[11px] font-bold text-slate-400">KM</span>
            <span className="text-slate-400 text-[10px] ml-auto">
              ({data.runsCount} runs)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Header bar with title & view switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-lime-100 text-[#529d00]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-display font-black text-sm sm:text-base text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {viewMode === 'daily'
              ? 'Daily distance rhythm for this week'
              : '8-week mileage progression & endurance build'}
          </p>
        </div>

        {/* View mode toggle button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode('trends')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'trends'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              8-Week Trend
            </button>
          </div>

          {onViewAllRuns && (
            <button
              type="button"
              onClick={onViewAllRuns}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors text-xs font-semibold flex items-center gap-1"
              title="View Filtered Activity History"
            >
              <span className="hidden sm:inline">My Runs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {viewMode === 'daily' ? 'Week Total' : '8-Week Total'}
          </span>
          <p className="text-base sm:text-lg font-display font-black text-slate-900 font-mono tabular-nums">
            {viewMode === 'daily'
              ? `${thisWeekTotalKm.toFixed(1)} KM`
              : `${weeklyTrends.reduce((a, b) => a + b.distanceKm, 0).toFixed(1)} KM`}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {viewMode === 'daily' ? 'Active Days' : 'Weekly Avg'}
          </span>
          <p className="text-base sm:text-lg font-display font-black text-[#529d00] font-mono tabular-nums">
            {viewMode === 'daily'
              ? `${activeDaysThisWeek} / 7 Days`
              : `${eightWeeksAvgKm.toFixed(1)} KM/wk`}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Streak Status
          </span>
          <p className="text-base sm:text-lg font-display font-black text-orange-600 font-mono tabular-nums flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{currentUser.streakDays}d Fire</span>
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Peak Run
          </span>
          <p className="text-base sm:text-lg font-display font-black text-slate-900 font-mono tabular-nums">
            {Math.max(...dailyData.map((d) => d.distanceKm)).toFixed(1)} KM
          </p>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full" style={{ height: compact ? 190 : 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'daily' ? (
            <BarChart
              data={dailyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="dayShort"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                domain={[0, Math.ceil(maxDaily * 1.15)]}
                tickFormatter={(val) => `${val}k`}
              />
              <Tooltip
                content={<CustomDailyTooltip />}
                cursor={{ fill: '#F8FAFC' }}
              />
              <Bar
                dataKey="distanceKm"
                radius={[8, 8, 0, 0]}
                maxBarSize={44}
                animationDuration={600}
              >
                {dailyData.map((entry, index) => {
                  let fillColor = '#CBD5E1'; // light slate for 0 km or rest
                  if (entry.distanceKm > 0) {
                    fillColor = entry.isToday ? '#72D600' : '#8CE32A';
                  } else if (entry.isToday) {
                    fillColor = '#E2E8F0';
                  }

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={fillColor}
                      stroke={entry.isToday ? '#529d00' : 'transparent'}
                      strokeWidth={entry.isToday ? 2 : 0}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={weeklyTrends}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="weekShort"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
                domain={[0, Math.ceil(maxWeekly * 1.2)]}
                tickFormatter={(val) => `${val}k`}
              />
              <Tooltip
                content={<CustomWeeklyTooltip />}
                cursor={{ fill: '#F8FAFC' }}
              />
              <ReferenceLine
                y={eightWeeksAvgKm}
                stroke="#64748B"
                strokeDasharray="4 4"
                label={{
                  value: `Avg ${eightWeeksAvgKm}k`,
                  position: 'right',
                  fill: '#94A3B8',
                  fontSize: 10,
                  fontFamily: 'monospace',
                }}
              />
              <Bar
                dataKey="distanceKm"
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
                animationDuration={600}
              >
                {weeklyTrends.map((entry, index) => (
                  <Cell
                    key={`w-cell-${index}`}
                    fill={entry.isCurrentWeek ? '#72D600' : '#334155'}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#72D600]" />
            <span>Today / Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#8CE32A]" />
            <span>Completed Run</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
            <span>Rest Day</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-slate-400">
          Target: 25 KM / week
        </span>
      </div>
    </div>
  );
};
