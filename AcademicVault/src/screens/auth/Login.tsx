// src/screens/Login.tsx

import LoginCard from "@/src/components/logincard";
import { SafeAreaView } from "react-native-safe-area-context";
import useappstyles from "@/src/styles";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "@/src/context/AuthContext";

interface LoginProps {
    onSwitchToSignup?: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps){
    const styles = useappstyles();
    const { login } = useAuth();

    return(
        <SafeAreaView style={styles.authcontainer}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            >
            <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            >
            <LoginCard 
              onSwitchToSignup={onSwitchToSignup} 
              onLoginSuccess={(data) => login(data.token, data.profile)} 
            />    
            </ScrollView>
            </KeyboardAvoidingView>           
        </SafeAreaView>
    );
}
