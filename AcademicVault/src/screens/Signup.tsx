// src/app/Signup.tsx

import { SafeAreaView } from "react-native-safe-area-context";
import useappstyles from "../styles";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import SignUpCard from "../components/signupcard";

export default function SignUp(){
    const styles = useappstyles();
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
            <SignUpCard/>    
            </ScrollView>
                
            </KeyboardAvoidingView>           
        </SafeAreaView>
    );
}
