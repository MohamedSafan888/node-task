import { useState, useEffect } from 'react'
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Button, Box, TextField, InputAdornment, TableContainer, Avatar, Stack, CircularProgress } from '@mui/material'
import { SearchOutlined } from '@mui/icons-material'
import { adminService } from '../../services/adminService'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useDebounce } from '../../hooks/useDebounce'
import { useSnackbar } from 'notistack'
import { getInitials } from '../../utils/helpers'

export default function UsersManagement() {
  const { t } = useLang()
  const { enqueueSnackbar } = useSnackbar()
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  useTitle(t('allUsers'))

  const load = (q='') => {
    setLoading(true)
    adminService.getUsers(q ? {search:q} : {})
      .then(d => setUsers(Array.isArray(d)?d:d.results||[]))
      .catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(()=>{ load(debouncedSearch) },[debouncedSearch])

  const toggle = async (u, action) => {
    try {
      await adminService.updateUser(u.id, { is_approved: action==='approve', is_active: action!=='block' })
      enqueueSnackbar(`User ${action}d`, {variant:'success'})
      load(debouncedSearch)
    } catch { enqueueSnackbar(t('error'),{variant:'error'}) }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={700} mb={3}>{t('allUsers')}</Typography>
      <Box mb={2}>
        <TextField placeholder={t('search')+'…'} value={search} onChange={e=>setSearch(e.target.value)}
          size="small" sx={{width:300}}
          InputProps={{startAdornment:<InputAdornment position="start"><SearchOutlined fontSize="small"/></InputAdornment>}}/>
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{border:'1px solid',borderColor:'divider'}}>
        <Table>
          <TableHead>
            <TableRow sx={{'& th':{fontWeight:600,bgcolor:'background.default'}}}>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{py:4}}><CircularProgress size={28}/></TableCell></TableRow>
            ) : users.length===0 ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{py:4,color:'text.secondary'}}>{t('noResults')}</TableCell></TableRow>
            ) : users.map(u=>(
              <TableRow key={u.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{width:32,height:32,bgcolor:'primary.main',fontSize:12}}>
                      {getInitials(`${u.first_name} ${u.last_name}`)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{u.first_name} {u.last_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell><Chip label={u.role} size="small" variant="outlined"/></TableCell>
                <TableCell>
                  <Chip label={u.is_approved?'Approved':u.is_active===false?'Blocked':'Pending'}
                    size="small" color={u.is_approved?'success':u.is_active===false?'error':'warning'}/>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {!u.is_approved && <Button size="small" variant="outlined" color="success" onClick={()=>toggle(u,'approve')}>{t('approveUser')}</Button>}
                    {u.is_active!==false && <Button size="small" variant="outlined" color="error" onClick={()=>toggle(u,'block')}>{t('blockUser')}</Button>}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
