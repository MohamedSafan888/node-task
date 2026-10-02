import { Box, TextField, MenuItem, Stack, InputAdornment, Button } from '@mui/material'
import { SearchOutlined, FilterListOutlined } from '@mui/icons-material'
import { useLang } from '../../context/LanguageContext'

export default function DoctorFilters({ filters, onChange, specialties = [], onReset }) {
  const { t } = useLang()
  return (
    <Box component="form" onSubmit={e=>e.preventDefault()} sx={{mb:3}}>
      <Stack direction={{xs:'column',sm:'row'}} spacing={2} alignItems="flex-start">
        <TextField
          placeholder={t('search')+' doctor name…'}
          value={filters.search || ''}
          onChange={e => onChange('search', e.target.value)}
          size="small" sx={{flex:2,minWidth:200}}
          InputProps={{startAdornment:<InputAdornment position="start"><SearchOutlined fontSize="small"/></InputAdornment>}}
        />
        <TextField select label={t('specialty')} value={filters.specialty || ''} size="small"
          onChange={e => onChange('specialty', e.target.value)} sx={{flex:1,minWidth:160}}>
          <MenuItem value="">{t('allSpecialties')}</MenuItem>
          {specialties.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
        </TextField>
        <TextField select label={t('sortBy')} value={filters.sort_by || ''} size="small"
          onChange={e => onChange('sort_by', e.target.value)} sx={{flex:1,minWidth:140}}>
          <MenuItem value="">—</MenuItem>
          <MenuItem value="rating">{t('rating')}</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </TextField>
        {(filters.search || filters.specialty || filters.sort_by) && (
          <Button variant="text" size="small" onClick={onReset} sx={{whiteSpace:'nowrap',alignSelf:'center'}}>
            Clear filters
          </Button>
        )}
      </Stack>
    </Box>
  )
}
