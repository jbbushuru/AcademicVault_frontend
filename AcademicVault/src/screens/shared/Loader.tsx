// src/screens/Loader.tsx

import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  Animated
} from 'react-native';
import { loaderstyles,Typography } from '@/src/styles';


const LoadingScreen = () => {
  // Animation for the floating circles
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={loaderstyles.container}>
      {/* Background Decorative Circles */}
      <Animated.View style={[loaderstyles.circle, loaderstyles.circleTopRight, { transform: [{ scale: pulseAnim }] }]} />
      <Animated.View style={[loaderstyles.circle, loaderstyles.circleMiddleLeft, { transform: [{ scale: pulseAnim }] }]} />
      <Animated.View style={[loaderstyles.circle, loaderstyles.circleBottomRight, { transform: [{ scale: pulseAnim }] }]} />
      <View style={[loaderstyles.circle, loaderstyles.circleTopLeft]} />

      <View style={loaderstyles.content}>
        {/* Banner Tag */}
        <View style={loaderstyles.bannerContainer}>
          <Text style={[Typography.presets.subtitle,{color:'#C6005C'}]}>⭐ My Digital Study Scrapbook ⭐</Text>
        </View>

        {/* Main Illustration */}
        <Image 
          source= {require('@/assets/images/AV_startup.png')} 
          style={loaderstyles.illustration}
          resizeMode="contain"
        />

        {/* Typography */}
        <Text style={Typography.presets.Slogan}>Your Academic Life</Text>
        <Text style={[Typography.presets.Slogan,{color:'#9B7B95'}]}>Beautifully Organized</Text>

        {/* Loading Indicator Replacement */}
        <View style={loaderstyles.loaderContainer}>
          <ActivityIndicator size="large" color="#7D667E" />
          <Text style={loaderstyles.loadingText}>Preparing your workspace...</Text>
        </View>
      </View>
    </View>
  );
};

export default LoadingScreen;
