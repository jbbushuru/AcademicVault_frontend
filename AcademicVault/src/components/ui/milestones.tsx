// src/components/ui/milestones.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Medal, Lock, Award, ShieldCheck, Zap } from 'lucide-react-native';
import { Typography, theme } from '../../styles';
import MilestoneCard from './milestoneCard';

const { width } = Dimensions.get('window');

interface Milestone {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  type: 'medal' | 'shield' | 'zap' | 'award';
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: "Dean's List",
    description: "Overall average above 9.0 (Y2S2)",
    isUnlocked: true,
    type: 'medal',
  },
  {
    id: '2',
    title: "Code Ninja",
    description: "Completed 10 Programming units",
    isUnlocked: true,
    type: 'zap',
  },
  {
    id: '3',
    title: "Database Guru",
    description: "Project Excellence in SQL",
    isUnlocked: false,
    type: 'award',
  },
  {
    id: '4',
    title: "Scholar Elite",
    description: "Finish Y3 with no misses",
    isUnlocked: false,
    type: 'shield',
  },
];

export default function AcademicMilestones() {
  const colors = theme();
  const unlockedCount = mockMilestones.filter(m => m.isUnlocked).length;
  const totalCount = mockMilestones.length;

  const getIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'medal': return <Medal size={24} color="#10B981" />;
      case 'zap': return <Zap size={24} color="#3B82F6" />;
      case 'shield': return <ShieldCheck size={24} color="#8B5CF6" />;
      case 'award': return <Award size={24} color="#F59E0B" />;
      default: return <Award size={24} color="#10B981" />;
    }
  };

  const getIconBg = (type: Milestone['type']) => {
    switch (type) {
      case 'medal': return '#D1FAE5';
      case 'zap': return '#DBEAFE';
      case 'shield': return '#EDE9FE';
      case 'award': return '#FEF3C7';
      default: return '#D1FAE5';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Award size={24} color="#F59E0B" style={styles.headerIcon} />
          <View>
             <Text style={[styles.title, Typography.presets.Headertitle]}>Academic Milestones</Text>
             <Text style={[styles.subtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
               Your achievements & progress
             </Text>
          </View>
        </View>
        <Text style={styles.progressText}>{unlockedCount}/{totalCount}</Text>
      </View>

      {/* Horizontal Scroll Area */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {mockMilestones.map((item) => (
          <MilestoneCard 
            key={item.id}
            title={item.title}
            description={item.description}
            isUnlocked={item.isUnlocked}
            icon={getIcon(item.type)}
            iconBgColor={getIconBg(item.type)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    transform: [{ rotate: '-5deg' }],
  },
  title: {
    fontSize: 20,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    fontFamily: 'InterBold',
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
  },
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
    backgroundColor: '#FAFAFA',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'InterBold',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter',
    lineHeight: 16,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 0.5,
  },
});
