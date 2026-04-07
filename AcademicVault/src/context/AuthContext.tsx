import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

import BASE_url from '../constants/baseURL';

const BASE_URL = BASE_url;

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isFetchingProfile: boolean;
  login: (token: string, profile: any) => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  logout: () => Promise<void>;
  userProfile: any;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  isFetchingProfile: false,
  login: async () => {},
  updateProfile: async () => {},
  logout: async () => {},
  userProfile: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Startup loading storage
  const [isFetchingProfile, setIsFetchingProfile] = useState(false); // Artificial profile fetch overlay
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setIsFetchingProfile(true);
          // Fetch actual profile from backend
          const response = await fetch(`${BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.profile);
            setIsLoggedIn(true);
          } else {
             // Token invalid or expired
             await SecureStore.deleteItemAsync('userToken');
          }
          setIsFetchingProfile(false);
        }
      } catch (e) {
        console.error("Error:", e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = async (token: string, profile: any) => {
    setIsFetchingProfile(true);
    try {
      if (token) {
        await SecureStore.setItemAsync('userToken', token);
      }
      setUserProfile(profile);
      // Wait for a simulated 2 seconds here to allow the Loader screen to animate gracefully
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const logout = async () => {
    console.log("Logging out...");
    try {
      await SecureStore.deleteItemAsync('userToken');
      setUserProfile(null);
      setIsFetchingProfile(false);
      setIsLoggedIn(false);
      console.log("Logged out successfully");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, isFetchingProfile, login, updateProfile, logout, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
