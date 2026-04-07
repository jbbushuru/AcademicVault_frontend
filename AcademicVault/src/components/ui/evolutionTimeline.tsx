// src/components/ui/evolutionTimeline.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock, Dumbbell } from 'lucide-react-native';
import { Typography, theme } from '../../styles';
import { useAuth } from '../../context/AuthContext';

import { useAcademic } from '../../context/AcademicContext';
import { useMemo } from 'react';

export default function EvolutionTimeline() {
  const { userProfile } = useAuth();
  const { stats } = useAcademic();
  const colors = theme();
  const currentYear = userProfile?.year || 1;
  const evolutionData = stats.evolutionData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{display:'flex',flexDirection:'row',gap:10,alignItems:'center'}}>
          <Dumbbell size={20} color="#4A90D9" />
          <Text style={[styles.title, Typography.presets.Headertitle]}>Strength Evolution Timeline</Text>
        </View>
        <Text style={[styles.subtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
          How your primary strengths changed over time
        </Text>
      </View>

      <View style={styles.timelineContainer}>
        {/* The Vertical Line */}
        <View style={styles.verticalLine} />

        {evolutionData.map((yearItem, index) => {
          const isLocked = yearItem.year > currentYear;
          const isCurrent = yearItem.year === currentYear;
          const isLast = index === evolutionData.length - 1;

          return (
            <View key={index} style={[styles.timelineItem, isLast && { marginBottom: 0 }]}>
              {/* Dot on the line */}
              <View style={styles.dotContainer}>
                <View style={[
                   styles.outerDot,{borderColor:isLocked ? '#e5e7eb' : yearItem.primaryColor }, 
                   { backgroundColor: isLocked ? '#E5E7EB' : yearItem.primaryColor },
                   isCurrent && styles.currentDotShadow
                ]}>
                   {isLocked ? <Lock size={12} color="#9CA3AF" /> : isCurrent ? <View style={styles.innerDotCurrent} /> : null}
                </View>
              </View>

              {/* Card */}
              <View style={[
                  styles.card, 
                  isLocked ? styles.lockedCard : isCurrent ? styles.currentCard : null,
                  { borderColor: isLocked ? '#c3c5c9' : isCurrent ? '#4A90D9' : '#E5E7EB' }
              ]}>
                <View style={styles.cardHeader}>
                    <View style={styles.yearRow}>
                      <Text style={[styles.yearLabel, isCurrent && { color: '#4A90D9' }]}>Year {yearItem.year}</Text>
                      {isCurrent && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current Year</Text></View>}
                    </View>
                    {yearItem.hasData && !isLocked && (
                        <View style={[styles.indicatorDot, { backgroundColor: yearItem.primaryColor }]} />
                    )}
                </View>
                
                <Text style={[
                  styles.strengthTitle,
                  isLocked && { color: '#9CA3AF' }
                ]}>
                  {isLocked 
                    ? "Undiscovered Territory" 
                    : !yearItem.hasData 
                      ? "No units recorded yet" 
                      : yearItem.primaryName}
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
    borderRadius: 24,
    padding: 16,
    width: '100%',
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
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
    backgroundColor: '#F3F4F6',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  dotContainer: {
    width: 35,
    alignItems: 'center',
    zIndex: 1,
  },
  outerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:-18,
  },
  currentDotShadow: {
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderColor: '#4A90D9',
  },
  innerDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lockedCard: {
    opacity: 0.6,
    backgroundColor: '#e5e7eb90',
    borderStyle: 'dashed',
  },
  currentCard: {
    backgroundColor: '#F0F7FF',
    borderColor: '#4A90D9',
    elevation: 2,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentBadge: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'InterBold',
  },
  yearLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  strengthTitle: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'InterBold',
  },
});
