import { useState, useEffect, useCallback } from 'react'
import {
  Container, Grid, Box, Typography, Button, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl,
  InputLabel, CircularProgress, Tooltip
} from '@mui/material'
import {
  Add, EditOutlined, DeleteOutline, PeopleAltOutlined,
  MenuBook, SchoolOutlined, StarRounded
} from '@mui/icons-material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { courseService } from '../../services/courseService'
import { useAuth } from '../../hooks/useAuth'

export default function InstructorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  // Create course dialog state
  const [openModal, setOpenModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: 0,
    level: 'All Levels',
    thumbnail: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchInstructorCourses = useCallback(async () => {
    setLoading(true)
    try {
      // Filter courses where instructor is current user
      const data = await courseService.getCourses({ instructor: user?._id || user?.id, limit: 100 })
      setCourses(data.courses || [])
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to load your courses', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [user, enqueueSnackbar])

  useEffect(() => {
    fetchInstructorCourses()
  }, [fetchInstructorCourses])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const created = await courseService.createCourse({
        ...formData,
        price: Number(formData.price) || 0
      })
      enqueueSnackbar('Course created! Now add lessons to it.', { variant: 'success' })
      setOpenModal(false)
      setCourses(prev => [created, ...prev])
      navigate(`/instructor/courses/${created._id}/edit`)
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create course', { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all its lessons?')) return

    try {
      await courseService.deleteCourse(courseId)
      setCourses(prev => prev.filter(c => (c._id || c.id) !== courseId))
      enqueueSnackbar('Course deleted successfully', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('Failed to delete course', { variant: 'error' })
    }
  }

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Instructor Studio 🎓
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your courses, curriculums, and student enrollments.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            sx={{ px: 3, py: 1.2, fontWeight: 700, borderRadius: 2 }}
          >
            Create New Course
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                <MenuBook sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {courses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Courses Published
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.dark' }}>
                <SchoolOutlined sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  {courses.reduce((acc, c) => acc + (c.ratingsCount || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Course Reviews
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Courses Table */}
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700}>
              My Courses
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : courses.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                You haven't created any courses yet.
              </Typography>
              <Button variant="outlined" startIcon={<Add />} onClick={() => setOpenModal(true)} sx={{ mt: 1 }}>
                Create First Course
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell fontWeight={700}>Course</TableCell>
                    <TableCell fontWeight={700}>Category</TableCell>
                    <TableCell fontWeight={700}>Price</TableCell>
                    <TableCell fontWeight={700}>Rating</TableCell>
                    <TableCell align="right" fontWeight={700}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id || course.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80'}
                            alt={course.title}
                            sx={{ width: 60, height: 40, borderRadius: 1, objectFit: 'cover' }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {course.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Level: {course.level}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={course.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {course.price > 0 ? `$${course.price}` : 'Free'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarRounded sx={{ color: '#faaf00', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={700}>
                            {course.averageRating ? course.averageRating.toFixed(1) : '-'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({course.ratingsCount || 0})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Enrolled Students">
                          <IconButton
                            color="primary"
                            component={RouterLink}
                            to={`/instructor/courses/${course._id || course.id}/students`}
                          >
                            <PeopleAltOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage Lessons & Content">
                          <IconButton
                            color="info"
                            component={RouterLink}
                            to={`/instructor/courses/${course._id || course.id}/edit`}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Course">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteCourse(course._id || course.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Modal: Create Course */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
          <form onSubmit={handleCreateCourse}>
            <DialogTitle fontWeight={800}>Create New Course</DialogTitle>
            <DialogContent dividers>
              <TextField
                fullWidth
                label="Course Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Course Description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <MenuItem value="Web Development">Web Development</MenuItem>
                      <MenuItem value="Mobile Development">Mobile Development</MenuItem>
                      <MenuItem value="Data Science">Data Science</MenuItem>
                      <MenuItem value="Design">Design</MenuItem>
                      <MenuItem value="Business">Business</MenuItem>
                      <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Difficulty Level</InputLabel>
                    <Select
                      value={formData.level}
                      label="Difficulty Level"
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      <MenuItem value="All Levels">All Levels</MenuItem>
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">Intermediate</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Price ($)"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    sx={{ mb: 2 }}
                    helperText="Set to 0 for Free"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Thumbnail Image URL"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    sx={{ mb: 2 }}
                    placeholder="https://..."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Course'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  )
}
