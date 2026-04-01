// src/components/ui/evolutionTimeline.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Typography, theme } from '../../styles';
import { useAuth } from '../../context/AuthContext';

interface YearCategory {
  name: string;
  color: string;
  proficiency: number;
}

interface YearData {
  year: number;
  categories: YearCategory[];
}

const mockEvolutionData: YearData[] = [
  {
    year: 1,
    categories: [
      { name: 'Programming & Dev', color: '#3B82F6', proficiency: 85 },
      { name: 'Mathematics', color: '#10B981', proficiency: 70 },
      { name: 'System', color: '#8B5CF6', proficiency: 60 },
    ],
  },
  {
    year: 2,
    categories: [
      { name: 'Programming & Dev', color: '#3B82F6', proficiency: 90 },
      { name: 'Data & Analytics', color: '#F59E0B', proficiency: 75 },
    ],
  },
  {
    year: 3,
    categories: [
      { name: 'Database Systems', color: '#8B5CF6', proficiency: 88 },
      { name: 'Theory', color: '#F43F5E', proficiency: 82 },
    ],
  },
  {
    year: 4,
    categories: [
      { name: 'Mathematics', color: '#10B981', proficiency: 92 },
      { name: 'Soft Skills', color: '#EC4899', proficiency: 85 },
    ],
  },
];

export default function EvolutionTimeline() {
  const { userProfile } = useAuth();
  const colors = theme();
  const currentYear = userProfile?.year || 1;

  const getPrimaryStrength = (yearData: YearData) => {
    return yearData.categories.reduce((prev, current) => 
      (prev.proficiency > current.proficiency) ? prev : current
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, Typography.presets.Headertitle]}>Strength Evolution Timeline</Text>
        <Text style={[styles.subtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
          How your primary strengths changed over time
        </Text>
      </View>

      <View style={styles.timelineContainer}>
        {/* The Vertical Line */}
        <View style={styles.verticalLine} />

        {mockEvolutionData.map((yearItem, index) => {
          const isLocked = yearItem.year > currentYear;
          const primary = getPrimaryStrength(yearItem);
          const isLast = index === mockEvolutionData.length - 1;

          return (
            <View key={index} style={[styles.timelineItem, isLast && { marginBottom: 0 }]}>
              {/* Dot on the line */}
              <View style={styles.dotContainer}>
                <View style={[
                   styles.outerDot, 
                   { backgroundColor: isLocked ? '#E5E7EB' : primary.color }
                ]}>
                   {isLocked && <Lock size={12} color="#9CA3AF" />}
                </View>
              </View>

              {/* Card */}
              <View style={[
                  styles.card, 
                  isLocked && styles.lockedCard,
                  { borderColor: isLocked ? '#F3F4F6' : '#E5E7EB' }
              ]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.yearLabel}>Year {yearItem.year}</Text>
                    {!isLocked && <View style={[styles.indicatorDot, { backgroundColor: primary.color }]} />}
                </View>
                
                <Text style={[
                  styles.strengthTitle,
                  isLocked && { color: '#9CA3AF' }
                ]}>
                  {isLocked ? "Undiscovered Territory" : primary.name}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f0ede6',
    width: '100%',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  timelineContainer: {
    paddingLeft: 10,
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    left: 17,
    top: 15,
    bottom: 15,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  dotContainer: {
    width: 35,
    alignItems: 'center',
    zIndex: 1,
  },
  outerDot: {
    width: 25,
    height: 25,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginLeft:-18,
  },
  card: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lockedCard: {
    opacity: 0.6,
    backgroundColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  yearLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'InterBold',
  },
});
