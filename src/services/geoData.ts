/**
 * RunFam Geographical & Territorial Model
 * Relational architecture supporting State -> City hierarchy.
 */

export interface GeoState {
  id: string;
  name: string;
  code: string;
  country: string;
}

export interface GeoCity {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  country: string;
  isLaunchCity: boolean;
  status: 'active' | 'coming_soon';
  totalRunnersCount: number;
  totalClubsCount: number;
  monthlyGoalKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhoods: string[];
}

export const SUPPORTED_STATES: GeoState[] = [
  { id: 'state_mh', name: 'Maharashtra', code: 'MH', country: 'India' },
  { id: 'state_ka', name: 'Karnataka', code: 'KA', country: 'India' },
  { id: 'state_dl', name: 'Delhi NCR', code: 'DL', country: 'India' },
  { id: 'state_ts', name: 'Telangana', code: 'TS', country: 'India' },
  { id: 'state_gj', name: 'Gujarat', code: 'GJ', country: 'India' },
  { id: 'state_tn', name: 'Tamil Nadu', code: 'TN', country: 'India' },
];

export const SUPPORTED_CITIES: GeoCity[] = [
  // Maharashtra
  {
    id: 'city_csn',
    name: 'Chhatrapati Sambhajinagar',
    stateId: 'state_mh',
    stateName: 'Maharashtra',
    country: 'India',
    isLaunchCity: true,
    status: 'active',
    totalRunnersCount: 2341,
    totalClubsCount: 37,
    monthlyGoalKm: 100000,
    coordinates: { lat: 19.8762, lng: 75.3433 },
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
  },
  {
    id: 'city_pune',
    name: 'Pune',
    stateId: 'state_mh',
    stateName: 'Maharashtra',
    country: 'India',
    isLaunchCity: false,
    status: 'active',
    totalRunnersCount: 1420,
    totalClubsCount: 18,
    monthlyGoalKm: 75000,
    coordinates: { lat: 18.5204, lng: 73.8567 },
    neighborhoods: ['Kalyani Nagar', 'Kothrud', 'Viman Nagar', 'Aundh', 'Baner'],
  },
  {
    id: 'city_mumbai',
    name: 'Mumbai',
    stateId: 'state_mh',
    stateName: 'Maharashtra',
    country: 'India',
    isLaunchCity: false,
    status: 'active',
    totalRunnersCount: 3100,
    totalClubsCount: 42,
    monthlyGoalKm: 150000,
    coordinates: { lat: 19.076, lng: 72.8777 },
    neighborhoods: ['Marine Drive', 'Bandra', 'Juhu', 'Powai', 'Worli'],
  },
  {
    id: 'city_nashik',
    name: 'Nashik',
    stateId: 'state_mh',
    stateName: 'Maharashtra',
    country: 'India',
    isLaunchCity: false,
    status: 'coming_soon',
    totalRunnersCount: 420,
    totalClubsCount: 6,
    monthlyGoalKm: 30000,
    coordinates: { lat: 19.9975, lng: 73.7898 },
    neighborhoods: ['Gangapur Road', 'College Road', 'Indira Nagar'],
  },
  {
    id: 'city_nagpur',
    name: 'Nagpur',
    stateId: 'state_mh',
    stateName: 'Maharashtra',
    country: 'India',
    isLaunchCity: false,
    status: 'coming_soon',
    totalRunnersCount: 510,
    totalClubsCount: 8,
    monthlyGoalKm: 35000,
    coordinates: { lat: 21.1458, lng: 79.0882 },
    neighborhoods: ['Civil Lines', 'Dharampeth', 'Ramdaspeth'],
  },

  // Karnataka
  {
    id: 'city_blr',
    name: 'Bengaluru',
    stateId: 'state_ka',
    stateName: 'Karnataka',
    country: 'India',
    isLaunchCity: false,
    status: 'active',
    totalRunnersCount: 2850,
    totalClubsCount: 34,
    monthlyGoalKm: 120000,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    neighborhoods: ['Cubbon Park', 'Indiranagar', 'Koramangala', 'HSR Layout'],
  },
  {
    id: 'city_mys',
    name: 'Mysuru',
    stateId: 'state_ka',
    stateName: 'Karnataka',
    country: 'India',
    isLaunchCity: false,
    status: 'coming_soon',
    totalRunnersCount: 290,
    totalClubsCount: 4,
    monthlyGoalKm: 20000,
    coordinates: { lat: 12.2958, lng: 76.6394 },
    neighborhoods: ['Kukkarahalli Lake', 'Chamundi Hill', 'Jayalakshmipuram'],
  },

  // Delhi NCR
  {
    id: 'city_del',
    name: 'New Delhi',
    stateId: 'state_dl',
    stateName: 'Delhi NCR',
    country: 'India',
    isLaunchCity: false,
    status: 'active',
    totalRunnersCount: 1980,
    totalClubsCount: 22,
    monthlyGoalKm: 90000,
    coordinates: { lat: 28.6139, lng: 77.209 },
    neighborhoods: ['Nehru Park', 'Lodhi Garden', 'Siri Fort', 'Dwarka'],
  },

  // Telangana
  {
    id: 'city_hyd',
    name: 'Hyderabad',
    stateId: 'state_ts',
    stateName: 'Telangana',
    country: 'India',
    isLaunchCity: false,
    status: 'active',
    totalRunnersCount: 1650,
    totalClubsCount: 19,
    monthlyGoalKm: 80000,
    coordinates: { lat: 17.385, lng: 78.4867 },
    neighborhoods: ['KBR Park', 'Gachibowli', 'Necklace Road', 'Jubilee Hills'],
  },

  // Gujarat
  {
    id: 'city_amd',
    name: 'Ahmedabad',
    stateId: 'state_gj',
    stateName: 'Gujarat',
    country: 'India',
    isLaunchCity: false,
    status: 'coming_soon',
    totalRunnersCount: 380,
    totalClubsCount: 5,
    monthlyGoalKm: 25000,
    coordinates: { lat: 23.0225, lng: 72.5714 },
    neighborhoods: ['Sabarmati Riverfront', 'Vastrapur', 'Bodakdev'],
  },
];

export function getCitiesByState(stateId: string): GeoCity[] {
  return SUPPORTED_CITIES.filter((c) => c.stateId === stateId);
}

export function getCityById(cityId: string): GeoCity | undefined {
  return SUPPORTED_CITIES.find((c) => c.id === cityId);
}

export function getStateById(stateId: string): GeoState | undefined {
  return SUPPORTED_STATES.find((s) => s.id === stateId);
}
