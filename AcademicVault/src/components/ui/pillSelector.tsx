// src/components/ui/GenericPillSelector.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Typography } from '@/src/styles';

export type System = 'Semester' | 'Trimester';
export type TTView = 'Daily'| 'Weekly';

interface PillOption<T> {
  label: string;
  value: T;
}

interface GenericPillSelectorProps<T> {
  options: [PillOption<T>, PillOption<T>]; 
  selectedValue: T; // This must come from the Parent
  onSelectionChange: (value: T) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * A controlled 2-option pill selector with a single default export.
 */
const GenericPillSelector = <T,>({
  options,
  selectedValue,
  onSelectionChange,
  containerStyle,
}: GenericPillSelectorProps<T>) => {
  
  // Safety check: Ensure options exist before rendering
  if (!options || options.length < 2) return null;

  return (
    <View style={containerStyle}>
      <View style={styles.wrapper}>
        {options.map((opt) => {
          const isActive = selectedValue === opt.value;

          return (
            <TouchableOpacity
              key={String(opt.value)}
              onPress={() => onSelectionChange(opt.value)}
              activeOpacity={0.8}
              style={[
                styles.option, 
                isActive && styles.activeOption
              ]}
            >
              <Text 
                style={[
                  styles.text, 
                  isActive && styles.activeText, 
                  Typography.presets.subtitle
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#7B5E7740',
    borderRadius: 25,
    padding: 5,
    width: '100%',
    maxWidth: 300,
  },
  option: {
    flex: 1,
    paddingVertical: 6, // Slightly larger for better touch area
    alignItems: 'center',
    borderRadius: 21,
  },
  activeOption: {
    backgroundColor: '#b76e7950',
    borderWidth: 1,
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

export default GenericPillSelector;