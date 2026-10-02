import { useState } from 'react'
import {
  TextField, Button, IconButton, InputAdornment, Alert, Stack,
  ToggleButtonGroup, ToggleButton, CircularProgress, Typography
} from '@mui/material'
import { Visibility, VisibilityOff, School, Person } from '@mui/icons-material'
import { useLang } from '../../context/LanguageContext'

const INIT = { name: '', email: '', password: '', confirmPassword: '', role: 'Student' }

const validate = (v, t) => {
  const e = {}
  if (!v.name) e.name = t('required')
  if (!v.email) e.email = t('required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = t('invalidEmail')
  if (!v.password) e.password = t('required')
  else if (v.password.length < 6) e.password = t('passwordMin')
  if (!v.confirmPassword) e.confirmPassword = t('required')
  else if (v.password !== v.confirmPassword) e.confirmPassword = 'Passwords do not match'
  return e
}

export default function RegisterForm({ onSubmit, apiError, loading }) {
  const { t } = useLang()
  const [v, setV] = useState(INIT)
  const [errs, setErrs] = useState({})
  const [touched, setTouched] = useState({})
  const [showP, setShowP] = useState(false)
  const [showC, setShowC] = useState(false)

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
    const all = Object.fromEntries(Object.keys(INIT).map((k) => [k, true]))
    setTouched(all)
    const e2 = validate(v, t)
    setErrs(e2)
    if (!Object.keys(e2).length) {
      const { confirmPassword, ...rest } = v
      onSubmit(rest)
    }
  }

  return (
    <Stack component="form" onSubmit={submit} spacing={2.5} noValidate>
      {apiError && <Alert severity="error" sx={{ borderRadius: 2 }}>{apiError}</Alert>}

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {t('role')}
        </Typography>
        <ToggleButtonGroup
          value={v.role}
          exclusive
          onChange={(_, r) => r && setV((p) => ({ ...p, role: r }))}
          fullWidth
          size="small"
          sx={{ '& .MuiToggleButton-root': { borderRadius: '8px !important', py: 1, gap: 1, fontWeight: 600 }, gap: 1 }}
        >
          <ToggleButton value="Student">
            <School fontSize="small" /> Student
          </ToggleButton>
          <ToggleButton value="Instructor">
            <Person fontSize="small" /> Instructor
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <TextField
        label={t('name')}
        name="name"
        value={v.name}
        onChange={change}
        onBlur={blur}
        error={!!errs.name}
        helperText={errs.name}
        fullWidth
        required
      />

      <TextField
        label={t('email')}
        name="email"
        type="email"
        value={v.email}
        onChange={change}
        onBlur={blur}
        error={!!errs.email}
        helperText={errs.email}
        fullWidth
        required
        inputProps={{ dir: 'ltr' }}
      />

      <TextField
        label={t('password')}
        name="password"
        type={showP ? 'text' : 'password'}
        value={v.password}
        onChange={change}
        onBlur={blur}
        error={!!errs.password}
        helperText={errs.password}
        autoComplete="new-password"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowP((p) => !p)} edge="end" size="small">
                {showP ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        label={t('confirmPassword')}
        name="confirmPassword"
        type={showC ? 'text' : 'password'}
        value={v.confirmPassword}
        onChange={change}
        onBlur={blur}
        error={!!errs.confirmPassword}
        helperText={errs.confirmPassword}
        autoComplete="new-password"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowC((p) => !p)} edge="end" size="small">
                {showC ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ height: 48, fontWeight: 700 }}>
        {loading ? <CircularProgress size={22} color="inherit" /> : t('register')}
      </Button>
    </Stack>
  )
}
