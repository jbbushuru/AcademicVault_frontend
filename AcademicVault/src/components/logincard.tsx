//src/components/logincard.tsx

import React, { useState } from 'react';
import { Typography } from '../styles';
import { Eye, EyeOff } from 'lucide-react-native';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator
} from 'react-native';
import { uselogincardstyles } from '../styles';
import BASE_url from '../constants/baseURL';

// Use the appropriate base URL for the backend API depending on the platform
const BASE_URL = BASE_url;

interface LoginCardProps {
  onSwitchToSignup?: () => void;
  onLoginSuccess?: (data: any) => void;
}

const LoginCard = ({ onSwitchToSignup, onLoginSuccess }: LoginCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const logincardstyles = uselogincardstyles();
  
  const handleLogin = async () => {
    setErrorMessage('');
    
    // 1. Basic Input Validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 2. Database Connection (API Call)
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrorMessage(data.message || data.error || 'Login failed. Please try again.');
        return;
      }
      
      // On Success
      if (onLoginSuccess) {
        onLoginSuccess(data);
      } else {
        // Fallback or display a success message if no callback is provided
        console.log("Login successful! Token:", data.token);
      }
      
    } catch (error) {
      console.error(error);
      setErrorMessage('Network error. Unable to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <View style={[logincardstyles.card]}>
        <Text style={[logincardstyles.title,Typography.presets.Slogan]}>Log in</Text>

        {/* Error Display */}
        {errorMessage ? (
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{errorMessage}</Text>
        ) : null}

        {/* Email Field */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Email Address</Text>
          <TextInput
            style={[logincardstyles.input,Typography.presets.subtitle]}
            value={email}
            onChangeText={(text) => { setEmail(text); setErrorMessage(''); }}
            placeholder="you@gmail.com"
            placeholderTextColor={"#b1b1b1"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Password</Text>
          <View style={{ position: 'relative', width: '100%' }}>
            <TextInput
              style={[logincardstyles.input,Typography.presets.subtitle, { paddingRight: 40 }]}
              value={password}
              onChangeText={(text) => { setPassword(text); setErrorMessage(''); }}
              placeholder='••••••••'
              placeholderTextColor={"#b1b1b1"}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={{ position: 'absolute', right: 15, top: 0, bottom: 0, justifyContent: 'center' }} 
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} color="#b1b1b1" /> : <Eye size={20} color="#b1b1b1" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity>
          <Text style={logincardstyles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity 
          style={[logincardstyles.button, isLoading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[Typography.presets.Slogan,logincardstyles.buttonText]}>Log In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={logincardstyles.footer}>
          <Text style={logincardstyles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSwitchToSignup}>
            <Text style={[logincardstyles.footerText, logincardstyles.signUpLink]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default LoginCard;