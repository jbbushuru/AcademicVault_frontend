// src/components/ui/skills.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle, G } from 'react-native-svg';
import { ChevronDown, ChevronUp, BookOpen, Sparkles } from 'lucide-react-native';
import { Typography, theme } from '../../styles';


interface Unit {
  name: string;
  points: number; // 0-100 scale
}

interface SkillCategory {
  name: string;
  description: string;
  signatureColor: string;
  units: Unit[];
}

const mockCategories: SkillCategory[] = [
  {
    name: 'Programming',
    description: 'Practical code implementation and logic design.',
    signatureColor: '#9B7B95',
    units: [
      { name: 'Intro to Programming', points: 88 },
      { name: 'Data Structures', points: 82 },
      { name: 'Web Development', points: 85 },
    ],
  },
  {
    name: 'Mathematics',
    description: 'Foundational logical and computational skills.',
    signatureColor: '#8D6E63',
    units: [
      { name: 'Calculus I', points: 75 },
      { name: 'Linear Algebra', points: 90 },
      { name: 'Discrete Math', points: 80 },
    ],
  },
  {
    name: 'Data and Analytics',
    description: 'Processing and interpreting complex datasets.',
    signatureColor: '#00C853',
    units: [
      { name: 'Statistics', points: 92 },
      { name: 'Data Mining', points: 78 },
    ],
  },
  {
    name: 'Theory and Fundamentals',
    description: 'Abstract computational models and principles.',
    signatureColor: '#FFC107',
    units: [
      { name: 'Operating Systems', points: 85 },
      { name: 'Database Systems', points: 84 },
    ],
  },
  {
    name: 'Systems',
    description: 'Design and optimization of system architectures.',
    signatureColor: '#3B82F6',
    units: [
      { name: 'Distributed Systems', points: 95 },
      { name: 'Computer Networks', points: 88 },
    ],
  },
  {
    name: 'Soft Skills',
    description: 'Communication, collaboration, and management.',
    signatureColor: '#EC4899',
    units: [
      { name: 'Project Management', points: 82 },
      { name: 'Professional Ethics', points: 94 },
    ],
  },
];

export default function SkillCompetencyMapping() {
  const colors = theme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const processedCategories = mockCategories.map(cat => ({
    ...cat,
    unitCount: cat.units.length,
    averagePoints: Math.round(cat.units.reduce((sum, u) => sum + u.points, 0) / cat.units.length),
  }));

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // --- Radar Chart Constants ---
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.4;
  const categoryCount = processedCategories.length;
  const angleStep = (Math.PI * 2) / categoryCount;

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

  const dataPathString = processedCategories.map((cat, i) => {
    const coord = getCoordinates(i, cat.averagePoints);
    return `${coord.x},${coord.y}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, Typography.presets.Headertitle]}>Skill Competency Mapping</Text>
        <Text style={[styles.subtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
          Your strength distribution across core areas
        </Text>
      </View>

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
          {processedCategories.map((cat, i) => {
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
            points={dataPathString} 
            fill="rgba(155, 123, 149, 0.2)" 
            stroke="#9B7B95" 
            strokeWidth="3" 
          />

          {/* Data Points */}
          {processedCategories.map((cat, i) => {
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
        {processedCategories.map((cat, index) => (
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
                {expandedIndex === index ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
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
                  
                  {cat.units.map((unit, uIdx) => (
                    <View key={uIdx} style={styles.unitItem}>
                      <View style={styles.unitDot} />
                      <Text style={styles.unitName}>{unit.name}</Text>
                      <View style={styles.unitSpacer} />
                      <Text style={styles.unitPoints}>{unit.points}%</Text>
                    </View>
                  ))}
                  
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
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
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
    gap: 12,
  },
  percentValue: {
    fontSize: 16,
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
  unitSpacer: {
    width: 10,
  },
  unitPoints: {
    fontSize: 13,
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
