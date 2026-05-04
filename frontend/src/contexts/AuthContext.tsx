// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { authAPI } from '../services/api/authAPI';

interface User {
  id: number;
  username: string;
  email?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; username: string; password: string; fullName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for localStorage
const TOKEN_KEY = 'kwik_cricket_token';
const USER_KEY = 'kwik_cricket_user';
const GUEST_ID_KEY = 'kwik_cricket_guest_id';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user');
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          await initGuestSession();
        }
      } else {
        await initGuestSession();
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const initGuestSession = async () => {
    try {
      
      // Create guest session via API or just use localStorage
      const guestUser = {
        id: Date.now(),
        username: `Guest_${Math.random().toString(36).substring(2, 8)}`,
        isGuest: true
      };
      
      localStorage.setItem(USER_KEY, JSON.stringify(guestUser));
      localStorage.setItem(GUEST_ID_KEY, guestUser.id.toString());
      setUser(guestUser);
    } catch (error) {
      console.error('Failed to create guest session:', error);
      // Fallback guest user
      const fallbackGuest = {
        id: Date.now(),
        username: 'Guest_Player',
        isGuest: true
      };
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackGuest));
      setUser(fallbackGuest);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    if (response.success) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      setUser(response.user);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const register = async (userData: { email: string; username: string; password: string; fullName?: string }) => {
    const response = await authAPI.register(userData);
    if (response.success) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      setUser(response.user);
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUEST_ID_KEY);
    await initGuestSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !user.isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};