//app/_layout.tsx

import { useFonts, LoveYaLikeASister_400Regular } from '@expo-google-fonts/love-ya-like-a-sister';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import { Inter_400Regular} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AcademicProvider } from '../context/AcademicContext';
import LoadingScreen from '../screens/Loader';
import { ThemeProvider } from '../context/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, isLoading, isFetchingProfile } = useAuth();
  
  if (isLoading || isFetchingProfile) {
    return <LoadingScreen />;
  }
  
  return (
    <Stack screenOptions={{headerShown:false}}>
      {isLoggedIn ? (
        <Stack.Screen name='(tabs)' />
      ) : (
        <Stack.Screen name='auth' />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'LoveYa': LoveYaLikeASister_400Regular,
    'Indie': IndieFlower_400Regular,
    'Inter': Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <React.Fragment>
      <StatusBar style='auto'/>
      <AuthProvider>
        <AcademicProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </AcademicProvider>
      </AuthProvider>
    </React.Fragment>
  );
}
