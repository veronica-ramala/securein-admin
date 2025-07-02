import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// WARNING: These are development-only credentials!
// In production, remove this and implement proper API authentication
const FALLBACK_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin', 
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userData, tokenExpiry] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
        AsyncStorage.getItem(TOKEN_EXPIRY_KEY)
      ]);

      if (token && userData && tokenExpiry) {
        const expiryTime = new Date(tokenExpiry);
        const now = new Date();

        if (now < expiryTime) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Token expired, try to refresh
          await refreshAuth();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
        AsyncStorage.removeItem(TOKEN_EXPIRY_KEY)
      ]);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // For now, use hardcoded credentials (to be replaced with real API later)
      if (username === FALLBACK_CREDENTIALS.username && password === FALLBACK_CREDENTIALS.password) {
        const fallbackUser: User = {
          id: 'admin',
          username: 'admin',
          role: 'administrator'
        };

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

        await Promise.all([
          AsyncStorage.setItem(AUTH_TOKEN_KEY, 'fallback_token'),
          AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(fallbackUser)),
          AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt)
        ]);

        setUser(fallbackUser);
        setIsAuthenticated(true);
        return { success: true };
      }

      return { 
        success: false, 
        error: 'Invalid username or password.' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      // For now, just clear auth data if token is expired
      // In a real implementation, this would call the API to refresh the token
      await clearAuthData();
    } catch (error) {
      console.error('Token refresh error:', error);
      await clearAuthData();
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear local data
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if there's an error
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}