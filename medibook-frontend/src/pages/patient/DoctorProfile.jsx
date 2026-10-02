import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Grid, Card, CardContent, Avatar, Typography, Box, Rating, Button,
  Chip, Divider, Skeleton, Stack } from '@mui/material'
import { CalendarMonthOutlined, ArrowBackOutlined } from '@mui/icons-material'
import { doctorService } from '../../services/doctorService'
import AvailabilityTable from '../../components/doctors/AvailabilityTable'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { getInitials } from '../../utils/helpers'

export default function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const [doctor, setDoctor]   = useState(null)
  const [slots, setSlots]     = useState([])
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(true)
  useTitle(doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : 'Doctor profile')

  useEffect(() => {
    doctorService.getById(id)
      .then(setDoctor).catch(()=>{}).finally(()=>setLoading(false))
    doctorService.getAvailability(id)
      .then(setSlots).catch(()=>{}).finally(()=>setSlotsLoading(false))
  }, [id])

  if (loading) return (
    <Container maxWidth="lg" sx={{py:4}}>
      <Skeleton variant="rectangular" height={200} sx={{borderRadius:2,mb:3}}/>
      <Skeleton variant="rectangular" height={300} sx={{borderRadius:2}}/>
    </Container>
  )

  if (!doctor) return (
    <Container sx={{py:8,textAlign:'center'}}>
      <Typography>Doctor not found.</Typography>
      <Button onClick={()=>navigate('/doctors')} sx={{mt:2}}>Browse doctors</Button>
    </Container>
  )

  const fullName = `Dr. ${doctor.first_name} ${doctor.last_name}`
  return (
    <Container maxWidth="lg" sx={{py:4}}>
      <Button startIcon={<ArrowBackOutlined/>} onClick={()=>navigate(-1)} sx={{mb:2}}>{t('back')}</Button>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{textAlign:'center',py:4}}>
              <Avatar sx={{width:96,height:96,fontSize:32,bgcolor:'primary.main',mx:'auto',mb:2}}>
                {getInitials(fullName)}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{fullName}</Typography>
              {doctor.specialty && <Chip label={doctor.specialty.name} color="primary" sx={{mt:1}}/>}
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={2}>
                <Rating value={doctor.rating||0} precision={0.5} readOnly size="small"/>
                <Typography variant="body2" color="text.secondary">({doctor.reviews_count||0})</Typography>
              </Stack>
              {doctor.bio && (
                <Typography variant="body2" color="text.secondary" mt={2} textAlign="left">
                  {doctor.bio}
                </Typography>
              )}
              <Divider sx={{my:2}}/>
              <Button fullWidth variant="contained" size="large" startIcon={<CalendarMonthOutlined/>}
                onClick={()=>navigate(`/doctors/${id}/book`)}>
                {t('bookAppointment')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Available slots</Typography>
              <AvailabilityTable slots={slots} loading={slotsLoading}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
