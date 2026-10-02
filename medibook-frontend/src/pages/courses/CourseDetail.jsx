import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Button, Chip, Card, CardContent,
  Avatar, Rating, Divider, List, ListItem, ListItemIcon, ListItemText,
  Paper, TextField, Alert, CircularProgress
} from '@mui/material'
import {
  PlayCircleOutline, AccessTime, SchoolOutlined, CheckCircle,
  StarRounded, Person
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { courseService } from '../../services/courseService'
import { enrollmentService } from '../../services/enrollmentService'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../context/LanguageContext'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { user, isAuthenticated, role } = useAuth()
  const { t } = useLang()

  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  // Review form
  const [ratingVal, setRatingVal] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchCourseData = useCallback(async () => {
    try {
      const data = await courseService.getCourseById(id)
      setCourse(data)

      if (isAuthenticated) {
        const enrollData = await enrollmentService.getCourseStatus(id)
        if (enrollData.isEnrolled) {
          setEnrollment(enrollData.enrollment)
        }
      }
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to load course details', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [id, isAuthenticated, enqueueSnackbar])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }

    if (role === 'Instructor') {
      enqueueSnackbar('Instructors cannot enroll in courses. Login as a student.', { variant: 'warning' })
      return
    }

    setEnrolling(true)
    try {
      const newEnrollment = await courseService.enrollInCourse(id)
      setEnrollment(newEnrollment)
      enqueueSnackbar('Successfully enrolled in this course! Happy learning!', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Enrollment failed', { variant: 'error' })
    } finally {
      setEnrolling(false)
    }
  }

  const handleRateSubmit = async (e) => {
    e.preventDefault()
    if (!ratingVal) return

    setSubmittingReview(true)
    try {
      await courseService.rateCourse(id, { rating: ratingVal, review: reviewText })
      enqueueSnackbar('Thank you for rating this course!', { variant: 'success' })
      setReviewText('')
      fetchCourseData()
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to submit review', { variant: 'error' })
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!course) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5">Course not found</Typography>
        <Button component={RouterLink} to="/courses" sx={{ mt: 2 }} variant="contained">
          Back to Courses
        </Button>
      </Container>
    )
  }

  const isEnrolled = !!enrollment
  const lessons = course.lessons || []
  const firstLessonId = lessons[0]?._id

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 6 }}>
      {/* Course Banner */}
      <Box sx={{ bgcolor: '#0f172a', color: '#fff', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={course.category} color="primary" size="small" sx={{ fontWeight: 600 }} />
                <Chip label={course.level} variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', fontSize: 12 }} size="small" />
              </Box>

              <Typography variant="h3" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                {course.title}
              </Typography>

              <Typography variant="body1" sx={{ opacity: 0.85, mb: 3, fontSize: '1.05rem', lineHeight: 1.6 }}>
                {course.description}
              </Typography>

              {/* Instructor & Rating Meta */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={course.instructor?.avatar} sx={{ width: 36, height: 36 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Created by <strong>{course.instructor?.name}</strong>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={course.averageRating || 0} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" fontWeight={700}>
                    {course.averageRating ? course.averageRating.toFixed(1) : 'New'}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    ({course.ratingsCount || 0} reviews)
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Action Card (Right Side) */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 6 }}>
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt={course.title}
                  sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" fontWeight={800} color="primary" gutterBottom>
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </Typography>

                  {isEnrolled ? (
                    <Box sx={{ mt: 2 }}>
                      <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ mb: 2 }}>
                        You are enrolled! Progress: {enrollment.progress || 0}%
                      </Alert>
                      {firstLessonId ? (
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          component={RouterLink}
                          to={`/courses/${course._id}/learn/${firstLessonId}`}
                          sx={{ py: 1.5, fontWeight: 700 }}
                        >
                          {t('startLearning')}
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No lessons available yet.
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      sx={{ py: 1.5, mt: 1, fontWeight: 700, fontSize: '1.05rem' }}
                    >
                      {enrolling ? 'Enrolling...' : t('enrollNow')}
                    </Button>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
                    Lifetime access & certificate of completion
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Body */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Curriculum / Lessons */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Course Curriculum ({lessons.length} Lessons)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Structured step-by-step learning modules.
              </Typography>

              {lessons.length === 0 ? (
                <Alert severity="info">No lessons added to this course yet.</Alert>
              ) : (
                <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                  {lessons.map((lesson, idx) => (
                    <ListItem
                      key={lesson._id}
                      divider={idx < lessons.length - 1}
                      sx={{
                        py: 1.5,
                        borderRadius: 1,
                        cursor: isEnrolled ? 'pointer' : 'default',
                        '&:hover': isEnrolled ? { bgcolor: 'action.hover' } : {}
                      }}
                      onClick={() => {
                        if (isEnrolled) navigate(`/courses/${course._id}/learn/${lesson._id}`)
                      }}
                    >
                      <ListItemIcon>
                        <PlayCircleOutline color={isEnrolled ? 'primary' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600} color={isEnrolled ? 'text.primary' : 'text.secondary'}>
                            {lesson.order}. {lesson.title}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <AccessTime sx={{ fontSize: 16 }} />
                        <Typography variant="caption">
                          {lesson.duration || 10} min
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            {/* Instructor Bio */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Instructor
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                <Avatar src={course.instructor?.avatar} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {course.instructor?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor?.bio || 'Certified Course Instructor'}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Ratings and Reviews */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {t('reviews')}
              </Typography>

              {/* Review Input for Enrolled Students */}
              {isEnrolled && role === 'Student' && (
                <Box component="form" onSubmit={handleRateSubmit} sx={{ my: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Leave a Rating & Review
                  </Typography>
                  <Rating
                    value={ratingVal}
                    onChange={(_, val) => setRatingVal(val || 5)}
                    sx={{ mb: 1.5 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Share your experience about this course..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    sx={{ mb: 1.5, bgcolor: 'background.paper' }}
                  />
                  <Button type="submit" variant="contained" size="small" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Box>
              )}

              {/* Reviews List */}
              <Box sx={{ mt: 2 }}>
                {course.ratings && course.ratings.length > 0 ? (
                  course.ratings.map((rev, i) => (
                    <Box key={i} sx={{ py: 2, borderBottom: i < course.ratings.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Avatar src={rev.student?.avatar} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {rev.student?.name || 'Student'}
                          </Typography>
                          <Rating value={rev.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      {rev.review && (
                        <Typography variant="body2" color="text.secondary">
                          "{rev.review}"
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No reviews yet. Be the first to review this course!
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
