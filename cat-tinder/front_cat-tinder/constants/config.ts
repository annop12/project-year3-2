// API Configuration
// สำหรับ Development:
// - Web/iOS Simulator: ใช้ localhost
// - Physical Device: เปลี่ยนเป็น IP address ของเครื่อง (เช่น 192.168.1.100)
// - Android Emulator: ใช้ 10.0.2.2
export const API_URL = __DEV__
  ? 'http://localhost:4000'  // Development - เปลี่ยนเป็น IP ของเครื่องถ้าใช้ physical device
  : 'https://your-production-api.com'; // Production

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Cats
  CAT_FEED: '/api/cats/feed',
  MY_CATS: '/api/cats/my',

  // Swipes
  SWIPES: '/api/swipes',
  SWIPE_HISTORY: '/api/swipes/history',

  // Matches
  MATCHES: '/api/matches',
  MATCH_DETAIL: (matchId: string) => `/api/matches/${matchId}`,
  MATCH_MESSAGES: (matchId: string) => `/api/matches/${matchId}/messages`,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  OWNER_ID: '@cat_tinder:owner_id',
  USER_DATA: '@cat_tinder:user_data',
} as const;

// Pagination
export const DEFAULT_LIMIT = 50;
export const MESSAGES_LIMIT = 100;
