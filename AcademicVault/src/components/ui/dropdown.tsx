import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckCircle } from 'lucide-react-native';
import { Typography, uselogincardstyles } from '@/src/styles';

interface DropdownOption {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  data: (string | number)[] | DropdownOption[];
  onSelect: (value: any) => void;
  placeholder?: string;
}

const CustomDropdown = ({ 
  data, 
  onSelect, 
  placeholder = "Select option",
}: CustomDropdownProps) => {
  const logincardstyles = uselogincardstyles();
  if (!logincardstyles) return null;
  const [selectedValue, setSelectedValue] = useState<any | null>(null);

  // Normalize data to be an array of DropdownOption
  const normalizedData: DropdownOption[] = data.map(item => {
    if (typeof item === 'object' && item !== null && 'label' in item) {
      return item as DropdownOption;
    }
    return {
      label: `${item}`,
      value: item as string | number,
    };
  });

  const handleSelection = (item: DropdownOption) => {
    setSelectedValue(item.value);
    onSelect(item.value);
  };

  const renderItem = (item: DropdownOption) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === selectedValue && (
          <CheckCircle
            style={styles.icon}
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
      placeholderStyle={[Typography.presets.subtitle, { color: "#b1b1b1" }]}
      selectedTextStyle={[Typography.presets.subtitle,{fontSize:14}]}

      data={normalizedData}

      labelField="label"
      valueField="value"

      placeholder={placeholder}

      value={selectedValue}
      onChange={handleSelection}

      
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
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
    color: '#666',
  },
});

export default CustomDropdown;
