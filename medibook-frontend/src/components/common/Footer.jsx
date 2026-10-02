import { Box, Container, Typography, Stack } from '@mui/material'
import { SchoolRounded } from '@mui/icons-material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', py: 3, mt: 'auto', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SchoolRounded fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={700} color="primary">CourseHub</Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} CourseHub - Online Learning Platform. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
