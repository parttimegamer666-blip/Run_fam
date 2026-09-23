/**
 * RunFam Database & Local Persistence Layer
 * Complete with realistic seed data for Chhatrapati Sambhajinagar,
 * relational operations, anti-cheat validation, and aggregated rankings.
 */

import {
  User,
  RunClub,
  Activity,
  Challenge,
  ClubRunEvent,
  Achievement,
  CityData,
  NotificationItem,
  LeaderboardEntry,
  LeaderboardPeriod,
  LeaderboardMetric,
  VerificationStatus,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'runfam_users_v1',
  CLUBS: 'runfam_clubs_v1',
  ACTIVITIES: 'runfam_activities_v2',
  CHALLENGES: 'runfam_challenges_v1',
  EVENTS: 'runfam_events_v1',
  ACHIEVEMENTS: 'runfam_achievements_v1',
  CITY: 'runfam_city_csn_v1',
  CURRENT_USER_ID: 'runfam_active_uid_v1',
  NOTIFICATIONS: 'runfam_notifications_v1',
};

// Default Launch City: Chhatrapati Sambhajinagar
export const INITIAL_CITY_DATA: CityData = {
  id: 'city_csn',
  name: 'Chhatrapati Sambhajinagar',
  state: 'Maharashtra',
  country: 'India',
  isActive: true,
  totalDistanceKm: 67420,
  monthlyGoalKm: 100000,
  currentMonthProgressKm: 67420,
  totalRunnersCount: 2341,
  totalRunClubsCount: 37,
  totalRunsCount: 8921,
  coordinates: {
    lat: 19.8762,
    lng: 75.3433,
  },
  neighborhoods: [
    'Waluj',
    'CIDCO',
    'Cannaught Place',
    'Kranti Chowk',
    'Shendra',
    'University Campus',
    'Garkheda',
    'Beed Bypass',
    'Jalna Road',
    'Shahgunj',
  ],
  milestonesPassed: [10000, 25000, 50000],
};

// Seed Run Clubs
export const INITIAL_RUN_CLUBS: RunClub[] = [
  {
    id: 'club_central_city',
    name: 'Central City Run Club',
    slug: 'central-city-run-club',
    tagline: 'Heart of the historic city on the move',
    description: 'Chhatrapati Sambhajinagar’s premiere downtown running collective. Regular dawn runs connecting Kranti Chowk, Jubilee Park, and Connaught Place.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'Kranti Chowk',
    runningLevel: 'mixed',
    typicalDistance: '5-10k',
    typicalTime: '05:30 AM',
    privacy: 'public',
    rules: ['Respect every pace', 'High-vis wear for dawn runs', 'Leave no runner behind'],
    ownerId: 'u_vikram',
    adminIds: ['u_vikram', 'u_aniket'],
    memberIds: ['u_vikram', 'u_aniket', 'u_rahul', 'u_priya'],
    createdAt: '2025-01-10T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 4210.5,
    weeklyDistanceKm: 980.2,
    yearlyDistanceKm: 34500,
    totalDistanceKm: 42100,
    totalActivitiesCount: 684,
    activeMembersCount: 215,
    clubRank: 1,
    avgDistancePerActiveMemberKm: 19.5,
    inviteCode: 'CENTRAL-CSN-01',
  },
  {
    id: 'club_csn_weekend_warriors',
    name: 'CSN Weekend Warriors',
    slug: 'csn-weekend-warriors',
    tagline: 'Conquering weekend miles together across Sambhajinagar',
    description: 'Saturday and Sunday long run crew starting from Prozone Mall & Cannaught Place. Half marathon training, tempo runs, and community breakfast after.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'Cannaught Place',
    runningLevel: 'intermediate',
    typicalDistance: '10-15k',
    typicalTime: '06:00 AM',
    privacy: 'public',
    rules: ['Hydration mandatory for >10K', 'Pacing pacers provided', 'Celebrate every personal record'],
    ownerId: 'u_priya',
    adminIds: ['u_priya', 'u_kavita'],
    memberIds: ['u_priya', 'u_rahul', 'u_vikram'],
    createdAt: '2025-02-01T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 3420.8,
    weeklyDistanceKm: 810.4,
    yearlyDistanceKm: 28900,
    totalDistanceKm: 33800,
    totalActivitiesCount: 490,
    activeMembersCount: 174,
    clubRank: 2,
    avgDistancePerActiveMemberKm: 19.6,
    inviteCode: 'CSN-WARRIORS',
  },
  {
    id: 'club_waluj_runners',
    name: 'Waluj Runners',
    slug: 'waluj-runners',
    tagline: 'Industrial grit, pure running passion',
    description: 'Home of the Waluj industrial zone and MIDC runners. Early morning road miles before shifts and vibrant weekend trail loops toward the hills.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'Waluj',
    runningLevel: 'mixed',
    typicalDistance: '5-10k',
    typicalTime: '05:45 AM',
    privacy: 'public',
    rules: ['Punctual 5:45 AM rollout', 'Support newer runners', 'Safety vests recommended on highway stretches'],
    ownerId: 'u_rahul',
    adminIds: ['u_rahul', 'u_sachin'],
    memberIds: ['u_rahul', 'u_amit', 'u_rohit'],
    createdAt: '2025-01-15T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 2840.4,
    weeklyDistanceKm: 720.0,
    yearlyDistanceKm: 24100,
    totalDistanceKm: 28400,
    totalActivitiesCount: 420,
    activeMembersCount: 128,
    clubRank: 3,
    avgDistancePerActiveMemberKm: 22.1,
    inviteCode: 'WALUJ-RUNS',
  },
  {
    id: 'club_cidco_run_crew',
    name: 'CIDCO Run Crew',
    slug: 'cidco-run-crew',
    tagline: 'Street runners of CIDCO sectors N-1 to N-7',
    description: 'Fast, friendly community crew running the broad boulevards of CIDCO and Cannaught Garden. Track sessions every Tuesday at Cannaught grounds.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'CIDCO',
    runningLevel: 'intermediate',
    typicalDistance: '5-10k',
    typicalTime: '06:15 AM',
    privacy: 'public',
    rules: ['Warm up together', 'No headphones during group track drills'],
    ownerId: 'u_aniket',
    adminIds: ['u_aniket'],
    memberIds: ['u_aniket', 'u_rahul', 'u_sneha'],
    createdAt: '2025-03-01T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 2120.0,
    weeklyDistanceKm: 530.0,
    yearlyDistanceKm: 18200,
    totalDistanceKm: 21200,
    totalActivitiesCount: 310,
    activeMembersCount: 96,
    clubRank: 4,
    avgDistancePerActiveMemberKm: 22.0,
    inviteCode: 'CIDCO-CREW',
  },
  {
    id: 'club_university_striders',
    name: 'University Run Crew',
    slug: 'university-run-crew',
    tagline: 'Campus green loops and mountain trail reps',
    description: 'Based at Dr. Babasaheb Ambedkar Marathwada University campus. Shaded tree avenues, botanical garden loops, and scenic hill repeats.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'University Campus',
    runningLevel: 'beginner',
    typicalDistance: '3-5k',
    typicalTime: '06:00 AM',
    privacy: 'public',
    rules: ['Open to students, faculty, and city residents', 'Zero trash on campus grounds'],
    ownerId: 'u_sneha',
    adminIds: ['u_sneha'],
    memberIds: ['u_sneha', 'u_rahul', 'u_tanvi'],
    createdAt: '2025-02-14T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 1680.5,
    weeklyDistanceKm: 410.0,
    yearlyDistanceKm: 14500,
    totalDistanceKm: 16800,
    totalActivitiesCount: 260,
    activeMembersCount: 84,
    clubRank: 5,
    avgDistancePerActiveMemberKm: 20.0,
    inviteCode: 'BAMU-PACE',
  },
  {
    id: 'club_shendra_striders',
    name: 'Shendra Striders',
    slug: 'shendra-striders',
    tagline: 'High-speed long-stretch running in the DMIC corridor',
    description: 'Long open highway boulevards and quiet industrial park tarmac. Great for marathon pacing and sustained aerodynamic tempo workouts.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'Shendra',
    runningLevel: 'advanced',
    typicalDistance: '15k+',
    typicalTime: '05:15 AM',
    privacy: 'public',
    rules: ['Sub 6:00/km recommended pace for group long runs'],
    ownerId: 'u_vikram',
    adminIds: ['u_vikram'],
    memberIds: ['u_vikram', 'u_amit'],
    createdAt: '2025-03-10T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 1420.2,
    weeklyDistanceKm: 360.5,
    yearlyDistanceKm: 11900,
    totalDistanceKm: 14200,
    totalActivitiesCount: 195,
    activeMembersCount: 62,
    clubRank: 6,
    avgDistancePerActiveMemberKm: 22.9,
    inviteCode: 'SHENDRA-RUN',
  },
  {
    id: 'club_garkheda_gallopers',
    name: 'Garkheda Gallopers',
    slug: 'garkheda-gallopers',
    tagline: 'Track intervals & stadium loop specialists',
    description: 'Training around Garkheda sports stadium and surrounding avenues. Interval sessions, 5K personal best drills, and youth running clinics.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'Garkheda',
    runningLevel: 'mixed',
    typicalDistance: '5-10k',
    typicalTime: '06:30 AM',
    privacy: 'public',
    rules: ['All ages welcome'],
    ownerId: 'u_kavita',
    adminIds: ['u_kavita'],
    memberIds: ['u_kavita', 'u_tanvi'],
    createdAt: '2025-03-20T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 1150.0,
    weeklyDistanceKm: 290.0,
    yearlyDistanceKm: 9800,
    totalDistanceKm: 11500,
    totalActivitiesCount: 160,
    activeMembersCount: 58,
    clubRank: 7,
    avgDistancePerActiveMemberKm: 19.8,
    inviteCode: 'GARKHEDA-PACE',
  },
  {
    id: 'club_cannaught_pacers',
    name: 'Cannaught Pacers',
    slug: 'cannaught-pacers',
    tagline: 'Coffee and morning miles around the plaza',
    description: 'Casual running crew gathering outside Cannaught cafes every Thursday and Sunday morning for gentle 5K and 7K social loops.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    neighborhood: 'Cannaught Place',
    runningLevel: 'beginner',
    typicalDistance: '3-5k',
    typicalTime: '06:30 AM',
    privacy: 'public',
    rules: ['Post-run chai is mandatory'],
    ownerId: 'u_priya',
    adminIds: ['u_priya'],
    memberIds: ['u_priya', 'u_rohit'],
    createdAt: '2025-04-01T06:00:00Z',
    isVerified: true,
    monthlyDistanceKm: 890.0,
    weeklyDistanceKm: 210.0,
    yearlyDistanceKm: 7600,
    totalDistanceKm: 8900,
    totalActivitiesCount: 130,
    activeMembersCount: 45,
    clubRank: 8,
    avgDistancePerActiveMemberKm: 19.7,
    inviteCode: 'CANNAUGHT-RUN',
  },
];

