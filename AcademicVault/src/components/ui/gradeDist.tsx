import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { GraduationCap, ChevronRight, X } from 'lucide-react-native';
import { Typography, theme } from '../../styles';
import GradeDistCard from './gradeDistCard';
import { useAcademic } from '../../context/AcademicContext';

export default function GradeDistribution() {
  const colors = theme();
  const { units, currentContext, categories } = useAcademic();

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter units based on "Year" context or "Overall"
  const filteredData = useMemo(() => {
    if (currentContext === 'Overall') return units;
    const yearMatch = currentContext.match(/\d+/);
    if (!yearMatch) return units;
    const year = parseInt(yearMatch[0]);
    return units.filter(u => u.year === year);
  }, [units, currentContext]);
  const grades = [
    { letter: 'A', label: 'Grade A', color: '#00C853' },
    { letter: 'B', label: 'Grade B', color: '#0000FF' },
    { letter: 'C', label: 'Grade C', color: '#FFC107' },
    { letter: 'D', label: 'Grade D', color: '#8D6E63' },
    { letter: 'F', label: 'Grade F', color: '#FF0000' },
  ].map(g => ({
    ...g,
    count: filteredData.filter(u => u.grade === g.letter).length
  }));

  const handleGradePress = (letter: string, count: number) => {
    if (count > 0) {
      setSelectedGrade(letter);
      setModalVisible(true);
    }
  };

  const modalUnits = filteredData.filter(u => u.grade === selectedGrade);

  return (
    <View style={[styles.card]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.letterCircle, { backgroundColor: grades.find(g => g.letter === selectedGrade)?.color }]}>
                  <Text style={styles.letterText}>{selectedGrade}</Text>
                </View>
                <View style={styles.modalTitleGroup}>
                  <Text style={[styles.modalSubtitle, Typography.presets.subtitle, { color: '#45556C' }]}>
                    You scored {['A', 'F', 'E'].includes(selectedGrade || '') ? 'an' : 'a'} {selectedGrade} in the following units
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={modalUnits.length > 6 ? { height: 450 } : null}>
            <FlatList
              data={modalUnits}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                // Find category name if it exists (handles both object or ID)
                const categoryId = typeof item.category === 'object' ? item.category?._id : item.category;
                const catInfo = categories.find(c => c._id === categoryId);
                
                return (
                  <GradeDistCard 
                    unitCode={item.unitCode}
                    name={item.name}
                    yearTaken={item.year}
                    termTaken={item.term}
                    category={catInfo?.name ? (catInfo.name.length > 19 ? catInfo.name.slice(0, 19) + '...' : catInfo.name) : 'Uncategorized'}
                    categoryColor={catInfo?.signatureColor}
                  />
                );
              }}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <View style={{width: 38,height: 38,borderRadius: 12,backgroundColor: '#F3E8FF',justifyContent: 'center',alignItems: 'center',}}>
          <GraduationCap size={20} color="#9B7B95" />
        </View>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, Typography.presets.Title]}> {currentContext} Grade Distribution</Text>
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
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
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
    gap:12,
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

