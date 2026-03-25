// src/styles.ts

import { Colors, ThemeColors } from "./constants/theme";
import { StyleSheet,  Dimensions, useColorScheme} from "react-native";
const { width } = Dimensions.get('window');

export const getThemeColors = (scheme: 'light' | 'dark' | null | undefined) => {
    return Colors[scheme ?? 'light'];
};
export const theme = () => {
    const scheme = useColorScheme();
    return getThemeColors(scheme);
};

export const Typography = {
  fonts: {
    title: 'LoveYa',
    subtitle: 'Indie',
    body: 'Inter',
    bodyBold: 'InterBold',
  },

  presets: StyleSheet.create({
    Headertitle: {
      fontFamily: 'LoveYa',
      fontSize:20,
    },
    Slogan: {
      fontFamily: 'LoveYa',
      fontSize:28,
    },    
    subtitle: {
      fontFamily: 'Indie',
      fontSize: 14,
    },
    body: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: 20,
    },
  }),
};

//general styles for entire application
const createappstyles = (themeColors:ThemeColors) => StyleSheet.create({    
  authcontainer: {
    flex: 1,
    backgroundColor: themeColors.primary,
  },
  scrollContent: {
    flexGrow: 1, // Important: allows the content to fill the screen
    justifyContent: 'center', // Keeps the card centered when keyboard is off
    alignItems:'center'
  }
})
const useappstyles = () => {
  const scheme = useColorScheme();
  return createappstyles(getThemeColors(scheme));
};

//styles for app/screens/Loader.tsx
export const loaderstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  bannerContainer: {
    borderWidth: 1,
    borderColor: '#9072B060',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#D9C2F040',
    marginBottom: 20,
    transform: [{ rotate: '-5deg' }],
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  loaderContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7D667E',
    fontSize: 14,
    fontWeight: '500',
  },
  // Decorative Circles Styling
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#D4B4CE',
  },
  circleTopRight: {
    width: 60,
    height: 60,
    top: 30,
    right: -25,
    backgroundColor: '#e89ac8c0',
  },
  circleTopLeft: {
    width: 40,
    height: 40,
    top: 110,
    left: 0,
    opacity: 0.5,
  },
  circleMiddleLeft: {
    width: 30,
    height: 30,
    top: '40%',
    left: 60,
    backgroundColor: '#9B7B95',
  },
  circleBottomRight: {
    width: 64,
    height: 64,
    bottom: '43%',
    right: 30,
    backgroundColor: '#e89ac878',
  }
});

//styles for app/components/ui/logincard.tsx
const createlogincardstyles = (themeColors:ThemeColors) => StyleSheet.create({
  card: {
    width: '90%',
    backgroundColor: themeColors.background ,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    elevation:30,
  },
  title: {
    marginBottom:24,
    alignSelf: 'stretch',
    color: '#000',
    textAlign:'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color:themeColors.label,
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: themeColors.inputbg, // Light blue tint from image
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth:1.73,
    borderColor:themeColors.inputstroke,
    color: '#666',
  },
  inputfocused:{
    borderColor:themeColors.inputfocused,
  },
  forgotText: {
    color: themeColors.primary, // Muted purple
    fontSize: 14,
    fontWeight:600,
    marginBottom: 15,
  },
  button: {
    backgroundColor: themeColors.button, // Darker dusty purple
    width: '100%',
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  altbutton: {
    backgroundColor: themeColors.altbutton.bg, // Darker dusty purple
    width: '100%',
    height: 43,
    borderWidth:2,
    borderColor:themeColors.altbutton.stroke,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
  },
  footerText: {
    color: themeColors.label,
    fontSize: 14,
  },
  signUpLink: {
    color: themeColors.primary,
    fontWeight: '600',
  },
});
export const uselogincardstyles = () => {
    const scheme = useColorScheme();
    return createlogincardstyles(getThemeColors(scheme));
};


const createdashboardstyles = (themeColors:ThemeColors) => StyleSheet.create ({
  
})


export default useappstyles;