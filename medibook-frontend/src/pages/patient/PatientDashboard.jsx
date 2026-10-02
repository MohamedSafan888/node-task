import { useState, useEffect } from 'react'
import { Container, Typography, Box, Tabs, Tab, Button } from '@mui/material'
import { AddOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { appointmentService } from '../../services/appointmentService'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'

export default function PatientDashboard() {
  const { t } = useLang()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  useTitle(t('dashboard'))

  const load = () => {
    setLoading(true)
    appointmentService.getMyAll()
      .then(data => setAppointments(Array.isArray(data) ? data : data.results || []))
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleCancel = async (id) => {
    try {
      await appointmentService.updateStatus(id, 'cancelled')
      enqueueSnackbar('Appointment cancelled', { variant:'info' })
      load()
    } catch { enqueueSnackbar(t('error'), { variant:'error' }) }
  }

  const upcoming = appointments.filter(a => ['pending','approved'].includes(a.status))
  const past     = appointments.filter(a => ['completed','cancelled','rejected'].includes(a.status))
  const shown    = tab === 0 ? upcoming : past

  return (
    <Container maxWidth="lg">
      <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:3,flexWrap:'wrap',gap:2}}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
          </Typography>
          <Typography color="text.secondary">{t('myAppointments')}</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlined/>} onClick={()=>navigate('/doctors')}>
          {t('bookAppointment')}
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{mb:3}}>
        <Tab label={`${t('upcomingAppointments')} (${upcoming.length})`}/>
        <Tab label={`${t('pastAppointments')} (${past.length})`}/>
      </Tabs>

      <AppointmentList appointments={shown} onCancel={tab===0?handleCancel:null} loading={loading}/>
    </Container>
  )
}
