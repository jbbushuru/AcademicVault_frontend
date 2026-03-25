// src/app/index.tsx

import { SafeAreaProvider } from "react-native-safe-area-context";

import LoadingScreen from "@/src/screens/Loader";

export default function Index() {


  return (
    <SafeAreaProvider>
      <LoadingScreen/>
    </SafeAreaProvider>    
  );
}
