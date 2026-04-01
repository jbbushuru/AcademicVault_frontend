//app/_layout.tsx

import { useFonts, LoveYaLikeASister_400Regular } from '@expo-google-fonts/love-ya-like-a-sister';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import { Inter_400Regular} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AcademicProvider } from '../context/AcademicContext';
import LoadingScreen from '../screens/Loader';
import { ThemeProvider } from '../context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, isLoading, isFetchingProfile } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    // if (isLoading || isFetchingProfile) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to login if user is NOT logged in and NOT already in auth
      router.replace('/auth');
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to dashboard if user IS logged in and IS in auth
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading, isFetchingProfile, segments]);

  if (isLoading || isFetchingProfile) {
    return <LoadingScreen />;
  }
  
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name='auth' />
      <Stack.Screen name='account' options={{animation:'slide_from_bottom'}} />
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
    <SafeAreaProvider>
      <StatusBar style='auto'/>
      <AuthProvider>
        <AcademicProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </AcademicProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
