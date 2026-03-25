//src/components/logincard.tsx

import React, { useState } from 'react';
import { Typography } from '../styles';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
} from 'react-native';
import { uselogincardtyles } from '../styles';


const LoginCard = () => {
  const [password, setPassword] = useState('123456');
  const logincardstyles = uselogincardtyles();
  
  return (
    
      <View style={[logincardstyles.card]}>
        <Text style={[logincardstyles.title,Typography.presets.Slogan]}>Log in</Text>

        {/* Email Field */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Email Address</Text>
          <TextInput
            style={logincardstyles.input}
            // value={email}
            // onChangeText={setEmail}
            placeholder="you@gmail.com"
            placeholderTextColor={"#717182"}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
        <View style={logincardstyles.inputGroup}>
          <Text style={[logincardstyles.label,Typography.presets.subtitle]}>Password</Text>
          <TextInput
            style={logincardstyles.input}
            // value={password}
            // onChangeText={setPassword}
            placeholder='••••••••'
            secureTextEntry
            
          />
        </View>

        <TouchableOpacity>
          <Text style={logincardstyles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Log In Button */}
        <TouchableOpacity style={logincardstyles.button}>
          <Text style={[Typography.presets.Slogan,logincardstyles.buttonText]}>Log In</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={logincardstyles.footer}>
          <Text style={logincardstyles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={[logincardstyles.footerText, logincardstyles.signUpLink]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};


export default LoginCard;