import { Outlet } from 'react-router-dom'
import { Box }    from '@mui/material'
import Sidebar    from '../components/common/Sidebar'
import Navbar     from '../components/common/Navbar'
import BackToTop  from '../components/common/BackToTop'

export default function DashboardLayout() {
  return (
    <Box sx={{display:'flex',minHeight:'100vh'}}>
      <Sidebar />
      <Box sx={{flex:1,display:'flex',flexDirection:'column'}}>
        <Navbar dashboard />
        <Box component="main" sx={{flex:1,p:{xs:2,md:4},bgcolor:'background.default'}}>
          <Outlet />
        </Box>
      </Box>
      <BackToTop />
    </Box>
  )
}
