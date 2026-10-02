import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Button, Paper, TextField,
  MenuItem, Select, FormControl, InputLabel, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, Divider
} from '@mui/material'
import {
  ArrowBack, Add, EditOutlined, DeleteOutline,
  PlayCircleOutline, AccessTime
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { courseService } from '../../services/courseService'
import { lessonService } from '../../services/lessonService'

export default function CourseEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingCourse, setSavingCourse] = useState(false)

  // Lesson modal state
  const [lessonModal, setLessonModal] = useState(false)
  const [editingLessonId, setEditingLessonId] = useState(null)
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: 1,
    duration: 15
  })
  const [submittingLesson, setSubmittingLesson] = useState(false)

  const fetchCourse = useCallback(async () => {
    try {
      const [courseData, lessonsData] = await Promise.all([
        courseService.getCourseById(id),
        lessonService.getLessons(id)
      ])
      setCourse(courseData)
      setLessons(lessonsData || [])
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to load course details', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [id, enqueueSnackbar])

  useEffect(() => {
    fetchCourse()
  }, [fetchCourse])

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    setSavingCourse(true)
    try {
      await courseService.updateCourse(id, {
        title: course.title,
        description: course.description,
        category: course.category,
        price: Number(course.price) || 0,
        level: course.level,
        thumbnail: course.thumbnail
      })
      enqueueSnackbar('Course details updated successfully!', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to update course', { variant: 'error' })
    } finally {
      setSavingCourse(false)
    }
  }

  const handleOpenAddLesson = () => {
    setEditingLessonId(null)
    setLessonForm({
      title: '',
      content: '',
      videoUrl: '',
      order: lessons.length + 1,
      duration: 15
    })
    setLessonModal(true)
  }

  const handleOpenEditLesson = (lesson) => {
    setEditingLessonId(lesson._id || lesson.id)
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl || '',
      order: lesson.order || 1,
      duration: lesson.duration || 15
    })
    setLessonModal(true)
  }

  const handleSaveLesson = async (e) => {
    e.preventDefault()
    setSubmittingLesson(true)
    try {
      if (editingLessonId) {
        await lessonService.updateLesson(editingLessonId, lessonForm)
        enqueueSnackbar('Lesson updated successfully', { variant: 'success' })
      } else {
        await lessonService.createLesson(id, lessonForm)
        enqueueSnackbar('Lesson created successfully', { variant: 'success' })
      }
      setLessonModal(false)
      fetchCourse()
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to save lesson', { variant: 'error' })
    } finally {
      setSubmittingLesson(false)
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return

    try {
      await lessonService.deleteLesson(lessonId)
      enqueueSnackbar('Lesson deleted', { variant: 'info' })
      setLessons(prev => prev.filter(l => (l._id || l.id) !== lessonId))
    } catch (err) {
      enqueueSnackbar('Failed to delete lesson', { variant: 'error' })
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Back Link */}
        <Button
          component={RouterLink}
          to="/instructor/dashboard"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
          color="inherit"
        >
          Back to Instructor Studio
        </Button>

        <Typography variant="h4" fontWeight={800} gutterBottom>
          Edit Course & Curriculum
        </Typography>

        <Grid container spacing={4}>
          {/* Left: Course Settings Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Course Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <form onSubmit={handleUpdateCourse}>
                <TextField
                  fullWidth
                  label="Title"
                  required
                  value={course?.title || ''}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  required
                  value={course?.description || ''}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={course?.category || 'Web Development'}
                        label="Category"
                        onChange={(e) => setCourse({ ...course, category: e.target.value })}
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

                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={course?.level || 'All Levels'}
                        label="Level"
                        onChange={(e) => setCourse({ ...course, level: e.target.value })}
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
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Price ($)"
                      value={course?.price ?? 0}
                      onChange={(e) => setCourse({ ...course, price: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Thumbnail Image URL"
                      value={course?.thumbnail || ''}
                      onChange={(e) => setCourse({ ...course, thumbnail: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>

                <Button type="submit" variant="contained" disabled={savingCourse} sx={{ mt: 1 }}>
                  {savingCourse ? 'Saving Changes...' : 'Save Course Details'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Right: Lessons Manager */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Course Lessons ({lessons.length})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Add videos, notes, and arrange learning modules
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleOpenAddLesson}
                >
                  Add Lesson
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {lessons.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No lessons created yet. Click "Add Lesson" to build your curriculum!
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {lessons.map((lesson, idx) => (
                    <ListItem
                      key={lesson._id || lesson.id}
                      divider={idx < lessons.length - 1}
                      secondaryAction={
                        <Box>
                          <IconButton size="small" color="primary" onClick={() => handleOpenEditLesson(lesson)}>
                            <EditOutlined fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteLesson(lesson._id || lesson.id)}>
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                      sx={{ py: 1.5 }}
                    >
                      <ListItemIcon>
                        <PlayCircleOutline color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight={600}>
                            {lesson.order}. {lesson.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {lesson.duration || 10} mins
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Modal: Add/Edit Lesson */}
        <Dialog open={lessonModal} onClose={() => setLessonModal(false)} maxWidth="sm" fullWidth>
          <form onSubmit={handleSaveLesson}>
            <DialogTitle fontWeight={800}>
              {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                fullWidth
                label="Lesson Title"
                required
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Lesson Content / Notes"
                required
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Video URL (YouTube or MP4)"
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                sx={{ mb: 2 }}
                placeholder="https://www.youtube.com/watch?v=..."
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Lesson Order"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) || 1 })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration (Minutes)"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) || 10 })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setLessonModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submittingLesson}>
                {submittingLesson ? 'Saving...' : 'Save Lesson'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  )
}
