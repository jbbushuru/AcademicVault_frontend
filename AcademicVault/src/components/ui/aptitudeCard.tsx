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

  const isStrength = typeof categoryPoints === 'number' ? categoryPoints >= 0 : !title.toLowerCase().includes('watch');
  const currentStyles = isStrength ? strengthStyles : warningStyles;

  return (
    <View style={[styles.container, currentStyles.container]}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, currentStyles.iconContainer]}>
          <Icon size={18} color={currentStyles.iconColor} />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={[styles.categoryText, currentStyles.categoryText]} numberOfLines={1}>
            {category}
          </Text>
        </View>
      </View>

      <View style={[styles.badge, currentStyles.badge]}>
        <Medal size={12} color={currentStyles.iconColor} style={styles.medalIcon} />
        <Text style={[styles.pointsValue, currentStyles.pointsValue]}>
          {typeof categoryPoints === 'number' && categoryPoints > 0 ? `+${categoryPoints}` : categoryPoints}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 0,
  },
  categoryText: {
    fontFamily: 'LoveYa',
    fontSize: 17,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10,
  },
  medalIcon: {
    marginRight: 4,
  },
  pointsValue: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '800',
  },
});

interface VariantStyles {
    container: ViewStyle;
    iconContainer: ViewStyle;
    iconColor: string;
    categoryText: TextStyle;
    badge: ViewStyle;
    pointsValue: TextStyle;
}

const strengthStyles: VariantStyles = {
    container: {
      backgroundColor: '#f0fdf4', 
      borderColor: '#16a34a40',
    },
    iconContainer: {
      backgroundColor: '#dcfce7',
    },
    iconColor: '#16a34a',
    categoryText: {
      color: '#15803d',
    },
    badge: {
      backgroundColor: '#dcfce7',
    },
    pointsValue: {
      color: '#166534',
    },
};

const warningStyles: VariantStyles = {
    container: {
      backgroundColor: '#fff7ed', 
      borderColor: '#ea580c40',
    },
    iconContainer: {
      backgroundColor: '#ffedd5',
    },
    iconColor: '#ea580c', // Soft orange for "Watch"
    categoryText: {
      color: '#9a3412',
    },
    badge: {
      backgroundColor: '#ffedd5',
    },
    pointsValue: {
      color: '#c2410c',
    },
};

export default AptitudeCard;