// Seed Users
export const INITIAL_USERS: User[] = [
  {
    id: 'u_rahul',
    name: 'Rahul Sharma',
    username: 'rahul_runs',
    email: 'rahul.sharma@runfam.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Marathon trainee & Waluj Runners member. Running 5 mornings a week across Chhatrapati Sambhajinagar.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'Waluj',
    age: 26,
    gender: 'Male',
    primaryClubId: 'club_waluj_runners',
    joinedClubIds: ['club_waluj_runners', 'club_csn_weekend_warriors', 'club_central_city'],
    createdAt: '2025-01-10T00:00:00Z',
    isAdmin: false,
    streakDays: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalDistanceKm: 489.2,
    totalRuns: 64,
    longestRunKm: 18.4,
    monthDistanceKm: 87.4,
    weekDistanceKm: 24.7,
    yearDistanceKm: 489.2,
    cityRank: 47,
    clubRank: 3,
  },
  {
    id: 'u_priya',
    name: 'Priya Patil',
    username: 'priya_paces',
    email: 'priya.patil@runfam.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Founder of CSN Weekend Warriors. Pacing the city to 100K monthly goal.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'Cannaught Place',
    age: 28,
    gender: 'Female',
    primaryClubId: 'club_csn_weekend_warriors',
    joinedClubIds: ['club_csn_weekend_warriors', 'club_central_city'],
    createdAt: '2025-01-05T00:00:00Z',
    isAdmin: false,
    streakDays: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalDistanceKm: 1240.5,
    totalRuns: 142,
    longestRunKm: 25.2,
    monthDistanceKm: 176.8,
    weekDistanceKm: 42.5,
    yearDistanceKm: 1240.5,
    cityRank: 2,
    clubRank: 1,
  },
  {
    id: 'u_vikram',
    name: 'Vikram Deshmukh',
    username: 'vikram_marathon',
    email: 'vikram.d@runfam.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Sub-3 hour marathon runner. Leading Central City Run Club from the front.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'Kranti Chowk',
    age: 32,
    gender: 'Male',
    primaryClubId: 'club_central_city',
    joinedClubIds: ['club_central_city', 'club_shendra_striders'],
    createdAt: '2024-12-15T00:00:00Z',
    isAdmin: false,
    streakDays: 21,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalDistanceKm: 1680.0,
    totalRuns: 180,
    longestRunKm: 32.0,
    monthDistanceKm: 182.4,
    weekDistanceKm: 48.0,
    yearDistanceKm: 1680.0,
    cityRank: 1,
    clubRank: 1,
  },
  {
    id: 'u_aniket',
    name: 'Aniket Jadhav',
    username: 'aniket_speed',
    email: 'aniket.j@runfam.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'CIDCO Run Crew organizer. 10K specialist.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'CIDCO',
    age: 25,
    gender: 'Male',
    primaryClubId: 'club_cidco_run_crew',
    joinedClubIds: ['club_cidco_run_crew', 'club_central_city'],
    createdAt: '2025-01-12T00:00:00Z',
    isAdmin: false,
    streakDays: 9,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalDistanceKm: 980.2,
    totalRuns: 110,
    longestRunKm: 21.1,
    monthDistanceKm: 169.2,
    weekDistanceKm: 38.6,
    yearDistanceKm: 980.2,
    cityRank: 3,
    clubRank: 1,
  },
  {
    id: 'u_sneha',
    name: 'Sneha Kulkarni',
    username: 'sneha_runs',
    email: 'sneha.k@runfam.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Trail explorer & University Run Crew captain. Love early sunrise campus runs.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'University Campus',
    age: 24,
    gender: 'Female',
    primaryClubId: 'club_university_striders',
    joinedClubIds: ['club_university_striders'],
    createdAt: '2025-02-01T00:00:00Z',
    isAdmin: false,
    streakDays: 6,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalDistanceKm: 620.0,
    totalRuns: 78,
    longestRunKm: 15.0,
    monthDistanceKm: 132.5,
    weekDistanceKm: 28.0,
    yearDistanceKm: 620.0,
    cityRank: 8,
    clubRank: 1,
  },
  {
    id: 'u_admin',
    name: 'RunFam Administrator',
    username: 'runfam_admin',
    email: 'admin@runfam.com',
    avatarUrl: '/runfam-icon.svg',
    bio: 'RunFam Official City Moderator & League Commissioner for Chhatrapati Sambhajinagar.',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    country: 'India',
    neighborhood: 'Cannaught Place',
    age: 30,
    primaryClubId: 'club_central_city',
    joinedClubIds: ['club_central_city', 'club_waluj_runners', 'club_csn_weekend_warriors'],
    createdAt: '2024-12-01T00:00:00Z',
    isAdmin: true,
    streakDays: 30,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalDistanceKm: 850.0,
    totalRuns: 95,
    longestRunKm: 21.1,
    monthDistanceKm: 120.0,
    weekDistanceKm: 25.0,
    yearDistanceKm: 850.0,
    cityRank: 12,
    clubRank: 4,
  },
];

