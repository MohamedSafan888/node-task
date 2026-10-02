import { Box, CircularProgress, Typography } from '@mui/material'
export default function Loader({ text = '' }) {
  return (
    <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',py:8,gap:2}}>
      <CircularProgress/>
      {text && <Typography color="text.secondary">{text}</Typography>}
    </Box>
  )
}
