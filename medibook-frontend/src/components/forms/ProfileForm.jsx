import { useState, useEffect } from 'react'
import { TextField, Button, Stack, Alert, CircularProgress, Avatar, Box, Typography, Chip } from '@mui/material'
import { useLang } from '../../context/LanguageContext'
import { getInitials } from '../../utils/helpers'

export default function ProfileForm({ user, onSubmit, apiError, loading, success }) {
  const { t } = useLang()
  const [v, setV] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  })
  const [errs, setErrs] = useState({})

  useEffect(() => {
    if (user) {
      setV({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  const change = (e) => {
    const { name, value } = e.target
    setV((p) => ({ ...p, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!v.name.trim()) {
      setErrs({ name: t('required') })
      return
    }
    setErrs({})
    onSubmit(v)
  }

  return (
    <Stack component="form" onSubmit={submit} spacing={3} noValidate>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={v.avatar || user?.avatar} sx={{ width: 70, height: 70, fontSize: 24, bgcolor: 'primary.main' }}>
          {getInitials(user?.name)}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {user?.name || '—'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
          <Chip label={user?.role} size="small" color="primary" sx={{ mt: 0.5, fontWeight: 600 }} />
        </Box>
      </Box>

      {apiError && <Alert severity="error" sx={{ borderRadius: 2 }}>{apiError}</Alert>}
      {success && <Alert severity="success" sx={{ borderRadius: 2 }}>Profile updated successfully!</Alert>}

      <TextField
        label={t('name')}
        name="name"
        value={v.name}
        onChange={change}
        error={!!errs.name}
        helperText={errs.name}
        fullWidth
        required
      />

      <TextField
        label="Bio / Headline"
        name="bio"
        value={v.bio}
        onChange={change}
        multiline
        rows={3}
        fullWidth
        placeholder="Tell us a little about your experience or learning interests..."
      />

      <TextField
        label="Avatar Image URL"
        name="avatar"
        value={v.avatar}
        onChange={change}
        fullWidth
        placeholder="https://images.unsplash.com/..."
      />

      <TextField
        label={t('email')}
        value={user?.email || ''}
        fullWidth
        disabled
        helperText="Email cannot be changed"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ height: 48, alignSelf: 'flex-start', px: 4, fontWeight: 700 }}
      >
        {loading ? <CircularProgress size={22} color="inherit" /> : t('save')}
      </Button>
    </Stack>
  )
}
