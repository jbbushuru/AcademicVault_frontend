// src/components/ui/GenericPillSelector.tsx

import { Typography } from '@/src/styles';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Define the interface for the individual options
interface PillOption<T> {
  label: string;
  value: T;
}

interface GenericPillSelectorProps<T> {
  options: [PillOption<T>, PillOption<T>]; // Strictly enforces 2 choices
  initialValue: T;
  onSelectionChange: (value: T) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// --- Sub-component: Option (Defined Outside) ---
const Option = <T,>({ 
  label, 
  value, 
  isActive, 
  onPress 
}: { 
  label: string; 
  value: T; 
  isActive: boolean; 
  onPress: (val: T) => void 
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      activeOpacity={0.8}
      style={[styles.option, isActive && styles.activeOption]}
    >
      <Text style={[styles.text, isActive && styles.activeText,Typography.presets.subtitle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Main Component ---
export const GenericPillSelector = <T,>({
  options,
  initialValue,
  onSelectionChange,
  containerStyle,
}: GenericPillSelectorProps<T>) => {
  const [activeValue, setActiveValue] = useState<T>(initialValue);

  const handlePress = (value: T) => {
    setActiveValue(value);
    onSelectionChange(value);
  };

  return (
    <View>
      <View style={styles.wrapper}>
        {options.map((opt) => (
          <Option
            key={String(opt.value)}
            label={opt.label}
            value={opt.value}
            isActive={activeValue === opt.value}
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#7B5E7740', // Light grey background
    borderRadius: 25,
    padding: 5,
    width: '100%',
    maxWidth: 300,
  },
  option: {
    flex: 1,
    paddingVertical: 1,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeOption: {
    backgroundColor: '#b76e7950',
    borderWidth:1,
    borderColor: '#7b5e77',

  },
  text: {
    color: '#000',
    fontWeight: '600',
  },
  activeText: {
    color: '#7B5E77',
  },
});