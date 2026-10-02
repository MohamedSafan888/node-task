import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'

const ThemeContext = createContext(null)

const getTokens = (mode) => ({
  palette: {
    mode,
    primary:    { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8', contrastText: '#fff' },
    secondary:  { main: '#0EA5E9', contrastText: '#fff' },
    error:      { main: '#EF4444' },
    warning:    { main: '#F59E0B' },
    success:    { main: '#10B981' },
    background: { default: mode === 'dark' ? '#0F172A' : '#F8FAFC', paper: mode === 'dark' ? '#1E293B' : '#FFFFFF' },
    text:       { primary: mode === 'dark' ? '#F1F5F9' : '#0F172A', secondary: mode === 'dark' ? '#94A3B8' : '#475569' },
    divider:    mode === 'dark' ? '#334155' : '#E2E8F0',
  },
  typography: {
    fontFamily: "'Inter','Roboto','Helvetica Neue',Arial,sans-serif",
    h1:{fontWeight:700},h2:{fontWeight:700},h3:{fontWeight:600},
    h4:{fontWeight:600},h5:{fontWeight:600},h6:{fontWeight:600},
    button:{textTransform:'none',fontWeight:500},
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton:    { styleOverrides: { root:{ borderRadius:8, paddingInline:20 }, contained:{ boxShadow:'none','&:hover':{boxShadow:'none'} } } },
    MuiCard:      { styleOverrides: { root:{ borderRadius:12, boxShadow: mode==='dark'?'0 1px 3px rgba(0,0,0,.4)':'0 1px 3px rgba(0,0,0,.08)' } } },
    MuiTextField: { styleOverrides: { root:{ '& .MuiOutlinedInput-root':{ borderRadius:8 } } } },
    MuiChip:      { styleOverrides: { root:{ borderRadius:6 } } },
    MuiPaper:     { styleOverrides: { root:{ backgroundImage:'none' } } },
  },
})

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const s = localStorage.getItem('themeMode')
    return s==='dark'||s==='light' ? s : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => { localStorage.setItem('themeMode', mode) }, [mode])
  const toggleTheme = () => setMode(p => p==='light'?'dark':'light')
  const theme = useMemo(() => createTheme(getTokens(mode)), [mode])
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}><CssBaseline />{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be inside <ThemeProvider>')
  return ctx
}
