// src/components/ui/milestoneCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { theme } from '@/src/styles';


export interface MilestoneCardProps {
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
}

export default function MilestoneCard({ title, description, isUnlocked, icon, iconBgColor }: MilestoneCardProps) {
  const colors = theme();
  
  return (
    <View style={[styles.card, !isUnlocked && [styles.lockedCard,{backgroundColor:colors.background,opacity:1}]]}>
      <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? iconBgColor : '#F3F4F6' }]}>
        {isUnlocked ? icon : <Lock size={24} color="#9CA3AF" />}
      </View>

      <View style={styles.content}>
        <Text style={[styles.cardTitle, !isUnlocked && styles.lockedText]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.cardDescription, !isUnlocked && styles.lockedSubText]} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {isUnlocked ? (
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>UNLOCKED</Text>
        </View>
      ) : (
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: '#D1D5DB' }]} />
          <Text style={[styles.statusText, { color: '#9CA3AF' }]}>LOCKED</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: 170,
    borderRadius: 24,
    padding: 20,
    marginRight: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    justifyContent: 'space-between',
    minHeight: 200,
  },
  lockedCard: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowOpacity: 0.05,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'InterBold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'Inter',
    lineHeight: 14,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  lockedSubText: {
    color: '#D1D5DB',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 0.5,
  },
});