// Seed realistic GPS routes in Chhatrapati Sambhajinagar
const CSN_ROUTE_PROZONE = [
  { latitude: 19.8762, longitude: 75.3433, timestamp: 1740000000000 },
  { latitude: 19.8775, longitude: 75.3460, timestamp: 1740000300000 },
  { latitude: 19.8790, longitude: 75.3495, timestamp: 1740000600000 },
  { latitude: 19.8812, longitude: 75.3530, timestamp: 1740000900000 },
  { latitude: 19.8835, longitude: 75.3565, timestamp: 1740001200000 },
  { latitude: 19.8820, longitude: 75.3590, timestamp: 1740001500000 },
  { latitude: 19.8800, longitude: 75.3550, timestamp: 1740001800000 },
  { latitude: 19.8778, longitude: 75.3480, timestamp: 1740002100000 },
  { latitude: 19.8764, longitude: 75.3435, timestamp: 1740002400000 },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_001',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Sunrise Waluj MIDC 7K Tempo',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 7.42,
    durationSeconds: 2551, // 42m 31s
    avgPaceSecondsPerKm: 344, // 5:44 / km
    avgSpeedKmh: 10.47,
    elevationGainMeters: 82,
    maxSpeedKmh: 13.8,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-22T06:05:00Z',
    endTime: '2026-09-22T06:47:31Z',
    privacy: 'public',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_aniket', 'u_vikram'],
    commentsCount: 2,
  },
  {
    id: 'act_001_b',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Dawn Solo Shakeout & Strides',
    sport: 'running',
    subType: 'outdoor_run',
    distanceKm: 5.15,
    durationSeconds: 1699, // 28m 19s
    avgPaceSecondsPerKm: 330, // 5:30 / km
    avgSpeedKmh: 10.91,
    elevationGainMeters: 45,
    maxSpeedKmh: 14.2,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-21T05:50:00Z',
    endTime: '2026-09-21T06:18:19Z',
    privacy: 'public',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya'],
    commentsCount: 1,
  },
  {
    id: 'act_001_c',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Sunday Prozone to Jalna Long Run',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 14.8,
    durationSeconds: 4972, // 1h 22m 52s
    avgPaceSecondsPerKm: 336, // 5:36 / km
    avgSpeedKmh: 10.71,
    elevationGainMeters: 135,
    maxSpeedKmh: 13.5,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-20T06:00:00Z',
    endTime: '2026-09-20T07:22:52Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_vikram', 'u_aniket'],
    commentsCount: 3,
  },
  {
    id: 'act_001_d',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Waluj Industrial Speed Intervals',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 6.2,
    durationSeconds: 2046, // 34m 06s
    avgPaceSecondsPerKm: 330, // 5:30 / km
    avgSpeedKmh: 10.91,
    elevationGainMeters: 55,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-18T06:10:00Z',
    endTime: '2026-09-18T06:44:06Z',
    privacy: 'public',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_vikram'],
    commentsCount: 0,
  },
  {
    id: 'act_001_e',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Midweek Central City Twilight Loop',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 8.5,
    durationSeconds: 2890, // 48m 10s
    avgPaceSecondsPerKm: 340, // 5:40 / km
    avgSpeedKmh: 10.59,
    elevationGainMeters: 78,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-16T18:15:00Z',
    endTime: '2026-09-16T19:03:10Z',
    privacy: 'public',
    clubId: 'club_central_city',
    clubName: 'Central City Run Club',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_vikram'],
    commentsCount: 1,
  },
  {
    id: 'act_001_f',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Easy Recovery Shakeout',
    sport: 'running',
    subType: 'outdoor_run',
    distanceKm: 3.8,
    durationSeconds: 1368, // 22m 48s
    avgPaceSecondsPerKm: 360, // 6:00 / km
    avgSpeedKmh: 10.0,
    elevationGainMeters: 30,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-15T06:30:00Z',
    endTime: '2026-09-15T06:52:48Z',
    privacy: 'public',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_aniket'],
    commentsCount: 0,
  },
  {
    id: 'act_001_g',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Waluj Morning 6K Pace Build',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 6.0,
    durationSeconds: 1980, // 33m 00s
    avgPaceSecondsPerKm: 330, // 5:30 / km
    avgSpeedKmh: 10.91,
    elevationGainMeters: 50,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-14T06:00:00Z',
    endTime: '2026-09-14T06:33:00Z',
    privacy: 'public',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya'],
    commentsCount: 0,
  },
  {
    id: 'act_001_h',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Weekend Warriors 18K Long Run Peak',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 18.4,
    durationSeconds: 6182, // 1h 43m 02s
    avgPaceSecondsPerKm: 336, // 5:36 / km
    avgSpeedKmh: 10.71,
    elevationGainMeters: 175,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-12T05:30:00Z',
    endTime: '2026-09-12T07:13:02Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_vikram', 'u_aniket', 'u_sneha'],
    commentsCount: 5,
  },
  {
    id: 'act_001_i',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Waluj 7K Steady Tempo',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 7.0,
    durationSeconds: 2310, // 38m 30s
    avgPaceSecondsPerKm: 330, // 5:30 / km
    avgSpeedKmh: 10.91,
    elevationGainMeters: 60,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-10T06:00:00Z',
    endTime: '2026-09-10T06:38:30Z',
    privacy: 'public',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya'],
    commentsCount: 1,
  },
  {
    id: 'act_001_j',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Cannaught Evening 5K Solo Run',
    sport: 'running',
    subType: 'outdoor_run',
    distanceKm: 5.5,
    durationSeconds: 1842, // 30m 42s
    avgPaceSecondsPerKm: 335, // 5:35 / km
    avgSpeedKmh: 10.75,
    elevationGainMeters: 40,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-08T18:00:00Z',
    endTime: '2026-09-08T18:30:42Z',
    privacy: 'public',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_vikram'],
    commentsCount: 0,
  },
  {
    id: 'act_001_k',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Sunday Morning 12K Endurance',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 12.0,
    durationSeconds: 4080, // 1h 08m 00s
    avgPaceSecondsPerKm: 340, // 5:40 / km
    avgSpeedKmh: 10.59,
    elevationGainMeters: 105,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-06T06:00:00Z',
    endTime: '2026-09-06T07:08:00Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_vikram'],
    commentsCount: 2,
  },
  {
    id: 'act_001_l',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'August Finale 15K Tempo Challenge',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 15.0,
    durationSeconds: 5100, // 1h 25m 00s
    avgPaceSecondsPerKm: 340, // 5:40 / km
    avgSpeedKmh: 10.59,
    elevationGainMeters: 130,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-30T06:00:00Z',
    endTime: '2026-08-30T07:25:00Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_aniket'],
    commentsCount: 2,
  },
  {
    id: 'act_001_m',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Waluj Midweek 7.2K Stride',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 7.2,
    durationSeconds: 2412, // 40m 12s
    avgPaceSecondsPerKm: 335, // 5:35 / km
    avgSpeedKmh: 10.75,
    elevationGainMeters: 65,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-27T06:15:00Z',
    endTime: '2026-08-27T06:55:12Z',
    privacy: 'public',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_vikram'],
    commentsCount: 1,
  },
  {
    id: 'act_001_n',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Cannaught Quick 4.8K Circuit',
    sport: 'running',
    subType: 'outdoor_run',
    distanceKm: 4.8,
    durationSeconds: 1680, // 28m 00s
    avgPaceSecondsPerKm: 350, // 5:50 / km
    avgSpeedKmh: 10.29,
    elevationGainMeters: 38,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-25T18:20:00Z',
    endTime: '2026-08-25T18:48:00Z',
    privacy: 'public',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya'],
    commentsCount: 0,
  },
  {
    id: 'act_001_o',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Saturday 16K Sambhajinagar Perimeter',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 16.0,
    durationSeconds: 5440, // 1h 30m 40s
    avgPaceSecondsPerKm: 340, // 5:40 / km
    avgSpeedKmh: 10.59,
    elevationGainMeters: 155,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-22T05:45:00Z',
    endTime: '2026-08-22T07:15:40Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_vikram'],
    commentsCount: 2,
  },
  {
    id: 'act_001_p',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Waluj Sunrise 6K Fast Strides',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 6.0,
    durationSeconds: 1980,
    avgPaceSecondsPerKm: 330,
    avgSpeedKmh: 10.91,
    elevationGainMeters: 52,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-19T06:00:00Z',
    endTime: '2026-08-19T06:33:00Z',
    privacy: 'public',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya'],
    commentsCount: 0,
  },
  {
    id: 'act_001_q',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Mid-August Sunday 13.5K Progression',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 13.5,
    durationSeconds: 4522,
    avgPaceSecondsPerKm: 335,
    avgSpeedKmh: 10.75,
    elevationGainMeters: 120,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-16T06:00:00Z',
    endTime: '2026-08-16T07:15:22Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_vikram'],
    commentsCount: 1,
  },
  {
    id: 'act_001_r',
    userId: 'u_rahul',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Early August 15.2K Long Base Run',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 15.2,
    durationSeconds: 5244,
    avgPaceSecondsPerKm: 345,
    avgSpeedKmh: 10.43,
    elevationGainMeters: 140,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-08-08T05:30:00Z',
    endTime: '2026-08-08T06:57:24Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_vikram'],
    commentsCount: 3,
  },
  {
    id: 'act_002',
    userId: 'u_priya',
    userName: 'Priya Patil',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Cannaught to Prozone 12K Aerobic',
    sport: 'running',
    subType: 'outdoor_run',
    distanceKm: 12.1,
    durationSeconds: 3993, // 1h 6m 33s
    avgPaceSecondsPerKm: 330, // 5:30 / km
    avgSpeedKmh: 10.9,
    elevationGainMeters: 110,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-22T05:45:00Z',
    endTime: '2026-09-22T06:51:33Z',
    privacy: 'public',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_rahul', 'u_vikram'],
    commentsCount: 4,
  },
  {
    id: 'act_003',
    userId: 'u_vikram',
    userName: 'Vikram Deshmukh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Kranti Chowk 16K Progressive Run',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 16.3,
    durationSeconds: 4564, // 1h 16m 04s
    avgPaceSecondsPerKm: 280, // 4:40 / km
    avgSpeedKmh: 12.85,
    elevationGainMeters: 140,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-21T05:30:00Z',
    endTime: '2026-09-21T06:46:04Z',
    privacy: 'public',
    clubId: 'club_central_city',
    clubName: 'Central City Run Club',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_priya', 'u_rahul', 'u_aniket'],
    commentsCount: 3,
  },
  {
    id: 'act_004',
    userId: 'u_sneha',
    userName: 'Sneha Kulkarni',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'University Campus Nature Loop 6K',
    sport: 'running',
    subType: 'trail_run',
    distanceKm: 6.2,
    durationSeconds: 2263, // 37m 43s
    avgPaceSecondsPerKm: 365, // 6:05 / km
    avgSpeedKmh: 9.86,
    elevationGainMeters: 95,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-21T06:15:00Z',
    endTime: '2026-09-21T06:52:43Z',
    privacy: 'public',
    clubId: 'club_university_striders',
    clubName: 'University Run Crew',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'verified',
    kudosUserIds: ['u_rahul'],
    commentsCount: 1,
  },
  {
    id: 'act_suspicious_demo',
    userId: 'u_aniket',
    userName: 'Aniket Jadhav',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Highway Sprint (Review Flagged)',
    sport: 'running',
    subType: 'road_run',
    distanceKm: 10.0,
    durationSeconds: 1080, // 18m (impossible running pace 1:48/km!)
    avgPaceSecondsPerKm: 108,
    avgSpeedKmh: 33.3,
    elevationGainMeters: 20,
    routePoints: CSN_ROUTE_PROZONE,
    startTime: '2026-09-20T18:00:00Z',
    endTime: '2026-09-20T18:18:00Z',
    privacy: 'public',
    clubId: 'club_cidco_run_crew',
    clubName: 'CIDCO Run Crew',
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    verificationStatus: 'flagged',
    verificationNotes: 'Flagged for review: Average speed 33.3 km/h exceeds human running limits (>26 km/h). Motor vehicle pattern suspected.',
    kudosUserIds: [],
    commentsCount: 0,
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal_city_100k',
    title: 'Chhatrapati Sambhajinagar 100K City Goal',
    description: 'The city collective goal! All verified running kilometers in Sambhajinagar contribute toward our historic 100,000 KM threshold.',
    category: 'city',
    targetKm: 100000,
    currentKm: 67420,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    participantUserIds: ['u_rahul', 'u_priya', 'u_vikram', 'u_aniket', 'u_sneha'],
    cityId: 'city_csn',
    cityName: 'Chhatrapati Sambhajinagar',
    badgeName: 'City 100K Pioneer',
    badgeIcon: '🏙️',
    status: 'active',
  },
  {
    id: 'chal_month_50k',
    title: '50 KM Monthly Consistency',
    description: 'Log 50 verified kilometers this month to establish your solid aerobic endurance base and earn the golden runner badge.',
    category: 'personal',
    targetKm: 50,
    currentKm: 37.4,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    participantUserIds: ['u_rahul', 'u_priya', 'u_aniket'],
    badgeName: '50K Club',
    badgeIcon: '⚡',
    status: 'active',
  },
  {
    id: 'chal_weekend_warrior',
    title: 'Weekend Warrior 3-Run Challenge',
    description: 'Complete 3 quality runs between Friday evening and Sunday night to keep the momentum fierce for your Run Club.',
    category: 'club',
    targetKm: 25,
    currentKm: 18.5,
    startDate: '2026-09-25T18:00:00Z',
    endDate: '2026-09-27T23:59:59Z',
    participantUserIds: ['u_rahul', 'u_priya'],
    badgeName: 'Weekend Warrior',
    badgeIcon: '🔥',
    status: 'active',
  },
  {
    id: 'chal_club_3000k',
    title: 'Run Club 3,000 KM Battle',
    description: 'Which Sambhajinagar crew crosses 3,000 collective kilometers first this month? Top 3 clubs receive verified league trophies.',
    category: 'club',
    targetKm: 3000,
    currentKm: 2840.4,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    participantUserIds: ['u_rahul', 'u_priya', 'u_vikram'],
    badgeName: 'Club Champion',
    badgeIcon: '🏆',
    status: 'active',
  },
];

