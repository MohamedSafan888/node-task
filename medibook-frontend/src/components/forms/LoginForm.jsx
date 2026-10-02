import { useState } from 'react'
import { TextField, Button, IconButton, InputAdornment, Alert, Stack, CircularProgress } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useLang } from '../../context/LanguageContext'

const validate = (v, t) => {
  const e = {}
  if (!v.email) e.email = t('required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = t('invalidEmail')
  if (!v.password) e.password = t('required')
  else if (v.password.length < 6) e.password = t('passwordMin')
  return e
}

export default function LoginForm({ onSubmit, apiError, loading, initialValues }) {
  const { t } = useLang()
  const [v, setV] = useState(initialValues || { email: '', password: '' })
  const [errs, setErrs] = useState({})
  const [touched, setTouched] = useState({})
  const [show, setShow] = useState(false)

  // Keep synced if initialValues changes
  const change = (e) => {
    const { name, value } = e.target
    setV((p) => ({ ...p, [name]: value }))
    if (touched[name]) setErrs(validate({ ...v, [name]: value }, t))
  }

  const blur = (e) => {
    const { name } = e.target
    setTouched((p) => ({ ...p, [name]: true }))
    setErrs(validate(v, t))
  }

  const submit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const e2 = validate(v, t)
    setErrs(e2)
    if (!Object.keys(e2).length) onSubmit(v)
  }

  return (
    <Stack component="form" onSubmit={submit} spacing={2.5} noValidate>
      {apiError && <Alert severity="error" sx={{ borderRadius: 2 }}>{apiError}</Alert>}
      <TextField
        label={t('email')}
        name="email"
        type="email"
        value={v.email}
        onChange={change}
        onBlur={blur}
        error={!!errs.email}
        helperText={errs.email}
        autoComplete="email"
        fullWidth
        required
        inputProps={{ dir: 'ltr' }}
      />
      <TextField
        label={t('password')}
        name="password"
        type={show ? 'text' : 'password'}
        value={v.password}
        onChange={change}
        onBlur={blur}
        error={!!errs.password}
        helperText={errs.password}
        autoComplete="current-password"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShow((p) => !p)} edge="end" size="small">
                {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ height: 48, fontWeight: 700 }}>
        {loading ? <CircularProgress size={22} color="inherit" /> : t('login')}
      </Button>
    </Stack>
  )
}
