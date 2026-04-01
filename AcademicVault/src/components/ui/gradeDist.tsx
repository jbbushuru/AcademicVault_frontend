import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { GraduationCap, ChevronRight, X } from 'lucide-react-native';
import { Typography, theme } from '../../styles';
import GradeDistCard, { UnitData } from './gradeDistCard';

const mockUnits: UnitData[] = [
  { grade: 'A', points: 3.5, yearTaken: 2, termTaken: 1, unitCode: 'CSE 1207', category: 'programming', name: 'Introduction to Programming' },
  { grade: 'B', points: 3.0, yearTaken: 1, termTaken: 2, unitCode: 'MAT 1105', category: 'math', name: 'Calculus I' },
  { grade: 'B', points: 3.2, yearTaken: 1, termTaken: 1, unitCode: 'CCS 2127', category: 'theory', name: 'Theoretical Computer Science' },
  { grade: 'C', points: 2.5, yearTaken: 1, termTaken: 1, unitCode: 'PHY 1101', category: 'data', name: 'Physics for Engineers' },
  { grade: 'A', points: 3.8, yearTaken: 1, termTaken: 2, unitCode: 'ENG 1102', category: 'theory', name: 'Critical Thinking' },
];

export default function GradeDistribution() {
  const colors = theme();
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const grades = [
    { letter: 'A', label: 'Grade A', color: '#00C853' },
    { letter: 'B', label: 'Grade B', color: '#0000FF' },
    { letter: 'C', label: 'Grade C', color: '#FFC107' },
    { letter: 'D', label: 'Grade D', color: '#8D6E63' },
    { letter: 'F', label: 'Grade F', color: '#FF0000' },
  ].map(g => ({
    ...g,
    count: mockUnits.filter(u => u.grade === g.letter).length
  }));

  const handleGradePress = (letter: string, count: number) => {
    if (count > 0) {
      setSelectedGrade(letter);
      setModalVisible(true);
    }
  };

  const filteredUnits = mockUnits.filter(u => u.grade === selectedGrade);

  return (
    <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.letterCircle, { backgroundColor: grades.find(g => g.letter === selectedGrade)?.color }]}>
                  <Text style={styles.letterText}>{selectedGrade}</Text>
                </View>
                <View style={styles.modalTitleGroup}>
                  <Text style={[styles.modalSubtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
                    You scored {['A', 'F'].includes(selectedGrade || '') ? 'an' : 'a'} {selectedGrade} in the following units
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filteredUnits}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <GradeDistCard 
                  unitCode={item.unitCode}
                  name={item.name}
                  yearTaken={item.yearTaken}
                  termTaken={item.termTaken}
                  category={item.category}
                />
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <GraduationCap size={20} color="#9B7B95" />
        </View>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, Typography.presets.Headertitle]}>Grade Distribution</Text>
          <Text style={[styles.subtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
            Your performance across all courses
          </Text>
        </View>
      </View>

      {/* Grade List */}
      <View style={styles.list}>
        {grades.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.item} 
            activeOpacity={0.7} 
            disabled={item.count === 0}
            onPress={() => handleGradePress(item.letter, item.count)}
          >
            <View style={styles.leftContent}>
              <View style={[styles.letterCircle, { backgroundColor: item.color }]}>
                <Text style={styles.letterText}>{item.letter}</Text>
              </View>
              <Text style={[styles.itemLabel, { color: item.color }]}>{item.label}</Text>
            </View>
            <View style={styles.rightContent}>
              <Text style={styles.countText}>{item.count}</Text>
              {item.count > 0 && <ChevronRight size={18} color="#374151" />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitleGroup: {
    marginLeft: 16,
    flex: 1,
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  closeButton: {
    padding: 4,
  },
  listContainer: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 24,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    color: '#1F2937',
    fontSize: 18,
  },
  subtitle: {
    marginTop: 2,
  },
  list: {
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  letterCircle: {
    width: 30,
    height: 30,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'InterBold',
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'InterBold',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'InterBold',
  },
});

