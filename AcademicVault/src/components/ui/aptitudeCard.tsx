import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LucideIcon, Medal } from 'lucide-react-native';
import { theme } from '@/src/styles';

interface AptitudeCardProps {
  icon: LucideIcon;
  title: string;
  category: string;
  categoryPoints: number | string;
}

const AptitudeCard = ({ icon: Icon, title, category, categoryPoints }: AptitudeCardProps) => {
  const colors = theme();
  if (!colors) return null;

  // Determine variant based on points or presence of "strength" in title
  const isStrength = typeof categoryPoints === 'number' ? categoryPoints >= 0 : !title.toLowerCase().includes('watch');

  const currentStyles = isStrength ? strengthStyles : warningStyles;

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, currentStyles.iconContainer]}>
          <Icon size={20} color={currentStyles.iconColor} />
        </View>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      {/* Category Name */}
      <Text style={[styles.categoryText, currentStyles.categoryText]}>{category}</Text>

      {/* Points Box */}
      <View style={[styles.pointsBox, currentStyles.pointsBox]}>
        <View style={styles.pointsHeader}>
          <Medal size={16} color="#9333ea" style={styles.medalIcon} />
          <Text style={styles.pointsLabel}>Category Points</Text>
        </View>
        <Text style={[styles.pointsValue, currentStyles.pointsValue]}>
          {typeof categoryPoints === 'number' && categoryPoints > 0 ? `+${categoryPoints}` : categoryPoints}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  categoryText: {
    fontFamily: 'LoveYa',
    fontSize: 20,
    marginBottom: 6,
  },
  pointsBox: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medalIcon: {
    marginRight: 8,
  },
  pointsLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  pointsValue: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '800',
  },
});

interface VariantStyles {
    container: ViewStyle;
    iconContainer: ViewStyle;
    iconColor: string;
    categoryText: TextStyle;
    pointsBox: ViewStyle;
    pointsValue: TextStyle;
}

const strengthStyles: VariantStyles = {
    container: {
      backgroundColor: '#f0fdf4', 
      borderColor: '#bbf7d0',
    },
    iconContainer: {
      backgroundColor: '#dcfce7',
    },
    iconColor: '#16a34a',
    categoryText: {
      color: '#15803d',
    },
    pointsBox: {
      backgroundColor: '#dcfce780',
      borderColor: '#86efac',
    },
    pointsValue: {
      color: '#166534',
    },
};

const warningStyles: VariantStyles = {
    container: {
      backgroundColor: '#fffbeb', 
      borderColor: '#fef3c7',
    },
    iconContainer: {
      backgroundColor: '#f3ece3',
    },
    iconColor: '#4338ca',
    categoryText: {
      color: '#4338ca',
    },
    pointsBox: {
      backgroundColor: '#fef3c780',
      borderColor: '#f3e6d5',
    },
    pointsValue: {
      color: '#4338ca',
    },
};

export default AptitudeCard;
