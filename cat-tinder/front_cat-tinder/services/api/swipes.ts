import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/config';
import type {
  CreateSwipeRequest,
  CreateSwipeResponse,
  SwipeHistoryResponse,
} from '../../types';

export const swipesApi = {
  // POST /api/swipes - สร้าง swipe (like/pass)
  createSwipe: async (data: CreateSwipeRequest): Promise<CreateSwipeResponse> => {
    const response = await apiClient.post<CreateSwipeResponse>(API_ENDPOINTS.SWIPES, data);
    return response.data;
  },

  // GET /api/swipes/history - ดูประวัติ swipe
  getHistory: async (params?: {
    catId?: string;
    action?: 'like' | 'pass';
    limit?: number;
    skip?: number;
  }): Promise<SwipeHistoryResponse> => {
    const response = await apiClient.get<SwipeHistoryResponse>(
      API_ENDPOINTS.SWIPE_HISTORY,
      { params }
    );
    return response.data;
  },
};
