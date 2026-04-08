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
import LoadingScreen from '@/src/screens/shared/Loader';
import { TimetableProvider } from '../context/TimetableContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, isLoading, isFetchingProfile } = useAuth();
  if (isLoading || isFetchingProfile) {
    return <LoadingScreen />;
  }
  
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='account' options={{animation:'slide_from_right'}} />
        <Stack.Screen name='ttsettings' options={{animation:'slide_from_bottom'}} />
        <Stack.Screen name='upload' options={{animation:'slide_from_bottom'}} />
      </Stack.Protected>
      <Stack.Screen name='auth' />
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
          <TimetableProvider>
            <RootNavigator />
          </TimetableProvider>
        </AcademicProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
