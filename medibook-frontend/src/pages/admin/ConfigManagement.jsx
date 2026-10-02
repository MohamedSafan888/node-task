import { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, Box, TextField, Button, List,
  ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Stack,
  CircularProgress, Alert } from '@mui/material'
import { AddOutlined, DeleteOutlined } from '@mui/icons-material'
import { adminService } from '../../services/adminService'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useSnackbar } from 'notistack'

export default function ConfigManagement() {
  const { t } = useLang()
  const { enqueueSnackbar } = useSnackbar()
  const [specialties, setSpecialties] = useState([])
  const [newName, setNewName] = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  useTitle(t('specialties'))

  const load = () => adminService.getSpecialties().then(d=>setSpecialties(Array.isArray(d)?d:d.results||[])).catch(()=>{})
  useEffect(()=>{ load() },[])

  const handleAdd = async (e) => {
    e.preventDefault(); setError('')
    if (!newName.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      await adminService.addSpecialty({ name: newName.trim() })
      enqueueSnackbar('Specialty added!', {variant:'success'})
      setNewName(''); load()
    } catch { setError(t('error')) } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteSpecialty(id)
      enqueueSnackbar('Deleted', {variant:'info'})
      load()
    } catch { enqueueSnackbar(t('error'),{variant:'error'}) }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight={700} mb={3}>{t('specialties')}</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>{t('addSpecialty')}</Typography>
          {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
          <Box component="form" onSubmit={handleAdd}>
            <Stack direction="row" spacing={2}>
              <TextField size="small" placeholder="Specialty name" value={newName}
                onChange={e=>setNewName(e.target.value)} sx={{flex:1}}/>
              <Button type="submit" variant="contained" startIcon={<AddOutlined/>} disabled={saving}>
                {saving?<CircularProgress size={18} color="inherit"/>:'Add'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{my:3}}/>
          <Typography variant="subtitle2" fontWeight={600} mb={1}>Current specialties ({specialties.length})</Typography>
          {specialties.length===0
            ? <Typography color="text.secondary" sx={{py:2}}>No specialties yet.</Typography>
            : (
              <List dense>
                {specialties.map((s,i)=>(
                  <ListItem key={s.id||i} divider>
                    <ListItemText primary={s.name}/>
                    <ListItemSecondaryAction>
                      <IconButton size="small" color="error" onClick={()=>handleDelete(s.id)}>
                        <DeleteOutlined fontSize="small"/>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )
          }
        </CardContent>
      </Card>
    </Container>
  )
}
