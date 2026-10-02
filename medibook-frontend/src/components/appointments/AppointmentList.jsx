import { Box, Typography } from '@mui/material'
import { EventBusyOutlined } from '@mui/icons-material'
import AppointmentCard from './AppointmentCard'
import { useLang } from '../../context/LanguageContext'

export default function AppointmentList({ appointments = [], onCancel, onReschedule, role='patient', loading }) {
  const { t } = useLang()
  if (!appointments.length && !loading) return (
    <Box sx={{textAlign:'center',py:6}}>
      <EventBusyOutlined sx={{fontSize:56,color:'text.disabled',mb:1}}/>
      <Typography color="text.secondary">{t('noAppointments')}</Typography>
    </Box>
  )
  return (
    <Box>
      {appointments.map(a => (
        <AppointmentCard key={a.id} appointment={a} onCancel={onCancel} onReschedule={onReschedule} role={role}/>
      ))}
    </Box>
  )
}
