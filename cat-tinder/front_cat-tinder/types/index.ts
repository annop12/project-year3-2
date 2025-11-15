// 🐱 Cat Tinder - TypeScript Types

// ========================================
// Owner Types
// ========================================

export interface Owner {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  location?: Location;
  contact?: Contact;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  lineId?: string;
  phone?: string;
  facebookUrl?: string;
}

// ========================================
// Cat Types
// ========================================

export interface Cat {
  _id: string;
  ownerId: string | Owner; // Can be populated
  name: string;
  gender: 'male' | 'female';
  ageMonths: number;
  breed?: string;
  weightKg?: number;
  purpose: ('mate' | 'friend' | 'foster')[];
  health?: Health;
  traits?: string[];
  photos: Photo[];
  location?: Location;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Health {
  vaccinated?: boolean;
  neutered?: boolean;
  notes?: string;
}

export interface Photo {
  url: string;
  publicId?: string;
}

export interface Location {
  province?: string;
  district?: string;
  lat?: number;
  lng?: number;
}

// ========================================
// Swipe Types
// ========================================

export interface Swipe {
  _id: string;
  swiperOwnerId: string;
  swiperCatId: string | Cat;
  targetCatId: string | Cat;
  action: 'like' | 'pass';
  createdAt: string;
}

export interface CreateSwipeRequest {
  swiperCatId: string;
  targetCatId: string;
  action: 'like' | 'pass';
}

export interface CreateSwipeResponse {
  success: boolean;
  swipe: Swipe;
  match: {
    matched: boolean;
    matchId?: string;
    matchData?: Match;
  };
}

// ========================================
// Match Types
// ========================================

export interface Match {
  _id: string;
  catAId: string | Cat;
  ownerAId: string | Owner;
  catBId: string | Cat;
  ownerBId: string | Owner;
  lastMessageAt?: string;
  createdAt: string;
}

// ========================================
// Message Types
// ========================================

export interface Message {
  _id: string;
  matchId: string;
  senderOwnerId: string | Owner;
  text: string;
  read: boolean;
  sentAt: string;
}

export interface SendMessageRequest {
  text: string;
}

// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface SwipeHistoryResponse {
  success: boolean;
  swipes: Swipe[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface MatchesResponse {
  success: boolean;
  matches: Match[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface MatchDetailResponse {
  success: boolean;
  match: Match;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface SendMessageResponse {
  success: boolean;
  message: Message;
}

// ========================================
// Error Types
// ========================================

export interface ApiError {
  error: string;
  message: string;
}
