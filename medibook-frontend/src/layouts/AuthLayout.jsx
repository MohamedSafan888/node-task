import { Outlet, Navigate } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { defaultRedirect } from '../utils/rolePermissions'

export default function AuthLayout() {
  const { isAuthenticated, role, loading } = useAuth()
  if (!loading && isAuthenticated) return <Navigate to={defaultRedirect(role)} replace />
  return (
    <Box sx={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',bgcolor:'background.default',py:4}}>
      <Container maxWidth="sm"><Outlet /></Container>
    </Box>
  )
}
