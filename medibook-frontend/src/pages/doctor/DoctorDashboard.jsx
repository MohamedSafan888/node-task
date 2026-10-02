import { useState, useEffect } from 'react'
import { Container, Typography, Grid, Card, CardContent, Box, Tabs, Tab, Chip, Avatar, Stack } from '@mui/material'
import { PeopleOutlined, CalendarMonthOutlined, CheckCircleOutlined } from '@mui/icons-material'
import { doctorService } from '../../services/doctorService'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useAuth } from '../../hooks/useAuth'
import { useSnackbar } from 'notistack'
import { appointmentService } from '../../services/appointmentService'

export default function DoctorDashboard() {
  const { t } = useLang()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  useTitle(t('dashboard'))

  const load = () => {
    setLoading(true)
    doctorService.getAppointments()
      .then(d => setAppointments(Array.isArray(d) ? d : d.results || []))
      .catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load,[])

  const handleStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status)
      enqueueSnackbar(`Appointment ${status}`, { variant:'success' })
      load()
    } catch { enqueueSnackbar(t('error'), { variant:'error' }) }
  }

  const upcoming = appointments.filter(a=>['pending','approved'].includes(a.status))
  const past     = appointments.filter(a=>['completed','cancelled','rejected'].includes(a.status))
  const shown    = tab===0 ? upcoming : past

  const stats = [
    { label:'Total patients', value: appointments.length, icon:<PeopleOutlined/>, color:'primary' },
    { label:'Upcoming',       value: upcoming.length,    icon:<CalendarMonthOutlined/>, color:'warning' },
    { label:'Completed',      value: appointments.filter(a=>a.status==='completed').length, icon:<CheckCircleOutlined/>, color:'success' },
  ]

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={700} mb={3}>
        Welcome, Dr. {user?.first_name}
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={4}>
        {stats.map((s,i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                  </Box>
                  <Avatar sx={{bgcolor:`${s.color}.main`,width:48,height:48}}>{s.icon}</Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{mb:3}}>
        <Tab label={`${t('upcomingAppointments')} (${upcoming.length})`}/>
        <Tab label={`${t('pastAppointments')} (${past.length})`}/>
      </Tabs>

      {/* Appointments with approve/reject for doctor */}
      {shown.map(a => (
        <Card key={a.id} sx={{mb:2}}>
          <CardContent>
            <Stack direction={{xs:'column',sm:'row'}} justifyContent="space-between" alignItems={{sm:'center'}} spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{bgcolor:'primary.main'}}>{a.patient?.first_name?.[0]}</Avatar>
                <Box>
                  <Typography fontWeight={600}>{a.patient?.first_name} {a.patient?.last_name}</Typography>
                  <Typography variant="body2" color="text.secondary">{new Date(a.scheduled_at).toLocaleString()}</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={t(a.status)} size="small" color={a.status==='approved'?'success':a.status==='rejected'?'error':'default'}/>
                {a.status==='pending' && tab===0 && (
                  <>
                    <Chip label="Approve" size="small" color="success" variant="outlined" clickable onClick={()=>handleStatus(a.id,'approved')}/>
                    <Chip label="Reject"  size="small" color="error"   variant="outlined" clickable onClick={()=>handleStatus(a.id,'rejected')}/>
                  </>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
      {shown.length===0 && !loading && (
        <Box sx={{textAlign:'center',py:6}}>
          <Typography color="text.secondary">{t('noAppointments')}</Typography>
        </Box>
      )}
    </Container>
  )
}
