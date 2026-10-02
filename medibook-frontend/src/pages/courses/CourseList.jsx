import { useState, useEffect, useCallback } from 'react'
import {
  Container, Grid, Card, CardMedia, CardContent, Typography, Box,
  TextField, InputAdornment, Chip, Rating, Button, Select, MenuItem,
  FormControl, InputLabel, Skeleton, Pagination, Paper
} from '@mui/material'
import { Search, SchoolOutlined, StarRounded, PersonOutline } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import { useLang } from '../../context/LanguageContext'

export default function CourseList() {
  const { t } = useLang()
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Pagination state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [level, setLevel] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCategories = async () => {
    try {
      const data = await courseService.getCategories()
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 9,
        sort,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(level && { level })
      }
      const data = await courseService.getCourses(params)
      setCourses(data.courses || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Failed to load courses', err)
    } finally {
      setLoading(false)
    }
  }, [page, sort, search, selectedCategory, level])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleCategoryClick = (catName) => {
    setSelectedCategory(prev => (prev === catName ? '' : catName))
    setPage(1)
  }

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Discover World-Class Online Courses
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 650, mx: 'auto', mb: 3 }}>
            Learn in-demand tech and creative skills from industry-leading instructors at your own pace.
          </Typography>

          {/* Search Box */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('search')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { bgcolor: 'background.paper', borderRadius: 2 }
              }}
            />
          </Box>
        </Paper>

        {/* Categories Bar */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
          <Chip
            label={t('allCategories')}
            clickable
            color={!selectedCategory ? 'primary' : 'default'}
            variant={!selectedCategory ? 'filled' : 'outlined'}
            onClick={() => handleCategoryClick('')}
            sx={{ fontWeight: 600 }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.name}
              label={`${cat.name} (${cat.count})`}
              clickable
              color={selectedCategory === cat.name ? 'primary' : 'default'}
              variant={selectedCategory === cat.name ? 'filled' : 'outlined'}
              onClick={() => handleCategoryClick(cat.name)}
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>

        {/* Filter / Sort Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            {courses.length} courses available
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Level</InputLabel>
              <Select value={level} label="Level" onChange={(e) => { setLevel(e.target.value); setPage(1) }}>
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{t('sortBy')}</InputLabel>
              <Select value={sort} label={t('sortBy')} onChange={(e) => setSort(e.target.value)}>
                <MenuItem value="-createdAt">Newest First</MenuItem>
                <MenuItem value="-averageRating">Highest Rated</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="-price">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Course Cards Grid */}
        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <Skeleton variant="rectangular" height={180} />
                  <CardContent>
                    <Skeleton width="60%" height={24} />
                    <Skeleton width="100%" height={20} />
                    <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : courses.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SchoolOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {t('noResults')}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearch(''); setSelectedCategory(''); setLevel('') }}>
                  Reset Filters
                </Button>
              </Box>
            </Grid>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id || course.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={course.category} size="small" color="primary" variant="outlined" sx={{ fontSize: 11, fontWeight: 600 }} />
                      <Typography variant="caption" color="text.secondary">
                        {course.level}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      component={RouterLink}
                      to={`/courses/${course._id || course.id}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'text.primary',
                        fontSize: '1.05rem',
                        lineHeight: 1.3,
                        mb: 1,
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {course.description}
                    </Typography>

                    {/* Instructor Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <PersonOutline fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {course.instructor?.name || 'Instructor'}
                      </Typography>
                    </Box>

                    {/* Rating & Price */}
                    <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarRounded sx={{ color: '#faaf00', fontSize: 18 }} />
                        <Typography variant="body2" fontWeight={700}>
                          {course.averageRating ? course.averageRating.toFixed(1) : 'New'}
                        </Typography>
                        {course.ratingsCount > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            ({course.ratingsCount})
                          </Typography>
                        )}
                      </Box>

                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        {course.price > 0 ? `$${course.price}` : t('free')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
          </Box>
        )}
      </Container>
    </Box>
  )
}
