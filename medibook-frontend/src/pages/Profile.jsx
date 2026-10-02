import { useState } from 'react'
import { Container, Typography, Box } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../context/LanguageContext'
import { authService } from '../services/authService'
import ProfileForm from '../components/forms/ProfileForm'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { t } = useLang()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
  useTitle(t('profile'))

  const handleSubmit = async (values) => {
    setLoading(true); setApiError(''); setSuccess(false)
    try {
      const updated = await authService.updateProfile(values)
      updateUser(updated); setSuccess(true)
    } catch(err) {
      setApiError(err?.response?.data?.detail || t('error'))
    } finally { setLoading(false) }
  }

  return (
    <Container maxWidth="sm" sx={{py:6}}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>{t('profile')}</Typography>
        <Typography variant="body2" color="text.secondary">Manage your personal information</Typography>
      </Box>
      <ProfileForm user={user} onSubmit={handleSubmit} apiError={apiError} loading={loading} success={success}/>
    </Container>
  )
}
