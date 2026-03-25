// src/components/ui/stepIndicator.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LucideIcon, Check } from 'lucide-react-native';

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
      {/* Circle */}
      <View style={[
        styles.circle,
        isActive && styles.activeCircle,
        isCompleted && styles.completedCircle,
      ]}>
        <Icon 
          size={20} 
          color={isActive || isCompleted ? '#fff' : '#9ca3af'} 
        />
      </View>

      {/* Labels */}
      <Text style={[
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
        <React.Fragment key={index}>
          <StepNode
            step={step}
            isActive={activeStep === index}
            isCompleted={index < activeStep}
            index={index}
            onPress={(i) => onStepChange?.(i)}
          />
          {index < steps.length - 1 && (
            <View style={styles.connectorContainer}>
              <View style={[
                styles.connector,
                index < activeStep && styles.completedConnector
              ]} />
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: '#7f6c88',
    borderColor: '#5d4a66',
    transform: [{ scale: 1.1 }],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  completedCircle: {
    backgroundColor: '#5d4a66',
    borderColor: '#3F344D',
  },
  connectorContainer: {
    height: 48, // Matches circle height to center the line
    justifyContent: 'center',
    flex: 0.5,
  },
  connector: {
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: -10,
  },
  completedConnector: {
    backgroundColor: '#7f6c88',
  },
  title: {
    fontSize: 12,
    marginTop: 8,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
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