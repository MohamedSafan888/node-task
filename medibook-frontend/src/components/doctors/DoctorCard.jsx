import { Card, CardContent, CardActions, Avatar, Box, Typography, Button, Chip, Rating, Stack } from '@mui/material'
import { CalendarMonthOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { getInitials } from '../../utils/helpers'

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate()
  const { t } = useLang()
  const fullName = `Dr. ${doctor.first_name} ${doctor.last_name}`

  return (
    <Card sx={{height:'100%',display:'flex',flexDirection:'column',transition:'transform .2s,box-shadow .2s',
      '&:hover':{transform:'translateY(-4px)',boxShadow:'0 8px 24px rgba(0,0,0,.12)'}}}>
      <CardContent sx={{flex:1}}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{width:56,height:56,bgcolor:'primary.main',fontSize:20}}>
            {doctor.avatar ? <img src={doctor.avatar} alt={fullName} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : getInitials(fullName)}
          </Avatar>
          <Box sx={{flex:1,minWidth:0}}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>{fullName}</Typography>
            <Chip label={doctor.specialty?.name || '—'} size="small" color="primary" variant="outlined" sx={{mt:.5}}/>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <Rating value={doctor.rating || 0} precision={0.5} size="small" readOnly/>
          <Typography variant="body2" color="text.secondary">({doctor.reviews_count || 0})</Typography>
        </Stack>

        {doctor.bio && (
          <Typography variant="body2" color="text.secondary" mt={1.5}
            sx={{display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {doctor.bio}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{px:2,pb:2,gap:1}}>
        <Button fullWidth variant="outlined" size="small" onClick={()=>navigate(`/doctors/${doctor.id}`)}>
          {t('viewProfile')}
        </Button>
        <Button fullWidth variant="contained" size="small" startIcon={<CalendarMonthOutlined/>}
          onClick={()=>navigate(`/doctors/${doctor.id}/book`)}>
          {t('bookAppointment')}
        </Button>
      </CardActions>
    </Card>
  )
}