export const INITIAL_EVENTS: ClubRunEvent[] = [
  {
    id: 'event_001',
    clubId: 'club_csn_weekend_warriors',
    clubName: 'CSN Weekend Warriors',
    title: 'Sunday Morning 10K Prozone Classic',
    description: 'The premier weekly weekend long run! Paced groups for 5:00, 5:30, 6:00, and 6:30 min/km. Hydration stop at 5KM mark and community breakfast after.',
    date: 'Sunday, 27 September 2026',
    time: '06:00 AM',
    meetingLocation: 'Prozone Mall Entrance Gate 2, Jalna Road',
    neighborhood: 'Cannaught Place',
    cityName: 'Chhatrapati Sambhajinagar',
    targetDistanceKm: 10.0,
    estimatedPace: '5:30 - 6:30 / KM',
    organizerId: 'u_priya',
    organizerName: 'Priya Patil',
    participantUserIds: ['u_priya', 'u_rahul', 'u_vikram', 'u_aniket'],
    maxParticipants: 60,
    routeDescription: 'Prozone Mall -> Jalna Road Flyover -> Cannaught Circle -> Return via Cidco N-2 boulevard.',
  },
  {
    id: 'event_002',
    clubId: 'club_university_striders',
    clubName: 'University Run Crew',
    title: 'University Green Trails & Hill Repeats 6K',
    description: 'Quiet wooded morning session inside BAMU campus. Perfect for building leg power and clean breathing on shaded trails.',
    date: 'Saturday, 26 September 2026',
    time: '06:15 AM',
    meetingLocation: 'BAMU Main Administrative Building',
    neighborhood: 'University Campus',
    cityName: 'Chhatrapati Sambhajinagar',
    targetDistanceKm: 6.0,
    estimatedPace: '6:00 / KM',
    organizerId: 'u_sneha',
    organizerName: 'Sneha Kulkarni',
    participantUserIds: ['u_sneha', 'u_rahul'],
    maxParticipants: 40,
    routeDescription: 'Botanical Gardens -> Soneri Mahal Foothills -> Heritage Avenues.',
  },
  {
    id: 'event_003',
    clubId: 'club_waluj_runners',
    clubName: 'Waluj Runners',
    title: 'Midweek Sunrise 8K Industrial Speedwork',
    description: 'Fast progressive road run along Waluj broad avenue. Finish with 4x100m strides to sharpen race form.',
    date: 'Wednesday, 23 September 2026',
    time: '05:45 AM',
    meetingLocation: 'Waluj MIDC Golden Gate Crossing',
    neighborhood: 'Waluj',
    cityName: 'Chhatrapati Sambhajinagar',
    targetDistanceKm: 8.0,
    estimatedPace: '5:15 - 5:45 / KM',
    organizerId: 'u_rahul',
    organizerName: 'Rahul Sharma',
    participantUserIds: ['u_rahul', 'u_aniket'],
    maxParticipants: 35,
    routeDescription: 'MIDC Main Spine -> Ranjangaon bypass loop -> Golden Gate return.',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_run',
    title: 'First Step',
    description: 'Completed your very first verified run on RunFam',
    icon: '🏃',
    category: 'milestone',
    isUnlocked: true,
    unlockedAt: '2025-01-10T06:30:00Z',
  },
  {
    id: 'ach_10k_lifetime',
    title: '10 KM Milestone',
    description: 'Logged 10 total lifetime kilometers',
    icon: '🥉',
    category: 'distance',
    requiredKm: 10,
    isUnlocked: true,
    unlockedAt: '2025-01-12T07:00:00Z',
  },
  {
    id: 'ach_50k_lifetime',
    title: '50 KM Club',
    description: 'Crossed 50 total kilometers of running',
    icon: '🥈',
    category: 'distance',
    requiredKm: 50,
    isUnlocked: true,
    unlockedAt: '2025-01-25T07:00:00Z',
  },
  {
    id: 'ach_100k_lifetime',
    title: 'Centurion 100K',
    description: '100 kilometers registered for yourself, your club, and your city',
    icon: '🥇',
    category: 'distance',
    requiredKm: 100,
    isUnlocked: true,
    unlockedAt: '2025-02-15T06:45:00Z',
  },
  {
    id: 'ach_500k_lifetime',
    title: '500 KM Legend',
    description: '500 kilometers of road and trail mastery',
    icon: '👑',
    category: 'distance',
    requiredKm: 500,
    isUnlocked: false,
  },
  {
    id: 'ach_first_10k_single',
    title: 'First 10K Run',
    description: 'Completed a single continuous run of 10 KM or greater',
    icon: '⚡',
    category: 'milestone',
    isUnlocked: true,
    unlockedAt: '2025-02-01T07:15:00Z',
  },
  {
    id: 'ach_half_marathon',
    title: 'Half Marathon Finisher',
    description: 'Conquered 21.1 KM in a single verified activity',
    icon: '🏅',
    category: 'milestone',
    isUnlocked: false,
  },
  {
    id: 'ach_streak_7',
    title: '7-Day On Fire',
    description: 'Kept a 7-day continuous running streak active',
    icon: '🔥',
    category: 'streak',
    requiredStreak: 7,
    isUnlocked: true,
    unlockedAt: '2026-09-22T06:50:00Z',
  },
  {
    id: 'ach_streak_30',
    title: '30-Day Iron Will',
    description: 'Maintained a 30-day running streak without missing a day',
    icon: '🛡️',
    category: 'streak',
    requiredStreak: 30,
    isUnlocked: false,
  },
  {
    id: 'ach_top_100_city',
    title: 'Top 100 City Rank',
    description: 'Climbed into the top 100 verified runners in your city',
    icon: '🏙️',
    category: 'rank',
    isUnlocked: true,
    unlockedAt: '2026-09-15T10:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    userId: 'u_rahul',
    title: '7-Day Streak Achieved! 🔥',
    message: 'You have run 7 days in a row! You earned the "7-Day On Fire" badge.',
    type: 'achievement',
    read: false,
    createdAt: '2026-09-22T06:50:00Z',
  },
  {
    id: 'notif_002',
    userId: 'u_rahul',
    title: 'Waluj Runners Moved to #3! 🏆',
    message: 'Your recent 7.42 KM run pushed Waluj Runners past CIDCO Run Crew into Rank #3.',
    type: 'club',
    read: false,
    createdAt: '2026-09-22T06:48:00Z',
  },
  {
    id: 'notif_003',
    userId: 'u_rahul',
    title: 'Sunday Morning 10K Coming Up',
    message: 'CSN Weekend Warriors meetup this Sunday at Prozone Mall, 6:00 AM.',
    type: 'club',
    read: true,
    createdAt: '2026-09-21T18:00:00Z',
  },
  {
    id: 'notif_004',
    userId: 'u_rahul',
    title: 'City Milestone Alert 🏙️',
    message: 'Chhatrapati Sambhajinagar has reached 67,420 KM / 100,000 KM goal!',
    type: 'city',
    read: true,
    createdAt: '2026-09-20T12:00:00Z',
  },
];

