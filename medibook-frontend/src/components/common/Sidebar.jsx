import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider } from '@mui/material'
import { DashboardOutlined, CalendarMonthOutlined, PeopleOutlined,
  SettingsOutlined, ScheduleOutlined, LocalHospitalOutlined } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../context/LanguageContext'
import { getInitials } from '../../utils/helpers'

const NAV = {
  patient: [
    { label:'dashboard',    icon:<DashboardOutlined/>,     path:'/patient/dashboard' },
    { label:'findDoctors',  icon:<LocalHospitalOutlined/>, path:'/doctors' },
    { label:'myAppointments',icon:<CalendarMonthOutlined/>,path:'/patient/dashboard' },
  ],
  doctor: [
    { label:'dashboard',          icon:<DashboardOutlined/>,   path:'/doctor/dashboard' },
    { label:'manageAvailability', icon:<ScheduleOutlined/>,    path:'/doctor/schedule' },
  ],
  admin: [
    { label:'dashboard',   icon:<DashboardOutlined/>,  path:'/admin/dashboard' },
    { label:'allUsers',    icon:<PeopleOutlined/>,     path:'/admin/users' },
    { label:'specialties', icon:<SettingsOutlined/>,   path:'/admin/config' },
  ],
}

export default function Sidebar() {
  const { user, role } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const items = NAV[role] || []
  const fullName = user ? `${user.first_name} ${user.last_name}` : ''

  return (
    <Box sx={{width:240,flexShrink:0,bgcolor:'background.paper',borderRight:'1px solid',borderColor:'divider',
      display:{xs:'none',md:'flex'},flexDirection:'column',minHeight:'100vh'}}>
      {/* Brand */}
      <Box sx={{p:2,display:'flex',alignItems:'center',gap:1.5,borderBottom:'1px solid',borderColor:'divider'}}>
        <Box sx={{width:32,height:32,borderRadius:1.5,bgcolor:'primary.main',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}>
          <LocalHospitalOutlined sx={{fontSize:18}}/>
        </Box>
        <Typography variant="h6" fontWeight={700} color="primary">MediBook</Typography>
      </Box>

      {/* User info */}
      <Box sx={{p:2,display:'flex',alignItems:'center',gap:1.5}}>
        <Avatar sx={{width:36,height:36,bgcolor:'primary.main',fontSize:13}}>{getInitials(fullName)}</Avatar>
        <Box sx={{minWidth:0}}>
          <Typography variant="body2" fontWeight={600} noWrap>{fullName}</Typography>
          <Typography variant="caption" color="text.secondary" textTransform="capitalize">{role}</Typography>
        </Box>
      </Box>
      <Divider/>

      {/* Nav items */}
      <List sx={{flex:1,px:1,py:1}}>
        {items.map(item => {
          const active = pathname === item.path || pathname.startsWith(item.path+'/')
          return (
            <ListItemButton key={item.path} onClick={()=>navigate(item.path)} selected={active}
              sx={{borderRadius:1.5,mb:.5,'&.Mui-selected':{bgcolor:'primary.main',color:'#fff',
                '&:hover':{bgcolor:'primary.dark'},'& .MuiListItemIcon-root':{color:'#fff'}}}}>
              <ListItemIcon sx={{minWidth:36}}>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.label)} primaryTypographyProps={{fontSize:14,fontWeight:500}}/>
            </ListItemButton>
          )
        })}
      </List>

      <Divider/>
      <List sx={{px:1,py:1}}>
        <ListItemButton onClick={()=>navigate('/profile')} sx={{borderRadius:1.5}}>
          <ListItemIcon sx={{minWidth:36}}><SettingsOutlined/></ListItemIcon>
          <ListItemText primary={t('profile')} primaryTypographyProps={{fontSize:14}}/>
        </ListItemButton>
      </List>
    </Box>
  )
}
