import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, Typography, Box, Button, MenuItem, TextField,
  Alert, CircularProgress, Stack, Divider, Avatar } from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import { doctorService } from '../../services/doctorService'
import { appointmentService } from '../../services/appointmentService'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useSnackbar } from 'notistack'
import { getInitials } from '../../utils/helpers'

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const { enqueueSnackbar } = useSnackbar()
  const [doctor, setDoctor]   = useState(null)
  const [slots, setSlots]     = useState([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')
  useTitle(t('bookAppointment'))

  useEffect(() => {
    Promise.all([
      doctorService.getById(id),
      doctorService.getAvailability(id),
    ]).then(([doc, avail]) => {
      setDoctor(doc)
      setSlots((avail || []).filter(s => s.is_available))
    }).catch(()=>{}).finally(()=>setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) { setError('Please select a time slot'); return }
    setSubmitting(true); setError('')
    try {
      await appointmentService.book({ doctor_id: id, slot_id: selected })
      enqueueSnackbar(t('bookingSuccess'), { variant:'success' })
      navigate('/patient/dashboard')
    } catch(err) {
      setError(err?.response?.data?.detail || t('bookingError'))
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <Container maxWidth="sm" sx={{py:6,textAlign:'center'}}><CircularProgress/></Container>
  )

  const fullName = doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : ''
  return (
    <Container maxWidth="sm" sx={{py:4}}>
      <Button startIcon={<ArrowBackOutlined/>} onClick={()=>navigate(-1)} sx={{mb:2}}>{t('back')}</Button>
      <Card elevation={0} sx={{border:'1px solid',borderColor:'divider'}}>
        <CardContent sx={{p:{xs:3,sm:4}}}>
          <Typography variant="h5" fontWeight={700} gutterBottom>{t('bookAppointment')}</Typography>

          {doctor && (
            <Stack direction="row" spacing={2} alignItems="center" mb={3} p={2}
              sx={{bgcolor:'background.default',borderRadius:2}}>
              <Avatar sx={{bgcolor:'primary.main'}}>{getInitials(fullName)}</Avatar>
              <Box>
                <Typography fontWeight={600}>{fullName}</Typography>
                {doctor.specialty && <Typography variant="body2" color="text.secondary">{doctor.specialty.name}</Typography>}
              </Box>
            </Stack>
          )}

          <Divider sx={{mb:3}}/>

          {error && <Alert severity="error" sx={{mb:2,borderRadius:2}}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField select label={t('selectTime')} value={selected}
              onChange={e=>setSelected(e.target.value)} fullWidth required sx={{mb:3}}>
              {slots.length === 0
                ? <MenuItem disabled>No available slots</MenuItem>
                : slots.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.day_name || s.day} — {s.start_time} to {s.end_time}
                  </MenuItem>
                ))
              }
            </TextField>
            <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting||!slots.length} sx={{height:48}}>
              {submitting ? <CircularProgress size={22} color="inherit"/> : t('confirmBooking')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