// Anti-Cheat Engine Rule Check
export function validateRunActivity(
  distanceKm: number,
  durationSeconds: number,
  points: { latitude: number; longitude: number; timestamp: number }[]
): { status: VerificationStatus; notes?: string } {
  if (distanceKm <= 0.05 || durationSeconds <= 15) {
    return {
      status: 'rejected',
      notes: 'Activity is too short to be considered a valid run (less than 50 meters or 15 seconds).',
    };
  }

  const avgSpeedKmh = (distanceKm / (durationSeconds / 3600));
  const avgPaceSecPerKm = durationSeconds / distanceKm;

  // Faster than 2:10 min/km (speed > 27.7 km/h) exceeds world record sprint pace for distance
  if (avgSpeedKmh > 26.5 || avgPaceSecPerKm < 135) {
    return {
      status: 'flagged',
      notes: `Suspicious pace detected (${Math.floor(avgPaceSecPerKm / 60)}:${Math.round(avgPaceSecPerKm % 60)
        .toString()
        .padStart(2, '0')}/km, avg speed ${avgSpeedKmh.toFixed(1)} km/h). Human distance running limit exceeded. Possible motor vehicle or GPS glitch.`,
    };
  }

  // Check for GPS point teleportation
  if (points.length >= 2) {
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const timeDiffSec = (p2.timestamp - p1.timestamp) / 1000;
      if (timeDiffSec > 0) {
        // Simple approximate distance between consecutive points
        const distKm = haversineDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
        const segmentSpeedKmh = (distKm / timeDiffSec) * 3600;
        if (segmentSpeedKmh > 40 && distKm > 0.1) {
          return {
            status: 'flagged',
            notes: `GPS teleportation jump detected: ${distKm.toFixed(2)} km traversed in ${timeDiffSec.toFixed(0)}s (${segmentSpeedKmh.toFixed(0)} km/h). Flagged for review.`,
          };
        }
      }
    }
  }

  return { status: 'verified' };
}

