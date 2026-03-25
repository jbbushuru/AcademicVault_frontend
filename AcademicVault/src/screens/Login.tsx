// src/screens/Login.tsx

import LoginCard from "../components/logincard";
import { SafeAreaView } from "react-native-safe-area-context";
import useappstyles from "../styles";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function Login(){
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
            <LoginCard/>    
            </ScrollView>
                
            </KeyboardAvoidingView>           
        </SafeAreaView>
    );
}
