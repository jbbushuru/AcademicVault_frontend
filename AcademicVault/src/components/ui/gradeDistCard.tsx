// src/components/ui/gradeDistCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, Typography } from '../../styles';

export interface UnitData {
  grade: string;
  points: number;
  yearTaken: number;
  termTaken: number;
  unitCode: string;
  category: string;
  name: string;
  categoryColor?: string;
}

export default function GradeDistCard({ unitCode, name, yearTaken, termTaken, category, categoryColor }: Omit<UnitData, 'grade' | 'points'>) {
    const colors = theme();

    return (
        <View style={[styles.container, { borderColor: categoryColor || '#efe7eb' }]}>
            <View style={styles.topRow}>
                <Text style={styles.courseTitle} numberOfLines={1}>
                    {unitCode} - {name}
                </Text>
                <View style={[styles.dot, { backgroundColor: categoryColor || '#3B82F6' }]} />
            </View>
            
            <View style={styles.bottomRow}>
                <Text style={styles.detailsText}>
                    Year {yearTaken} | Sem {termTaken}
                </Text>
                <View style={styles.separator} />
                <Text style={[styles.categoryText]}>
                    {category.toUpperCase()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        marginBottom: 8,
        width: '100%',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    courseTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        fontFamily: 'InterBold',
        flex: 1,
        marginRight: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6', // Blue dot from image
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailsText: {
        fontSize: 11,
        color: '#6B7280',
        fontFamily: 'Inter',
    },
    separator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#9CA3AF',
        marginHorizontal: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '600',
        fontFamily: 'InterBold',
        letterSpacing: 0.5,
    },
});
