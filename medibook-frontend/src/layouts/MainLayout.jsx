import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar  from '../components/common/Navbar'
import Footer  from '../components/common/Footer'
import BackToTop from '../components/common/BackToTop'

export default function MainLayout() {
  return (
    <Box sx={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Navbar />
      <Box component="main" sx={{flex:1}}>
        <Outlet />
      </Box>
      <Footer />
      <BackToTop />
    </Box>
  )
}
