import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography, Link, Divider, Stack } from '@mui/material'
import { SchoolRounded } from '@mui/icons-material'
import { useAuth } from '../../hooks/useAuth'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import RegisterForm from '../../components/forms/RegisterForm'
import { defaultRedirect } from '../../utils/rolePermissions'

export default function Register() {
  const { register } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  useTitle(t('register'))

  const handleSubmit = async (values) => {
    setLoading(true)
    setApiError('')
    try {
      const user = await register(values)
      navigate(defaultRedirect(user.role), { replace: true })
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.response?.data?.detail || t('error'))
    } finally {
      setLoading(false)
    }
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
            <Typography variant="h5" fontWeight={700} gutterBottom>{t('welcomeNew')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('hasAccount')}{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>{t('login')}</Link>
            </Typography>
          </Box>

          <Divider />

          <RegisterForm onSubmit={handleSubmit} apiError={apiError} loading={loading} />
        </Stack>
      </CardContent>
    </Card>
  )
}