// Haversine formula
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Database Service Singleton
class RunFamDatabase {
  private users: User[] = [];
  private clubs: RunClub[] = [];
  private activities: Activity[] = [];
  private challenges: Challenge[] = [];
  private events: ClubRunEvent[] = [];
  private achievements: Achievement[] = [];
  private cityData: CityData = INITIAL_CITY_DATA;
  private notifications: NotificationItem[] = [];
  private activeUserId: string = 'u_rahul';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const rawUsers = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
      this.users = rawUsers.map((u: User) => ({
        ...u,
        onboarding_completed: u.onboarding_completed !== undefined ? u.onboarding_completed : true,
        role: u.role || (u.isAdmin ? 'ADMIN' : 'USER'),
        account_status: u.account_status || (u.isSuspended ? 'SUSPENDED' : 'ACTIVE'),
      }));

      const storedClubs = localStorage.getItem(STORAGE_KEYS.CLUBS);
      this.clubs = storedClubs ? JSON.parse(storedClubs) : [...INITIAL_RUN_CLUBS];

      const storedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      this.activities = storedActivities ? JSON.parse(storedActivities) : [...INITIAL_ACTIVITIES];

      const storedChallenges = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      this.challenges = storedChallenges ? JSON.parse(storedChallenges) : [...INITIAL_CHALLENGES];

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      this.events = storedEvents ? JSON.parse(storedEvents) : [...INITIAL_EVENTS];

      const storedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      this.achievements = storedAchievements ? JSON.parse(storedAchievements) : [...INITIAL_ACHIEVEMENTS];

