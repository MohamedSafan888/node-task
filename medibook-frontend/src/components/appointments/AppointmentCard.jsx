import { Card, CardContent, Box, Typography, Chip, Stack, Button, Avatar } from '@mui/material'
import { CalendarMonthOutlined, AccessTimeOutlined } from '@mui/icons-material'
import { useLang } from '../../context/LanguageContext'
import { formatDate, formatTime, statusColor, getInitials } from '../../utils/helpers'

export default function AppointmentCard({ appointment, onCancel, onReschedule, role = 'patient' }) {
  const { t, lang } = useLang()
  const doc = appointment.doctor || {}
  const pat = appointment.patient || {}
  const displayName = role === 'patient'
    ? `Dr. ${doc.first_name} ${doc.last_name}`
    : `${pat.first_name} ${pat.last_name}`

  return (
    <Card sx={{mb:2}}>
      <CardContent>
        <Stack direction={{xs:'column',sm:'row'}} spacing={2} alignItems={{sm:'center'}} justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{bgcolor:'primary.main',width:44,height:44}}>{getInitials(displayName)}</Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>{displayName}</Typography>
              {role==='patient' && doc.specialty?.name && (
                <Typography variant="caption" color="text.secondary">{doc.specialty.name}</Typography>
              )}
            </Box>
          </Stack>

          <Stack spacing={.5} alignItems={{sm:'flex-end'}}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthOutlined fontSize="small" color="action"/>
              <Typography variant="body2">{formatDate(appointment.scheduled_at, lang)}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeOutlined fontSize="small" color="action"/>
              <Typography variant="body2">{formatTime(appointment.scheduled_at, lang)}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={t(appointment.status)} size="small" color={statusColor(appointment.status)}/>
            {role==='patient' && appointment.status==='pending' && (
              <>
                {onReschedule && <Button size="small" variant="outlined" onClick={()=>onReschedule(appointment)}>{t('reschedule')}</Button>}
                {onCancel && <Button size="small" color="error" onClick={()=>onCancel(appointment.id)}>{t('cancelAppointment')}</Button>}
              </>
            )}
          </Stack>
        </Stack>
        {appointment.notes && (
          <Box mt={1.5} p={1.5} sx={{bgcolor:'background.default',borderRadius:1}}>
            <Typography variant="body2" color="text.secondary">{appointment.notes}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
