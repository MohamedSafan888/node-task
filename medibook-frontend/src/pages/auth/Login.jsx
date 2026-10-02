import { useState } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Link, Divider, Stack, Button, Chip } from '@mui/material'
import { SchoolRounded, Person, SupervisorAccount } from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import LoginForm from '../../components/forms/LoginForm'
import { defaultRedirect } from '../../utils/rolePermissions'

export default function Login() {
  const { login } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [formCredentials, setFormCredentials] = useState(null)

  useTitle(t('login'))
  const from = location.state?.from

  const handleSubmit = async (values) => {
    setLoading(true)
    setApiError('')
    try {
      const user = await login(values)
      navigate(from || defaultRedirect(user.role), { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.response?.data?.detail || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const fillQuickLogin = (email, password) => {
    handleSubmit({ email, password })
  }

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <SchoolRounded fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight={800} color="primary">CourseHub</Typography>
          </Stack>

          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>{t('welcomeBack')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('noAccount')}{' '}
              <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>{t('register')}</Link>
            </Typography>
          </Box>

          <Divider />

          <LoginForm onSubmit={handleSubmit} apiError={apiError} loading={loading} initialValues={formCredentials} />

          {/* Quick Demo Test Buttons */}
          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" sx={{ mb: 1.5 }}>
              ⚡ QUICK DEMO LOGINS (SEED DATA)
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<SupervisorAccount />}
                onClick={() => fillQuickLogin('sarah@example.com', 'password123')}
                disabled={loading}
              >
                Instructor
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<Person />}
                onClick={() => fillQuickLogin('omar@example.com', 'password123')}
                disabled={loading}
              >
                Student
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
