import { Box, Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../context/LanguageContext'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useLang()
  useTitle('404')
  return (
    <Container maxWidth="sm">
      <Box sx={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',gap:3}}>
        <Typography variant="h1" fontWeight={800}
          sx={{fontSize:{xs:80,md:120},color:'primary.main',lineHeight:1}}>404</Typography>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>Page not found</Typography>
          <Typography variant="body1" color="text.secondary">The page you're looking for doesn't exist.</Typography>
        </Box>
        <Button variant="contained" size="large" onClick={()=>navigate(-1)} sx={{px:4}}>{t('back')}</Button>
      </Box>
    </Container>
  )
}
