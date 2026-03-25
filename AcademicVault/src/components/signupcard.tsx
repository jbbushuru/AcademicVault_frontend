// src/components/signupcard.tsx

import { GraduationCap, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Typography, uselogincardstyles } from '../styles';
import NumberSelectorComponent from './ui/numberDropdown';
import GenericPillSelector, { System } from './ui/pillSelector';
import { StepIndicator, StepItem } from './ui/stepIndicator';


const STEPS: StepItem[] = [
  { icon: User, Title: "Account", desc: "Basic Information" },
  { icon: GraduationCap, Title: "Academics", desc: "Your Academic Details" },
];

export default function SignUpCard() {
  //Styling Hook
  const logincardstyles = uselogincardstyles();
  if (!logincardstyles) return null;

  // Form Hooks
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fname, setFname] = useState<string | null>(null); //first name
  const [lname, setLname] = useState<string | null>(null); //last name
  const [email, setEmail] = useState<string | null>(null); //email address
  const [password, setPassword] = useState<string | null>(null); //password
  const [course, setCourse] = useState<string | null>(null); //course of study
  const [academicSystem, setAcademicSystem] = useState('Semester'); // academic system
  const [termLimit, setTermLimit] = useState<number>(2);
  const [selectedCount, setSelectedCount] = useState<number>(10);  // duration
  const [duration, setDuration] = useState<number|null>(null);
  const [currentYr, setCurrentYr] = useState<number|null>(null); //current year
  const [currentTerm, setCurrentTerm] = useState<number|null>(null); //current term
  const [phoneNum, setPhoneNum] = useState<string | null>(null); //phone number

  // Navigation Hooks
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1));
  const prevStep = () => setActiveStep(prev => Math.max(0, prev - 1));

  //Handle Academic System and Terms
  const handleSystemChange = (val: string) => {
    setAcademicSystem(val);
    if (val === "Semester") {
      setTermLimit(2);
    }
    else if (val === 'Trimester') {
      setTermLimit(3);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!fname || !fname.trim()) newErrors.fname = 'First name is required';
    if (!lname || !lname.trim()) newErrors.lname = 'Last name is required';
    if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!course || !course.trim()) newErrors.course = 'Course of study is required';
    setErrors(newErrors);
    if (duration === null) {
      newErrors.duration = 'Duration is required';
    }
    if (currentYr === null) {
      newErrors.currentYr = 'Current year is required';
    }
    if (currentTerm === null) {
      newErrors.currentTerm = 'Current term is required';
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (targetIndex: number) => {
    if (targetIndex > activeStep) {
      if (activeStep === 0 && !validateStep1()) return;
      if (activeStep === 1 && !validateStep2()) return;
    }
    setActiveStep(targetIndex);
  };

  //Conditional Step Rendering
  const renderContent = () => {
    if (activeStep === 0) {
      return (
        <View style={[{ width: '100%'}]}>
          {/* Names */}
          <View style={[{ display: 'flex', flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[logincardstyles.label, Typography.presets.subtitle]}>First Name</Text>
              <TextInput
                key="fname"
                style={[logincardstyles.input, { width: '100%' }, Typography.presets.subtitle]}
                onChangeText={setFname}
                placeholder="John"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
              />
              {errors.fname && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.fname}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Last Name</Text>
              <TextInput
                key="lname"
                style={[logincardstyles.input, { width: '100%' }, Typography.presets.subtitle]}
                onChangeText={setLname}
                placeholder="Doe"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
              />
              {errors.lname && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.lname}</Text>}
            </View>
          </View>
          {/* Email Address */}
          <View style={{ display: 'flex', flexDirection: 'column'}}>
          <View style={[logincardstyles.inputGroup]}>
            <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Email Address</Text>
            <TextInput
              key="email"
              style={[logincardstyles.input, Typography.presets.subtitle, { width: '100%' }]}
              onChangeText={setEmail}
              placeholder="you@gmail.com"
              placeholderTextColor={"#b1b1b1"}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
          </View>  
          </View>
          
          {/* Password */}
          <View style={{ display: 'flex', flexDirection: 'column'}}>
          <View style={logincardstyles.inputGroup}>
            <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Password</Text>
            <TextInput
              key="password"
              style={[logincardstyles.input, Typography.presets.subtitle]}
              onChangeText={setPassword}
              placeholder='Minimum of 8 characters'
              secureTextEntry
              placeholderTextColor={'#b1b1b1'}
            />
            {errors.password && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.password}</Text>}
          </View>  
          </View>
          
        </View>
      );
    } else if (activeStep === 1) {
      return (
        <View style={[{ display: 'flex', flexDirection: 'column', width: '100%' }]}>
          {/* Course */}
          <View style={[{ display: 'flex', flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Course of Study</Text>
              <TextInput
                key="course"
                style={[logincardstyles.input, { width: '100%' }, Typography.presets.subtitle]}
                onChangeText={setCourse}
                placeholder="Computer Scien..."
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
              />
              {errors.course && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.course}</Text>}
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Duration in Years</Text>
              <NumberSelectorComponent
                maxNumber={selectedCount}
                onNumberSelected={(num) => {setDuration(num);setSelectedCount(num);}}
              />
              {errors.duration && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.duration}</Text>}
            </View>
          </View>

          {/* Academic System selector */}
          <View style={{ display: 'flex', flexDirection: 'column'}}>
          <View style={logincardstyles.inputGroup}>
            <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Academic System?</Text>
            <GenericPillSelector
              selectedValue={academicSystem} // Correct prop name
              onSelectionChange={(val) => handleSystemChange(val as System)}
              options={[
                { label: 'Semester', value: 'Semester' },
                { label: 'Trimester', value: 'Trimester' },
              ]}
            />
          </View>  
          </View>
          

          {/* Year and Sem */}
          <View style={[{ display: 'flex', flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12 }]}>
            <View style={{width: '50%'}}>
              <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Current Yr of Study</Text>
              <NumberSelectorComponent
                maxNumber={selectedCount}
                onNumberSelected={(num) => setCurrentYr(num)}
              />
              {errors.currentYr && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.currentYr}</Text>}
            </View>

            <View style={{width: '50%'}}>
              <Text style={[logincardstyles.label, Typography.presets.subtitle]}>Current {academicSystem}</Text>
              <NumberSelectorComponent
                maxNumber={termLimit}
                onNumberSelected={(num) => setCurrentTerm(num)}
              />
              {errors.currentTerm && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{errors.currentTerm}</Text>}
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={logincardstyles.card}>
      {/* Header */}
      <Text style={[logincardstyles.title, Typography.presets.Slogan, { marginBottom: 12 }]}>Sign up</Text>
      {/* Log in link */}
      <View style={[{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', marginBottom: 12 }]}>
        <Text style={logincardstyles.footerText}>Already have an account? </Text>
        <TouchableOpacity>
          <Text style={[logincardstyles.footerText, logincardstyles.signUpLink]}>Log in</Text>
        </TouchableOpacity>
      </View>
      {/* Step Indicator */}
      <View>
        <StepIndicator
          steps={STEPS}
          activeStep={activeStep}
          onStepChange={handleStepChange}
        />
      </View>

      {/* Dynamic Form Content */}
      <View style={{ marginTop: 12, display: 'flex', flexDirection: 'column', flex: 1   }}>
        {renderContent()}
      </View>

      {/* Navigation Buttons */}
      <View style={[{ display: 'flex', flexDirection: 'row', gap: 12, width: '100%', marginBottom: 12, marginTop: 12 }]}>
        {activeStep > 0 && (
          <TouchableOpacity
            style={[logincardstyles.altbutton, { marginTop: 12, marginBottom: 0, flex: 1 }]}
            onPress={() => prevStep()}
          >
            <Text style={[Typography.presets.Slogan, logincardstyles.buttonText, { color: '#000' }]}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[logincardstyles.button, { marginTop: 12, marginBottom: 0, flex: 1 }]}
          onPress={() => {
            if (activeStep === 0 && !validateStep1()) return;
            if (activeStep === 1 && !validateStep2()) return;

            if (activeStep < STEPS.length - 1) {
              nextStep();
            } else {
              // Final Submit action
              console.log('Form Submitted');
            }
          }}
        >
          <Text style={[Typography.presets.Slogan, logincardstyles.buttonText]}>
            {activeStep === STEPS.length - 1 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f9f7fb', alignItems: 'center', justifyContent: 'center', padding: 20 },
  header: { marginBottom: 30, alignItems: 'center' },
  headline: { fontSize: 24, color: '#3F344D', fontWeight: 'bold' },
  subheadline: { color: '#9ca3af', marginTop: 5 },
  card: { backgroundColor: '#fff', borderRadius: 16, width: '100%', padding: 10, elevation: 2 },
  navContainer: { flexDirection: 'row', marginTop: 40, gap: 15 },
  btn: { paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25, borderWidth: 1, borderColor: '#b3a0bc' },
  btnPrimary: { backgroundColor: '#7f6c88', borderColor: '#7f6c88' },
  btnTextBack: { color: '#7f6c88', fontWeight: '600' },
  btnTextNext: { color: '#fff', fontWeight: '600' },
  disabled: { opacity: 0.3 }
});