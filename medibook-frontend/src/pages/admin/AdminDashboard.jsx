import { useState, useEffect } from 'react'
import { Container, Typography, Grid, Card, CardContent, Box, Stack, Avatar } from '@mui/material'
import { PeopleOutlined, LocalHospitalOutlined, CalendarMonthOutlined, CheckCircleOutlined } from '@mui/icons-material'
import { adminService } from '../../services/adminService'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { ListSkeleton } from '../../components/common/Skeleton'

export default function AdminDashboard() {
  const { t } = useLang()
  const [stats, setStats] = useState({ users:0, doctors:0, appointments:0, approved:0 })
  const [loading, setLoading] = useState(true)
  useTitle(t('dashboard') + ' — Admin')

  useEffect(()=>{
    Promise.all([adminService.getUsers(), adminService.getAllAppointments()])
      .then(([users, appts])=>{
        const arr = Array.isArray(users) ? users : users.results || []
        const apps = Array.isArray(appts) ? appts : appts.results || []
        setStats({
          users: arr.length,
          doctors: arr.filter(u=>u.role==='doctor').length,
          appointments: apps.length,
          approved: arr.filter(u=>u.is_approved).length,
        })
      }).catch(()=>{}).finally(()=>setLoading(false))
  },[])

  const cards = [
    { label:'Total users',     value:stats.users,        icon:<PeopleOutlined/>,         color:'primary' },
    { label:'Doctors',         value:stats.doctors,      icon:<LocalHospitalOutlined/>,   color:'secondary' },
    { label:'Appointments',    value:stats.appointments, icon:<CalendarMonthOutlined/>,   color:'warning' },
    { label:'Approved users',  value:stats.approved,     icon:<CheckCircleOutlined/>,     color:'success' },
  ]

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={700} mb={3}>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {cards.map((c,i)=>(
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">{c.label}</Typography>
                    <Typography variant="h4" fontWeight={700}>{loading ? '…' : c.value}</Typography>
                  </Box>
                  <Avatar sx={{bgcolor:`${c.color}.main`,width:48,height:48}}>{c.icon}</Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
