import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, LoveYaLikeASister_400Regular } from '@expo-google-fonts/love-ya-like-a-sister';
import { IndieFlower_400Regular } from '@expo-google-fonts/indie-flower';
import { Inter_400Regular} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from "@/app/screens/Loader";
import Login from "./screens/Login";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'LoveYa': LoveYaLikeASister_400Regular,
    'Indie': IndieFlower_400Regular,
    'Inter': Inter_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <Login/>
    </SafeAreaProvider>    
  );
}
