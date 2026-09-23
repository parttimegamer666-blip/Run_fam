/**
 * RunFam Core Data Types
 * Comprehensive relational schema matching business specifications
 */

export type SportType = 'running' | 'cycling' | 'swimming' | 'hiking';

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export type RunningSubtype = 'outdoor_run' | 'road_run' | 'trail_run' | 'track_run';

export type ActivityPrivacy = 'public' | 'club_only' | 'private';

export type VerificationStatus = 'verified' | 'pending' | 'flagged' | 'rejected';

export type ClubRole = 'owner' | 'admin' | 'moderator' | 'member';

export type ClubPrivacy = 'public' | 'approval_required' | 'private';

export type RunningLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

export type DistancePreference = '3-5k' | '5-10k' | '10-15k' | '15k+' | 'mixed';

export type LeaderboardPeriod = 'today' | 'week' | 'month' | 'year' | 'all_time';

export type LeaderboardMetric = 'distance' | 'active_days' | 'consistency' | 'longest_run' | 'pace';

export interface GPSPoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  speed?: number; // m/s
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  cityId: string;
  cityName: string;
  state: string;
  country: string;
  neighborhood?: string;
  age?: number;
  gender?: string;
  primaryClubId?: string;
  joinedClubIds: string[];
  createdAt: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  role?: UserRole;
  account_status?: AccountStatus;
  passwordHash?: string;
  passwordSalt?: string;
  onboarding_completed?: boolean;
  updated_at?: string;
  last_login_at?: string;
  state_id?: string;
  streakDays: number;
  lastActiveDate: string;
  // Aggregated lifetime stats
  totalDistanceKm: number;
  totalRuns: number;
  longestRunKm: number;
  monthDistanceKm: number;
  weekDistanceKm: number;
  yearDistanceKm: number;
  cityRank: number;
  clubRank: number;
}

export interface RunClub {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  cityId: string;
  cityName: string;
  state?: string;
  country?: string;
  neighborhood: string;
  runningLevel: RunningLevel;
  typicalDistance: DistancePreference;
  typicalTime: string;
  schedule?: string;
  meetingPoint?: string;
  privacy: ClubPrivacy;
  rules?: string[];
  ownerId: string;
  adminIds: string[];
  memberIds: string[];
  createdAt: string;
  isVerified: boolean;
  isSuspended?: boolean;
  // Aggregated stats
  monthlyDistanceKm: number;
  weeklyDistanceKm: number;
  yearlyDistanceKm: number;
  totalDistanceKm: number;
  totalActivitiesCount: number;
  activeMembersCount: number;
  clubRank: number;
  avgDistancePerActiveMemberKm: number;
  inviteCode: string;
}

export interface ClubMemberInfo {
  userId: string;
  user: User;
  role: ClubRole;
  joinedAt: string;
  monthContributionKm: number;
  totalContributionKm: number;
  clubRank: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  sport: SportType;
  subType: RunningSubtype;
  distanceKm: number;
  durationSeconds: number; // in seconds
  avgPaceSecondsPerKm: number; // e.g. 344 sec = 5:44 / km
  avgSpeedKmh: number;
  elevationGainMeters: number;
  maxSpeedKmh?: number;
  routePoints: GPSPoint[];
  startTime: string;
  endTime: string;
  privacy: ActivityPrivacy;
  clubId?: string;
  clubName?: string;
  cityId: string;
  cityName: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  isSimulated?: boolean;
  kudosUserIds: string[];
  commentsCount: number;
}

export interface ActivityComment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface ClubRunEvent {
  id: string;
  clubId: string;
  clubName: string;
  clubLogo?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  meetingLocation: string;
  neighborhood: string;
  cityName: string;
  targetDistanceKm: number;
  estimatedPace: string;
  organizerId: string;
  organizerName: string;
  participantUserIds: string[];
  maxParticipants?: number;
  routeDescription?: string;
  isCompleted?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'club' | 'city';
  targetKm: number;
  currentKm: number;
  startDate: string;
  endDate: string;
  participantUserIds: string[];
  participantClubIds?: string[];
  cityId?: string;
  cityName?: string;
  badgeName: string;
  badgeIcon: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'distance' | 'streak' | 'rank' | 'milestone';
  requiredKm?: number;
  requiredStreak?: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  country: string;
  isActive: boolean;
  totalDistanceKm: number;
  monthlyGoalKm: number;
  currentMonthProgressKm: number;
  totalRunnersCount: number;
  totalRunClubsCount: number;
  totalRunsCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhoods: string[];
  milestonesPassed: number[]; // e.g. [10000, 25000, 50000]
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'achievement' | 'challenge' | 'club' | 'city' | 'kudos' | 'moderation';
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  clubName?: string;
  clubId?: string;
  metricValue: number; // distance in km or days
  metricDisplay: string;
  activeMembers?: number;
  avgDistancePerMember?: number;
}
