import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, STORAGE_KEYS } from '../../constants/config';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - เพิ่ม owner ID ใน header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // ดึง owner ID จาก AsyncStorage
      const ownerId = await AsyncStorage.getItem(STORAGE_KEYS.OWNER_ID);

      if (ownerId) {
        config.headers['x-owner-id'] = ownerId;
      }

      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - จัดการ error
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      console.error(`❌ ${error.response.status} ${error.config?.url}`, error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('❌ No response from server:', error.message);
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