      const storedCity = localStorage.getItem(STORAGE_KEYS.CITY);
      this.cityData = storedCity ? JSON.parse(storedCity) : { ...INITIAL_CITY_DATA };

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...INITIAL_NOTIFICATIONS];

      const storedActiveUid = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      if (storedActiveUid) {
        this.activeUserId = storedActiveUid;
      }
    } catch {
      this.users = [...INITIAL_USERS];
      this.clubs = [...INITIAL_RUN_CLUBS];
      this.activities = [...INITIAL_ACTIVITIES];
      this.challenges = [...INITIAL_CHALLENGES];
      this.events = [...INITIAL_EVENTS];
      this.achievements = [...INITIAL_ACHIEVEMENTS];
      this.cityData = { ...INITIAL_CITY_DATA };
      this.notifications = [...INITIAL_NOTIFICATIONS];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(this.clubs));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(this.activities));
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(this.challenges));
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(this.events));
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(this.achievements));
      localStorage.setItem(STORAGE_KEYS.CITY, JSON.stringify(this.cityData));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.activeUserId);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Auth & User
  public getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.activeUserId);
    return user || this.users[0];
  }

  public setCurrentUserId(userId: string) {
    this.activeUserId = userId;
    this.save();
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.save();
      return this.users[idx];
    }
    throw new Error('User not found');
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'streakDays' | 'lastActiveDate' | 'totalDistanceKm' | 'totalRuns' | 'longestRunKm' | 'monthDistanceKm' | 'weekDistanceKm' | 'yearDistanceKm' | 'cityRank' | 'clubRank' | 'joinedClubIds'> & { joinedClubIds?: string[] }): User {
    const newUser: User = {
      ...userData,
      id: `u_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      streakDays: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalDistanceKm: 0,
      totalRuns: 0,
      longestRunKm: 0,
      monthDistanceKm: 0,
      weekDistanceKm: 0,
      yearDistanceKm: 0,
      cityRank: this.users.length + 1,
      clubRank: 1,
      role: userData.role || 'USER',
      account_status: userData.account_status || 'ACTIVE',
      onboarding_completed: userData.onboarding_completed !== undefined ? userData.onboarding_completed : false,
      joinedClubIds: userData.joinedClubIds || (userData.primaryClubId ? [userData.primaryClubId] : []),
    };
    this.users.unshift(newUser);
    this.cityData.totalRunnersCount += 1;
    this.save();
    return newUser;
  }

  // Clubs
  public getClubs(): RunClub[] {
    return [...this.clubs];
  }

  public getClubById(id: string): RunClub | undefined {
    return this.clubs.find((c) => c.id === id);
  }

  public getClubBySlug(slug: string): RunClub | undefined {
    return this.clubs.find((c) => c.slug === slug);
  }

  public createClub(clubData: Omit<RunClub, 'id' | 'createdAt' | 'isVerified' | 'monthlyDistanceKm' | 'weeklyDistanceKm' | 'yearlyDistanceKm' | 'totalDistanceKm' | 'totalActivitiesCount' | 'activeMembersCount' | 'clubRank' | 'avgDistancePerActiveMemberKm' | 'inviteCode'>): RunClub {
    const newClub: RunClub = {
      ...clubData,
      id: `club_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isVerified: true,
      monthlyDistanceKm: 0,
      weeklyDistanceKm: 0,
      yearlyDistanceKm: 0,
      totalDistanceKm: 0,
      totalActivitiesCount: 0,
      activeMembersCount: 1,
      clubRank: this.clubs.length + 1,
      avgDistancePerActiveMemberKm: 0,
      inviteCode: `${clubData.name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8)}-${Math.floor(100 + Math.random() * 900)}`,
    };
    this.clubs.push(newClub);
    this.cityData.totalRunClubsCount += 1;

    // Add creator to club
    const owner = this.getUserById(clubData.ownerId);
    if (owner) {
      const currentJoined = new Set(owner.joinedClubIds);
      currentJoined.add(newClub.id);
      this.updateUser(owner.id, {
        primaryClubId: owner.primaryClubId || newClub.id,
        joinedClubIds: Array.from(currentJoined),
      });
    }

    this.save();
    return newClub;
  }

  public joinClub(userId: string, clubId: string): boolean {
    const club = this.getClubById(clubId);
    const user = this.getUserById(userId);
    if (!club || !user) return false;

    if (!club.memberIds.includes(userId)) {
      club.memberIds.push(userId);
      club.activeMembersCount = club.memberIds.length;
    }

    const joinedSet = new Set(user.joinedClubIds);
    joinedSet.add(clubId);
    user.joinedClubIds = Array.from(joinedSet);
    if (!user.primaryClubId) {
      user.primaryClubId = clubId;
    }

    this.save();
    return true;
  }

  public leaveClub(userId: string, clubId: string): boolean {
    const club = this.getClubById(clubId);
    const user = this.getUserById(userId);
    if (!club || !user) return false;

    club.memberIds = club.memberIds.filter((id) => id !== userId);
    club.adminIds = club.adminIds.filter((id) => id !== userId);
    club.activeMembersCount = club.memberIds.length;

    user.joinedClubIds = user.joinedClubIds.filter((id) => id !== clubId);
    if (user.primaryClubId === clubId) {
      user.primaryClubId = user.joinedClubIds[0] || undefined;
    }

    this.save();
    return true;
  }

  public getClubMembers(clubId: string): { user: User; role: string; contributionKm: number }[] {
    const club = this.getClubById(clubId);
    if (!club) return [];

    return club.memberIds.map((uid) => {
      const u = this.getUserById(uid) || {
        id: uid,
        name: 'Runner',
        username: `runner_${uid.slice(-4)}`,
        email: '',
        avatarUrl: '',
        cityId: 'city_csn',
        cityName: 'Chhatrapati Sambhajinagar',
        state: 'Maharashtra',
        country: 'India',
        createdAt: '',
        streakDays: 1,
        lastActiveDate: '',
        totalDistanceKm: 45,
        totalRuns: 6,
        longestRunKm: 10,
        monthDistanceKm: 25,
        weekDistanceKm: 10,
        yearDistanceKm: 45,
        cityRank: 50,
        clubRank: 5,
        joinedClubIds: [clubId],
      };

      let role = 'member';
      if (club.ownerId === uid) role = 'owner';
      else if (club.adminIds.includes(uid)) role = 'admin';

      return {
        user: u,
        role,
        contributionKm: u.monthDistanceKm || 12.5,
      };
    }).sort((a, b) => b.contributionKm - a.contributionKm);
  }

  // Activities & THE SIGNATURE RUN IMPACT ENGINE
  public getActivities(options?: {
    userId?: string;
    clubId?: string;
    cityId?: string;
    limit?: number;
  }): Activity[] {
    let list = [...this.activities];
    if (options?.userId) {
      list = list.filter((a) => a.userId === options.userId);
    }
    if (options?.clubId) {
      list = list.filter((a) => a.clubId === options.clubId);
    }
    if (options?.cityId) {
      list = list.filter((a) => a.cityId === options.cityId);
    }
    return list.slice(0, options?.limit || 100);
  }

  public getActivityById(id: string): Activity | undefined {
    return this.activities.find((a) => a.id === id);
  }

  /**
   * CORE PRODUCT LOOP EXECUTION:
   * 1. Validate activity with anti-cheat engine
   * 2. Save activity to history
   * 3. Update personal runner stats (distance, runs, streak, longest run, month/week totals)
   * 4. Update Run Club competitive distance
   * 5. Update City collective distance & goal progress
   * 6. Update applicable Challenges
   * 7. Check & unlock new Achievements
   * 8. Re-evaluate leaderboard rankings
   */
  public saveRunActivity(activityData: Omit<Activity, 'id' | 'kudosUserIds' | 'commentsCount' | 'verificationStatus' | 'verificationNotes'> & { isSimulated?: boolean }): {
    activity: Activity;
    impact: {
      personalDistanceGained: number;
      clubDistanceGained: number;
      cityDistanceGained: number;
      clubName?: string;
      cityName: string;
      newStreak: number;
      unlockedAchievements: Achievement[];
      challengesUpdated: { title: string; progressGained: number }[];
    };
  } {
    // 1. Anti-Cheat Engine Validation
    const validation = validateRunActivity(
      activityData.distanceKm,
      activityData.durationSeconds,
      activityData.routePoints
    );

    const activity: Activity = {
      ...activityData,
      id: `act_${Date.now()}`,
      verificationStatus: validation.status,
      verificationNotes: validation.notes,
      kudosUserIds: [],
      commentsCount: 0,
    };

    this.activities.unshift(activity);

    const impact = {
      personalDistanceGained: activity.distanceKm,
      clubDistanceGained: 0,
      cityDistanceGained: 0,
      clubName: activity.clubName,
      cityName: activity.cityName,
      newStreak: 0,
      unlockedAchievements: [] as Achievement[],
      challengesUpdated: [] as { title: string; progressGained: number }[],
    };

    // If activity is flagged or rejected, it does NOT contribute to official leaderboards or club/city goals
    if (activity.verificationStatus === 'verified') {
      const user = this.getUserById(activity.userId);
      if (user) {
        // Update user stats
        user.totalDistanceKm = Number((user.totalDistanceKm + activity.distanceKm).toFixed(2));
        user.monthDistanceKm = Number((user.monthDistanceKm + activity.distanceKm).toFixed(2));
        user.weekDistanceKm = Number((user.weekDistanceKm + activity.distanceKm).toFixed(2));
        user.yearDistanceKm = Number((user.yearDistanceKm + activity.distanceKm).toFixed(2));
        user.totalRuns += 1;
        if (activity.distanceKm > user.longestRunKm) {
          user.longestRunKm = Number(activity.distanceKm.toFixed(2));
        }

        // Streak computation: run must be >= 1.5 KM to maintain/extend streak
        const todayStr = new Date().toISOString().split('T')[0];
        if (activity.distanceKm >= 1.5) {
          if (user.lastActiveDate !== todayStr) {
            user.streakDays += 1;
            user.lastActiveDate = todayStr;
          }
        }
        impact.newStreak = user.streakDays;

        // Recalculate ranks
        this.recalculateUserRanks();
      }

      // Update Run Club
      if (activity.clubId) {
        const club = this.getClubById(activity.clubId);
        if (club) {
          club.monthlyDistanceKm = Number((club.monthlyDistanceKm + activity.distanceKm).toFixed(2));
          club.weeklyDistanceKm = Number((club.weeklyDistanceKm + activity.distanceKm).toFixed(2));
          club.totalDistanceKm = Number((club.totalDistanceKm + activity.distanceKm).toFixed(2));
          club.totalActivitiesCount += 1;
          if (club.activeMembersCount > 0) {
            club.avgDistancePerActiveMemberKm = Number((club.monthlyDistanceKm / club.activeMembersCount).toFixed(1));
          }
          impact.clubDistanceGained = activity.distanceKm;
        }
        this.recalculateClubRanks();
      }

      // Update City
      this.cityData.totalDistanceKm = Number((this.cityData.totalDistanceKm + activity.distanceKm).toFixed(2));
      this.cityData.currentMonthProgressKm = Number((this.cityData.currentMonthProgressKm + activity.distanceKm).toFixed(2));
      this.cityData.totalRunsCount += 1;
      impact.cityDistanceGained = activity.distanceKm;

      // Update Challenges
      for (const chal of this.challenges) {
        if (chal.status === 'active') {
          // If city challenge or user is participant
          if (chal.category === 'city' || chal.participantUserIds.includes(activity.userId)) {
            chal.currentKm = Number((chal.currentKm + activity.distanceKm).toFixed(2));
            impact.challengesUpdated.push({
              title: chal.title,
              progressGained: activity.distanceKm,
            });
            if (chal.currentKm >= chal.targetKm) {
              chal.status = 'completed';
            }
          }
        }
      }

      // Check Achievement Unlocks
      if (user) {
        for (const ach of this.achievements) {
          if (!ach.isUnlocked) {
            let shouldUnlock = false;
            if (ach.id === 'ach_first_run' && user.totalRuns >= 1) shouldUnlock = true;
            if (ach.requiredKm && user.totalDistanceKm >= ach.requiredKm) shouldUnlock = true;
            if (ach.id === 'ach_first_10k_single' && activity.distanceKm >= 10.0) shouldUnlock = true;
            if (ach.id === 'ach_half_marathon' && activity.distanceKm >= 21.097) shouldUnlock = true;
            if (ach.requiredStreak && user.streakDays >= ach.requiredStreak) shouldUnlock = true;

            if (shouldUnlock) {
              ach.isUnlocked = true;
              ach.unlockedAt = new Date().toISOString();
              impact.unlockedAchievements.push(ach);

              // Add notification
              this.notifications.unshift({
                id: `notif_${Date.now()}`,
                userId: user.id,
                title: `Achievement Unlocked: ${ach.title} ${ach.icon}`,
                message: ach.description,
                type: 'achievement',
                read: false,
                createdAt: new Date().toISOString(),
              });
            }
          }
        }
      }
    }

    this.save();
    return { activity, impact };
  }

  public toggleKudos(activityId: string, userId: string): boolean {
    const act = this.getActivityById(activityId);
    if (!act) return false;

    const idx = act.kudosUserIds.indexOf(userId);
    if (idx === -1) {
      act.kudosUserIds.push(userId);
    } else {
      act.kudosUserIds.splice(idx, 1);
    }
    this.save();
    return true;
  }

  // City & Leaderboard aggregations
  public getCityData(): CityData {
    return { ...this.cityData };
  }

  public getIndividualLeaderboard(period: LeaderboardPeriod, metric: LeaderboardMetric): LeaderboardEntry[] {
    const users = [...this.users].filter((u) => !u.isSuspended);

    // Metric sorting
    users.sort((a, b) => {
      if (metric === 'distance') {
        const valA = period === 'week' ? a.weekDistanceKm : period === 'today' ? (a.weekDistanceKm / 4) : a.monthDistanceKm;
        const valB = period === 'week' ? b.weekDistanceKm : period === 'today' ? (b.weekDistanceKm / 4) : b.monthDistanceKm;
        return valB - valA;
      }
      if (metric === 'active_days' || metric === 'consistency') {
        return b.streakDays - a.streakDays;
      }
      if (metric === 'longest_run') {
        return b.longestRunKm - a.longestRunKm;
      }
      return b.monthDistanceKm - a.monthDistanceKm;
    });

    return users.slice(0, 50).map((u, index) => {
      let metricVal = u.monthDistanceKm;
      let display = `${u.monthDistanceKm.toFixed(1)} KM`;

      if (metric === 'distance') {
        if (period === 'week') {
          metricVal = u.weekDistanceKm;
          display = `${u.weekDistanceKm.toFixed(1)} KM`;
        } else if (period === 'today') {
          metricVal = Number((u.weekDistanceKm / 3.5).toFixed(1));
          display = `${metricVal.toFixed(1)} KM`;
        } else if (period === 'year' || period === 'all_time') {
          metricVal = u.totalDistanceKm;
          display = `${u.totalDistanceKm.toFixed(1)} KM`;
        }
      } else if (metric === 'active_days' || metric === 'consistency') {
        metricVal = u.streakDays;
        display = `${u.streakDays} Days`;
      } else if (metric === 'longest_run') {
        metricVal = u.longestRunKm;
        display = `${u.longestRunKm.toFixed(1)} KM`;
      }

      const club = u.primaryClubId ? this.getClubById(u.primaryClubId) : undefined;
      // Simulate historical movement
      const rank = index + 1;
      const prevRank = rank === 1 ? 1 : rank === 2 ? 1 : rank === 3 ? 5 : rank + (rank % 3 === 0 ? 2 : -1);

      return {
        rank,
        previousRank: prevRank,
        id: u.id,
        name: u.name,
        username: u.username,
        avatarUrl: u.avatarUrl,
        clubName: club?.name || 'Independent Runner',
        clubId: club?.id,
        metricValue: metricVal,
        metricDisplay: display,
      };
    });
  }

  public getClubLeaderboard(period: LeaderboardPeriod): LeaderboardEntry[] {
    const clubs = [...this.clubs].filter((c) => !c.isSuspended);

    clubs.sort((a, b) => {
      if (period === 'week') return b.weeklyDistanceKm - a.weeklyDistanceKm;
      if (period === 'all_time' || period === 'year') return b.totalDistanceKm - a.totalDistanceKm;
      return b.monthlyDistanceKm - a.monthlyDistanceKm;
    });

    return clubs.map((c, index) => {
      const metricVal = period === 'week' ? c.weeklyDistanceKm : period === 'all_time' ? c.totalDistanceKm : c.monthlyDistanceKm;
      return {
        rank: index + 1,
        previousRank: c.clubRank || index + 1,
        id: c.id,
        name: c.name,
        clubName: c.neighborhood,
        clubId: c.id,
        metricValue: metricVal,
        metricDisplay: `${metricVal.toLocaleString()} KM`,
        activeMembers: c.activeMembersCount,
        avgDistancePerMember: c.avgDistancePerActiveMemberKm,
      };
    });
  }

  private recalculateUserRanks() {
    const sorted = [...this.users].sort((a, b) => b.monthDistanceKm - a.monthDistanceKm);
    sorted.forEach((u, i) => {
      u.cityRank = i + 1;
    });
  }

  private recalculateClubRanks() {
    const sorted = [...this.clubs].sort((a, b) => b.monthlyDistanceKm - a.monthlyDistanceKm);
    sorted.forEach((c, i) => {
      c.clubRank = i + 1;
    });
  }

  // Challenges
  public getChallenges(): Challenge[] {
    return [...this.challenges];
  }

  public joinChallenge(challengeId: string, userId: string): boolean {
    const chal = this.challenges.find((c) => c.id === challengeId);
    if (!chal) return false;
    if (!chal.participantUserIds.includes(userId)) {
      chal.participantUserIds.push(userId);
      this.save();
    }
    return true;
  }

  // Events
  public getEvents(): ClubRunEvent[] {
    return [...this.events];
  }

  public joinEvent(eventId: string, userId: string): boolean {
    const ev = this.events.find((e) => e.id === eventId);
    if (!ev) return false;
    if (!ev.participantUserIds.includes(userId)) {
      ev.participantUserIds.push(userId);
      this.save();
    }
    return true;
  }

  public leaveEvent(eventId: string, userId: string): boolean {
    const ev = this.events.find((e) => e.id === eventId);
    if (!ev) return false;
    ev.participantUserIds = ev.participantUserIds.filter((id) => id !== userId);
    this.save();
    return true;
  }

  // Achievements
  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  // Notifications
  public getNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
  }

  // Admin moderation
  public updateActivityStatus(activityId: string, status: VerificationStatus, notes?: string): boolean {
    const act = this.getActivityById(activityId);
    if (!act) return false;
    act.verificationStatus = status;
    if (notes) act.verificationNotes = notes;
    this.save();
    return true;
  }

  public toggleUserSuspension(userId: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.isSuspended = !user.isSuspended;
    this.save();
    return true;
  }

  public toggleClubSuspension(clubId: string): boolean {
    const club = this.getClubById(clubId);
    if (!club) return false;
    club.isSuspended = !club.isSuspended;
    this.save();
    return true;
  }

  public resetToDefaultDemo() {
    localStorage.clear();
    this.init();
  }
}

export const db = new RunFamDatabase();
