// src/app/Signup.tsx

import { SafeAreaView } from "react-native-safe-area-context";
import useappstyles from "@/src/styles";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import SignUpCard from "@/src/components/signupcard";
import { useAuth } from "@/src/context/AuthContext";

interface SignUpProps {
    onSwitchToLogin?: () => void;
}

export default function SignUp({ onSwitchToLogin }: SignUpProps){
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
            <SignUpCard 
              onSwitchToLogin={onSwitchToLogin}
              onSignupSuccess={(data) => login(data.token, data.profile)}
            />    
            </ScrollView>
            </KeyboardAvoidingView>           
        </SafeAreaView>
    );
}
