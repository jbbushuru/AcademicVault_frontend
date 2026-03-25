//app/_layout.tsx

import { useFonts, LoveYaLikeASister_400Regular } from '@expo-google-fonts/love-ya-like-a-sister';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import { Inter_400Regular} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import React from 'react';
import { StatusBar } from 'expo-status-bar';


SplashScreen.preventAutoHideAsync();
const isLoggedin = false;

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
    'LoveYa': LoveYaLikeASister_400Regular,
    'Indie': IndieFlower_400Regular,
    'Inter': Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <React.Fragment>
      <StatusBar style='auto'/>
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Protected guard={isLoggedin}>
          <Stack.Screen name='(tabs)'/>
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedin}>
          <Stack.Screen name='auth'/>
        </Stack.Protected>
        
      </Stack>
    </React.Fragment>
  

  );
}
