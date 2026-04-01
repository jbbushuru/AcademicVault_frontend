// src/components/weeklyTTview.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '@/src/styles';

const WeeklyTTView = () => {
    return (
        <View style={styles.container}>
      <Text style={Typography.presets.Title}>Weekly Timetable View</Text>
      <Text style={Typography.presets.body}>Your schedule for the week will appear here.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    width: '100%',
    },
});

export default WeeklyTTView;
