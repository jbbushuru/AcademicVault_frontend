// src/components/signupcard.tsx

import React, { useState } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { User, GraduationCap, FileText, CreditCard, CheckCircle } from 'lucide-react-native';
import { StepIndicator, StepItem } from './ui/stepIndicator';
import { Typography, uselogincardtyles } from '../styles';
import { GenericPillSelector } from './ui/pillSelector';

const STEPS: StepItem[] = [
  { icon: User, Title: "Account", desc: "Info" },
  { icon: GraduationCap, Title: "Academics", desc: "Details" },
];

export default function SignUpCard() {
  const logincardstyles = uselogincardtyles();  
  const [activeStep, setActiveStep] = useState(0);
  const [academicSystem, setAcademicSystem] = useState<'Semester' | 'Trimester'>('Semester');
  const nextStep = () => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1));
  const prevStep = () => setActiveStep(prev => Math.max(0, prev - 1));
  const renderContent = () => {
    switch(activeStep)
    {
      case 0:
        return  (
        <View style={[{display:'flex',flexDirection:'column',width:'100%'}]}>       
          {/* Names */}
        <View style={[{display:'flex',flexDirection:'row',gap:'12',width:'100%',marginBottom:12}]}>
            <View style={{flex:1}}>
            <Text style={[logincardstyles.label,Typography.presets.subtitle]}>First Name</Text>
            <TextInput
                style={[logincardstyles.input,{width:'100%'},Typography.presets.subtitle]}
                // value={fname}
                // onChangeText={setFname}
                placeholder="John"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
            />
            </View>

            <View style={{flex:1}}>
            <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Last Name</Text>
            <TextInput
                style={[logincardstyles.input,{width:'100%'},Typography.presets.subtitle]}
                // value={lname}
                // onChangeText={setLname}
                placeholder="Doe"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
            />
            </View>
        </View>
        {/* Email Address */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Email Address</Text>
          <TextInput
            style={[logincardstyles.input,Typography.presets.subtitle,{width:'100%'}]}
            // value={email}
            // onChangeText={setEmail}
            placeholder="you@gmail.com"
            placeholderTextColor={"#b1b1b1"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Password */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Password</Text>
          <TextInput
            style={[logincardstyles.input,Typography.presets.subtitle]}
            // value={password}
            // onChangeText={setPassword}
            placeholder='Minimum of 8 characters'
            secureTextEntry  
            placeholderTextColor={'#b1b1b1'}          
          />
        </View>
        </View>);
      case 1:  
    }
  }

  return (
    <View style={logincardstyles.card}>
        {/* Header */}
        <Text style={[logincardstyles.title,Typography.presets.Slogan,{marginBottom:12}]}>Sign up</Text>
        {/* Log in link */}
        <View style={[{display:'flex',flexDirection:'row',width:'100%',justifyContent:'center',marginBottom:12}]}>
            <Text style={logincardstyles.footerText}>Already have an account? </Text>
            <TouchableOpacity>
            <Text style={[logincardstyles.footerText, logincardstyles.signUpLink]}>Log in</Text>
            </TouchableOpacity>
        </View>
        {/* Step Indicator */}
        {/* <View>
            <StepIndicator 
             steps={STEPS} 
             activeStep={activeStep} 
             onStepChange={(index)=> setActiveStep(index)} 
             />
        </View> */}

      {/* STEP 2 */}
        <View style={[{display:'flex',flexDirection:'column',width:'100%'}]}>       
          {/* Course */}
        <View style={[{display:'flex',flexDirection:'row',gap:'12',width:'100%',marginBottom:12}]}>
            <View style={{flex:1}}>
            <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Course of Study</Text>
            <TextInput
                style={[logincardstyles.input,{width:'100%'},Typography.presets.subtitle]}
                // value={course}
                // onChangeText={setCourse}
                placeholder="Computer Science"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
            />
            </View>

            <View style={{flex:1}}>
            <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Duration in Years</Text>
            <TextInput
                style={[logincardstyles.input,{width:'100%'},Typography.presets.subtitle]}
                // value={duration}
                // onChangeText={setDuration}
                placeholder="4"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
            />
            </View>
        </View>

      {/* Academic System selector */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Academic System?</Text>
          <GenericPillSelector
            initialValue="Semester"
            onSelectionChange={(val) => console.log(val)}
            options={[
              { label: 'Semester', value: 'Semester' },
              { label: 'Trimester', value: 'Trimester' },
            ]}
          />
        </View>

      {/* Year and Sem */}
        <View style={[{display:'flex',flexDirection:'row',gap:'12',width:'100%',marginBottom:12}]}>
            <View style={{flex:1}}>
            <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Current Yr of Study</Text>
            <TextInput
                style={[logincardstyles.input,{width:'100%'},Typography.presets.subtitle]}
                // value={Year}
                // onChangeText={setYear}
                placeholder="1"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
            />
            </View>

            <View style={{flex:1}}>
            <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Current Semester</Text>
            <TextInput
                style={[logincardstyles.input,{width:'100%'},Typography.presets.subtitle]}
                // value={Sys}
                // onChangeText={setSys}
                placeholder="4"
                placeholderTextColor={"#b1b1b1"}
                keyboardType="default"
                autoCapitalize='words'
            />
            </View>
        </View>

        {/* Phone Number */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Phone Number</Text>
          <TextInput
            style={[logincardstyles.input,Typography.presets.subtitle]}
            // value={password}
            // onChangeText={setPassword}
            placeholder='+254 769 355 433'
            keyboardType='numeric' 
            placeholderTextColor={'#b1b1b1'}          
          />
        </View>
        </View>  



        {/* Next Button */}
        <TouchableOpacity style={[logincardstyles.button,{marginTop:12,marginBottom:0}]}>
          <Text 
          style={[Typography.presets.Slogan,logincardstyles.buttonText]}
          onPress={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
          >Next</Text>
        </TouchableOpacity>
        
                
    </View>

    //     <View style={styles.card}>
    //         <StepIndicator 
    //         steps={STEPS} 
    //         activeStep={activeStep} 
    //         onStepChange={setActiveStep} 
    //         />
    //     </View>

    //     <View style={styles.navContainer}>
    //         <TouchableOpacity 
    //         style={[styles.btn, activeStep === 0 && styles.disabled]}
    //         onPress={() => setActiveStep(prev => Math.max(0, prev - 1))}
    //         disabled={activeStep === 0}
    //         >
    //         <Text style={styles.btnTextBack}>← Back</Text>
    //         </TouchableOpacity>

    //         <TouchableOpacity 
    //         style={[styles.btn, styles.btnPrimary, activeStep === STEPS.length - 1 && styles.disabled]}
    //         onPress={() => setActiveStep(prev => Math.min(STEPS.length - 1, prev + 1))}
    //         disabled={activeStep === STEPS.length - 1}
    //         >
    //         <Text style={styles.btnTextNext}>Next →</Text>
    //         </TouchableOpacity>
    //     </View>
    // </View>
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