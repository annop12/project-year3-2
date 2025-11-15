import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/config';
import type { Cat } from '../../types';

export interface CatFeedResponse {
  success: boolean;
  cats: Cat[];
  myCatId: string;
  message?: string;
}

export interface MyCatsResponse {
  success: boolean;
  cats: Cat[];
}

export const catsApi = {
  // GET /api/cats/feed - ดูแมวสำหรับ swipe
  getFeed: async (params?: {
    gender?: 'male' | 'female';
    purpose?: string;
    limit?: number;
  }): Promise<CatFeedResponse> => {
    const response = await apiClient.get<CatFeedResponse>(
      API_ENDPOINTS.CAT_FEED,
      { params }
    );
    return response.data;
  },

  // GET /api/cats/my - ดูแมวของตัวเอง
  getMyCats: async (): Promise<MyCatsResponse> => {
    const response = await apiClient.get<MyCatsResponse>(API_ENDPOINTS.MY_CATS);
    return response.data;
  },
};
