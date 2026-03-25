// src/components/ui/stepIndicator.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LucideIcon, Check } from 'lucide-react-native';
import { Typography } from '@/src/styles';

export interface StepItem {
  icon: LucideIcon;
  Title: string;
  desc: string;
}

interface StepIndicatorProps {
  steps: StepItem[];
  activeStep: number;
  onStepChange?: (index: number) => void;
}

const StepNode = ({ 
  step, 
  isActive, 
  isCompleted, 
  index, 
  onPress 
}: { 
  step: StepItem; 
  isActive: boolean; 
  isCompleted: boolean; 
  index: number; 
  onPress: (index: number) => void 
}) => {
  const Icon = isCompleted ? Check : step.icon;

  return (
    <TouchableOpacity 
      style={styles.stepContainer} 
      onPress={() => onPress(index)}
      activeOpacity={0.7}
    >
      {/* Connector Lines */}
      <View style={[
        styles.absoluteLeftLine,
        (isActive || isCompleted) && styles.completedConnector
      ]} />
      <View style={[
        styles.absoluteRightLine,
        isCompleted && styles.completedConnector
      ]} />

      {/* Circle */}
      <View style={[
        styles.circle,
        isActive && styles.activeCircle,
        isCompleted && styles.completedCircle,
      ]}>
        <Icon 
          size={15} 
          color={isActive || isCompleted ? '#fff' : '#9ca3af'} 
        />
      </View>

      {/* Labels */}
      <Text style={[
        Typography.presets.Slogan,
        styles.title,
        isActive && styles.activeTitle,
        isCompleted && styles.completedTitle
      ]}>
        {step.Title}
      </Text>
      <Text style={styles.desc}>{step.desc}</Text>
    </TouchableOpacity>
  );
};


export const StepIndicator = ({ steps, activeStep, onStepChange }: StepIndicatorProps) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <StepNode
          key={index}
          step={step}
          isActive={activeStep === index}
          isCompleted={index < activeStep}
          index={index}
          onPress={(i) => onStepChange?.(i)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: '100%',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  absoluteLeftLine: {
    position: 'absolute',
    left: 0,
    right: '50%',
    top: 14,
    height: 2,
    backgroundColor: '#e5e7eb',
    zIndex: -1,
  },
  absoluteRightLine: {
    position: 'absolute',
    left: '50%',
    right: 0,
    top: 14,
    height: 2,
    backgroundColor: '#e5e7eb',
    zIndex: -1,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: '#9d8ba5ff',
    borderColor: '#5d4a66',
    transform: [{ scale: 1.1 }],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  completedCircle: {
    backgroundColor: '#7f6c88',
    borderColor: '#5d4a66',
  },
  completedConnector: {
    backgroundColor: '#7f6c88',
  },
  title: {
    fontSize: 12,
    marginTop: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  activeTitle: { color: '#3F344D' },
  completedTitle: { color: '#5d4a66' },
  desc: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default StepIndicator;