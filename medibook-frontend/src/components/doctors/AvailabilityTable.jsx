import { Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Typography, Skeleton } from '@mui/material'
import { useLang } from '../../context/LanguageContext'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function AvailabilityTable({ slots = [], loading }) {
  const { t } = useLang()
  if (loading) return (
    <Box>
      {[...Array(5)].map((_,i) => <Skeleton key={i} variant="rectangular" height={44} sx={{mb:1,borderRadius:1}}/>)}
    </Box>
  )
  if (!slots.length) return (
    <Box sx={{textAlign:'center',py:4}}>
      <Typography color="text.secondary">No available slots found.</Typography>
    </Box>
  )
  return (
    <Box sx={{overflowX:'auto'}}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slots.map((slot,i) => (
            <TableRow key={i} hover>
              <TableCell>{typeof slot.day === 'number' ? DAYS[slot.day] : slot.day}</TableCell>
              <TableCell>{slot.start_time} – {slot.end_time}</TableCell>
              <TableCell>
                <Chip label={slot.is_available ? 'Available':'Booked'} size="small"
                  color={slot.is_available ? 'success':'default'} variant="outlined"/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
