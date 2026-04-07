// src/components/ui/skills.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle} from 'react-native-svg';
import { ChevronDown, ChevronUp, BookOpen, Sparkles, Radar, Database } from 'lucide-react-native';
import { Typography } from '../../styles';
import { useAcademic } from '../../context/AcademicContext';
import { useAuth } from '../../context/AuthContext';

export default function SkillCompetencyMapping() {
  const { stats, currentContext } = useAcademic();
  const { userProfile } = useAuth();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const termLabel = userProfile?.academicSystem === 'Trisemester' ? 'Term' : 'Sem';
  const processedCategories = stats.skillsData;

  const toggleExpand = (index: number) => {
    try {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (e) {
        console.warn("LayoutAnimation failed", e);
    }
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // --- Radar Chart Constants ---
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  const categoryCount = processedCategories?.length || 0;
  const angleStep = (Math.PI * 2) / (categoryCount || 1);

  const getCoordinates = (index: number, val: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const gridLevels = [0, 25, 50, 75, 100];
  const gridPoints = gridLevels.map(level => 
    Array.from({ length: categoryCount }, (_, i) => {
      const coord = getCoordinates(i, level);
      return `${coord.x},${coord.y}`;
    }).join(' ')
  );

  const dataPathString = processedCategories?.map((cat, i) => {
    const coord = getCoordinates(i, cat.averagePoints);
    return `${coord.x},${coord.y}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Radar size={20} color="#9B7B95" />
          </View>
          <View>
            <Text style={[ Typography.presets.Headertitle]}>Skill Competency Mapping</Text>
          </View>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Your strength distribution across core areas
      </Text>
      {categoryCount === 0 ? (
        <View style={styles.emptyState}>
            <Database size={24} color={'#9CA3AF'} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No skill data for {currentContext}.</Text>
            <Text style={styles.emptySubtext}>Add units with categories to see your radar chart.</Text>
        </View>
      ) : (
        <>
          {/* Radar Chart Container */}
          <View style={styles.chartContainer}>
            <Svg width={size} height={size}>
              {/* Grid Hexagons */}
              {gridPoints.map((points, i) => (
                <Polygon 
                  key={i} 
                  points={points} 
                  fill="none" 
                  stroke="#D1D5DB" 
                  strokeWidth="1" 
                  strokeDasharray="4,4"
                />
              ))}

              {/* Axes */}
              {Array.from({ length: categoryCount }, (_, i) => {
                const coord = getCoordinates(i, 100);
                return (
                  <Line 
                    key={i} 
                    x1={centerX} 
                    y1={centerY} 
                    x2={coord.x} 
                    y2={coord.y} 
                    stroke="#D1D5DB" 
                    strokeWidth="1" 
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Labels */}
              {processedCategories?.map((cat, i) => {
                const coord = getCoordinates(i, 115); // Place label slightly further
                return (
                  <SvgText
                    key={i}
                    x={coord.x}
                    y={coord.y}
                    fill="#4B5563"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {cat.name.split(' ')[0]} {/* Shorten label for space */}
                  </SvgText>
                );
              })}

              {/* Skill Performance Data Path */}
              <Polygon 
                points={dataPathString || ""} 
                fill="rgba(155, 123, 149, 0.2)" 
                stroke="#9B7B95" 
                strokeWidth="3" 
              />

              {/* Data Points */}
              {processedCategories?.map((cat, i) => {
                const coord = getCoordinates(i, cat.averagePoints);
                return (
                  <Circle 
                    key={i} 
                    cx={coord.x} 
                    cy={coord.y} 
                    r="4" 
                    fill="#9B7B95" 
                    stroke="#FFFFFF" 
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
          </View>

          {/* Categories List */}
          <View style={styles.categoriesList}>
            {processedCategories?.map((cat, index) => (
              <View key={index} style={[styles.categoryWrapper, { borderColor: cat.signatureColor + '40' }]}>
                <TouchableOpacity 
                  onPress={() => toggleExpand(index)}
                  style={styles.categoryHeader}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryLeft}>
                    <View style={[styles.colorIndicator, { backgroundColor: cat.signatureColor }]} />
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={[styles.percentValue, { color: cat.signatureColor }]}>{cat.averagePoints}%</Text>
                    {expandedIndex === index ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
                  </View>
                </TouchableOpacity>

                {expandedIndex === index && (
                  <View style={styles.categoryDetails}>
                    <Text style={styles.descriptionText}>{cat.description}</Text>
                    <View style={styles.unitsSection}>
                        <View style={styles.sectionTitleRow}>
                            <BookOpen size={16} color="#6B7280" />
                            <Text style={styles.sectionTitle}>Units ({cat.unitCount})</Text>
                        </View>
                        <View style={cat.unitCount > 4 ? { height: 180 } : null}>
                            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true} persistentScrollbar={true}>
                            {cat.units.map((unit, uIdx) => (
                                <View key={uIdx} style={styles.unitItem}>
                                <View style={styles.unitDot} />
                                <View style={{flex: 1}}>
                                    <Text style={styles.unitName}>{unit.name}</Text>
                                    <Text style={styles.unitPoints}>
                                    Yr {unit.year} • {termLabel} {unit.term} • <Text style={{fontWeight: '700'}}>{unit.points} pts</Text>
                                    </Text>
                                </View>
                                </View>
                            ))}
                            </ScrollView>
                        </View>
                        <View style={styles.averageFooter}>
                            <Sparkles size={14} color={cat.signatureColor} />
                            <Text style={styles.footerText}>Category Proficiency: {cat.averagePoints}%</Text>
                        </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F7F3F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#1F2937',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 20,
  },
  emptyText: {
    fontFamily: 'InterBold',
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoriesList: {
    gap: 12,
  },
  categoryWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'InterBold',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  percentValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'InterBold',
  },
  categoryDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  unitsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9B7B95',
    marginRight: 10,
  },
  unitName: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  unitPoints: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  averageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  }
});
