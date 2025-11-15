import apiClient from './client';
import { API_ENDPOINTS } from '../../constants/config';
import type {
  MatchesResponse,
  MatchDetailResponse,
  MessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../../types';

export const matchesApi = {
  // GET /api/matches - ดู matches ทั้งหมด
  getMatches: async (params?: {
    limit?: number;
    skip?: number;
  }): Promise<MatchesResponse> => {
    const response = await apiClient.get<MatchesResponse>(
      API_ENDPOINTS.MATCHES,
      { params }
    );
    return response.data;
  },

  // GET /api/matches/:id - ดูรายละเอียด match
  getMatchById: async (matchId: string): Promise<MatchDetailResponse> => {
    const response = await apiClient.get<MatchDetailResponse>(
      API_ENDPOINTS.MATCH_DETAIL(matchId)
    );
    return response.data;
  },

  // GET /api/matches/:id/messages - ดูข้อความ
  getMessages: async (
    matchId: string,
    params?: { limit?: number; skip?: number }
  ): Promise<MessagesResponse> => {
    const response = await apiClient.get<MessagesResponse>(
      API_ENDPOINTS.MATCH_MESSAGES(matchId),
      { params }
    );
    return response.data;
  },

  // POST /api/matches/:id/messages - ส่งข้อความ
  sendMessage: async (
    matchId: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>(
      API_ENDPOINTS.MATCH_MESSAGES(matchId),
      data
    );
    return response.data;
  },
};
