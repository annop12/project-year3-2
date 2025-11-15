import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import type { Owner } from '../types';

interface AuthContextType {
  ownerId: string | null;
  owner: Owner | null;
  isLoading: boolean;
  setOwnerId: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ownerId, setOwnerIdState] = useState<string | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load owner ID from AsyncStorage on mount
  useEffect(() => {
    loadOwnerId();
  }, []);

  const loadOwnerId = async () => {
    try {
      const savedOwnerId = await AsyncStorage.getItem(STORAGE_KEYS.OWNER_ID);

      if (savedOwnerId) {
        setOwnerIdState(savedOwnerId);
        console.log('✅ Loaded owner ID:', savedOwnerId);
      }
    } catch (error) {
      console.error('Error loading owner ID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setOwnerId = async (id: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OWNER_ID, id);
      setOwnerIdState(id);
      console.log('✅ Saved owner ID:', id);
    } catch (error) {
      console.error('Error saving owner ID:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OWNER_ID);
      setOwnerIdState(null);
      setOwner(null);
      console.log('✅ Logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ownerId,
        owner,
        isLoading,
        setOwnerId,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
