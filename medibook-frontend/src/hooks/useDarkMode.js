import { useThemeContext } from '../context/ThemeContext'
export function useDarkMode() {
  const { mode, toggleTheme } = useThemeContext()
  return { isDark: mode === 'dark', toggleTheme }
}
