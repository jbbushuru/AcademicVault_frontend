import { createContext, useContext, useState, ReactNode } from "react";
import Colors from "../constants/theme";

type ThemeType = 'light' | 'dark';
type ColorPalette = typeof Colors.light;

interface ThemeContextInterface {
    theme: ThemeType;
    colors:ColorPalette;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextInterface | undefined>(undefined);

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [theme, setTheme] = useState<ThemeType>('light');
    const colors = theme === 'light' ? Colors.light : Colors.dark;
    return (
        <ThemeContext.Provider value={{theme, colors, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

