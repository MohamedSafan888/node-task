import { useState } from 'react'
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem,
  Tooltip, Chip
} from '@mui/material'
import {
  SchoolRounded, DarkModeOutlined, LightModeOutlined,
  AccountCircleOutlined, LogoutOutlined, DashboardOutlined
} from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLang } from '../../context/LanguageContext'
import { defaultRedirect } from '../../utils/rolePermissions'
import { getInitials } from '../../utils/helpers'

export default function Navbar({ dashboard = false }) {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, role } = useAuth()
  const { isDark, toggleTheme } = useDarkMode()
  const { t, lang, toggleLang } = useLang()
  const [anchor, setAnchor] = useState(null)

  const handleLogout = () => {
    setAnchor(null)
    logout()
    navigate('/login')
  }

  const isInstructor = role === 'Instructor'
  const isStudent = role === 'Student'

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Brand Logo */}
        <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: 1
            }}
          >
            <SchoolRounded sx={{ fontSize: 22 }} />
          </Box>
          <Typography variant="h6" fontWeight={800} color="primary" sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: -0.5 }}>
            CourseHub
          </Typography>
        </RouterLink>

        <Box sx={{ flex: 1 }} />

        {/* Navigation Links */}
        <Button component={RouterLink} to="/courses" color="inherit" sx={{ fontWeight: 600 }}>
          {t('courses')}
        </Button>

        {isAuthenticated && isStudent && (
          <Button component={RouterLink} to="/student/dashboard" color="inherit" sx={{ fontWeight: 600 }}>
            {t('myCourses')}
          </Button>
        )}

        {isAuthenticated && isInstructor && (
          <Button component={RouterLink} to="/instructor/dashboard" color="secondary" variant="outlined" size="small" sx={{ fontWeight: 600 }}>
            {t('dashboard')}
          </Button>
        )}

        {/* Dark mode */}
        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleTheme} size="small">
            {isDark ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Language */}
        <Button size="small" variant="outlined" onClick={toggleLang} sx={{ minWidth: 0, px: 1.5, fontSize: 12 }}>
          {lang === 'en' ? 'عربي' : 'EN'}
        </Button>

        {/* User menu or Login */}
        {isAuthenticated ? (
          <>
            <Tooltip title={user?.name || 'Account'}>
              <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small" sx={{ p: 0.5 }}>
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ sx: { minWidth: 200, mt: 1, p: 1 } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {user?.email}
                </Typography>
                <Chip
                  label={role}
                  size="small"
                  color={isInstructor ? 'secondary' : 'primary'}
                  sx={{ mt: 0.5, height: 20, fontSize: 11 }}
                />
              </Box>

              <MenuItem onClick={() => { setAnchor(null); navigate(defaultRedirect(role)) }}>
                <DashboardOutlined fontSize="small" sx={{ mr: 1.5 }} />
                {t('dashboard')}
              </MenuItem>

              <MenuItem onClick={() => { setAnchor(null); navigate('/profile') }}>
                <AccountCircleOutlined fontSize="small" sx={{ mr: 1.5 }} />
                {t('profile')}
              </MenuItem>

              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutOutlined fontSize="small" sx={{ mr: 1.5 }} />
                {t('logout')}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={RouterLink} to="/login" variant="outlined" size="small">
              {t('login')}
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" size="small">
              {t('register')}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
