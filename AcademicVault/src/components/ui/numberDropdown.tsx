import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckCircle, Hash } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { Typography, uselogincardstyles } from '@/src/styles';

// Define the interface for numeric items
interface NumberOption {
  label: string;
  value: number;
}

interface NumberSelectorProps {
  maxNumber: number; // How many numbers to show (e.g., 10 or 50)
  onNumberSelected: (value: number) => void;
  placeholder?: string;
}

const NumberSelectorComponent = ({ 
  maxNumber, 
  onNumberSelected, 
  placeholder = " select " 
}: NumberSelectorProps) => {
  const logincardstyles = uselogincardstyles();
  if (!logincardstyles) return null;   
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  // Generate the numbers array dynamically from 1 to maxNumber
  const numberData: NumberOption[] = Array.from({ length: maxNumber }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const handleSelection = (item: NumberOption) => {
    setSelectedValue(item.value);
    onNumberSelected(item.value);
  };

  const renderItem = (item: NumberOption) => {
    return (
      <View style={componentStyles.item}>
        <Text style={componentStyles.textItem}>{item.label}</Text>
        {item.value === selectedValue && (
          <CheckCircle
            style={componentStyles.icon}
            color="green"
            size={15}
          />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={logincardstyles.input}
      placeholderStyle={[Typography.presets.subtitle,{color:"#b1b1b1"}]}
      selectedTextStyle={Typography.presets.subtitle}
      
      data={numberData}
      
      labelField="label"
      valueField="value"
      
      placeholder={placeholder}
      
      value={selectedValue}
      onChange={handleSelection}
      
      
      renderItem={renderItem}
    />
  );
};

const componentStyles = StyleSheet.create({

      icon: {
        marginRight: 8,
        color: '#000',
      },
      item: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      textItem: {
        flex: 1,
        fontSize: 14,
        color: '#666', // Fixed black text for dropdown items (as dropdown background is usually white)
      },
      selectedTextStyle: {
        fontSize: 16,
        color: '#666',
      }
});

export default NumberSelectorComponent;