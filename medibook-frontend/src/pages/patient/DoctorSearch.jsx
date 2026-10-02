import { useState, useEffect } from 'react'
import { Container, Grid, Typography, Pagination, Box, Skeleton } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { doctorService } from '../../services/doctorService'
import { adminService } from '../../services/adminService'
import DoctorCard from '../../components/doctors/DoctorCard'
import DoctorFilters from '../../components/doctors/DoctorFilters'
import { useDebounce } from '../../hooks/useDebounce'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { DEFAULT_PAGE_SIZE } from '../../utils/constants'

export default function DoctorSearch() {
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  useTitle(t('findDoctors'))

  const [doctors, setDoctors]       = useState([])
  const [specialties, setSpecialties] = useState([])
  const [total, setTotal]           = useState(0)
  const [loading, setLoading]       = useState(true)
  const [filters, setFilters]       = useState({
    search:    searchParams.get('search')    || '',
    specialty: searchParams.get('specialty') || '',
    sort_by:   searchParams.get('sort_by')   || '',
    page:      parseInt(searchParams.get('page') || '1'),
  })

  const debouncedSearch = useDebounce(filters.search, 500)

  // Load specialties once
  useEffect(() => {
    adminService.getSpecialties().then(setSpecialties).catch(()=>{})
  }, [])

  // Load doctors on filter/page change
  useEffect(() => {
    setLoading(true)
    const params = { page: filters.page, page_size: DEFAULT_PAGE_SIZE }
    if (debouncedSearch) params.search = debouncedSearch
    if (filters.specialty) params.specialty = filters.specialty
    if (filters.sort_by)   params.sort_by   = filters.sort_by

    // sync URL
    setSearchParams(Object.fromEntries(Object.entries({
      search: debouncedSearch, specialty: filters.specialty,
      sort_by: filters.sort_by, page: filters.page,
    }).filter(([,v])=>v&&v!==1)))

    doctorService.getAll(params)
      .then(data => { setDoctors(data.results || data); setTotal(data.count || data.length) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [debouncedSearch, filters.specialty, filters.sort_by, filters.page])

  const handleChange = (key, value) => setFilters(p => ({...p, [key]: value, page: key!=='page'?1:value}))
  const handleReset  = () => setFilters({ search:'', specialty:'', sort_by:'', page:1 })
  const totalPages   = Math.ceil(total / DEFAULT_PAGE_SIZE)

  return (
    <Container maxWidth="lg" sx={{py:4}}>
      <Typography variant="h4" fontWeight={700} gutterBottom>{t('findDoctors')}</Typography>
      <DoctorFilters filters={filters} onChange={handleChange} specialties={specialties} onReset={handleReset}/>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_,i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{borderRadius:2}}/>
            </Grid>
          ))}
        </Grid>
      ) : doctors.length === 0 ? (
        <Box sx={{textAlign:'center',py:8}}>
          <Typography color="text.secondary">{t('noResults')}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {doctors.map(doc => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
              <DoctorCard doctor={doc}/>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{display:'flex',justifyContent:'center',mt:4}}>
          <Pagination count={totalPages} page={filters.page}
            onChange={(_,p) => handleChange('page', p)} color="primary" shape="rounded"/>
        </Box>
      )}
    </Container>
  )
}
