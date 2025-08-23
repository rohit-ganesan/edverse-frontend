import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = (): void => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Only save to localStorage if we're in the browser
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('edverse-theme', newTheme);
        } catch (error) {
          console.warn('Error saving theme to localStorage:', error);
        }
      }
      return newTheme;
    });
  };

  const isDark = theme === 'dark';

  // Initialize theme from localStorage, default to light
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('edverse-theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme);
          return;
        }
        // Always default to light theme (ignore system preference)
        setTheme('light');
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
        // Fallback to light theme on error
        setTheme('light');
      }
    }
  }, []);

  useEffect(() => {
    // Only manipulate DOM if we're in the browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        // Apply theme to document root
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector(
          'meta[name="theme-color"]'
        );
        if (metaThemeColor) {
          metaThemeColor.setAttribute(
            'content',
            theme === 'dark' ? '#1f2937' : '#ffffff'
          );
        }
      } catch (error) {
        console.warn('Error applying theme to DOM:', error);
      }
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
