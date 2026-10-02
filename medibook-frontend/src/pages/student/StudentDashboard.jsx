import { useState, useEffect } from 'react'
import {
  Container, Grid, Card, CardMedia, CardContent, Typography, Box,
  LinearProgress, Button, Skeleton, Paper
} from '@mui/material'
import { School, CheckCircle, MenuBook, ArrowForward } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { enrollmentService } from '../../services/enrollmentService'
import { useAuth } from '../../hooks/useAuth'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentService.getMyEnrollments()
        setEnrollments(data || [])
      } catch (err) {
        console.error('Failed to load my courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  const completedCount = enrollments.filter(e => e.progress === 100).length
  const inProgressCount = enrollments.length - completedCount

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '85vh' }}>
      <Container maxWidth="lg">
        {/* Welcome Banner */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Welcome back, {user?.name || 'Student'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep learning and reach your goals. Here is your current course progress:
          </Typography>
        </Box>

        {/* Stats Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                <School sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {enrollments.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enrolled Courses
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: 'warning.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'warning.dark' }}>
                <MenuBook sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {inProgressCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'success.dark' }}>
                <CheckCircle sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {completedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* My Enrolled Courses Section */}
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          My Courses
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : enrollments.length === 0 ? (
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
            <School sx={{ fontSize: 50, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              You haven't enrolled in any courses yet!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Explore our catalog of online courses and start learning today.
            </Typography>
            <Button component={RouterLink} to="/courses" variant="contained">
              Explore Courses
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {enrollments.map((en) => {
              const course = en.course
              if (!course) return null

              return (
                <Grid item xs={12} sm={6} md={4} key={en._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 2 }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
                      alt={course.title}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="caption" color="primary" fontWeight={600} gutterBottom>
                        {course.category}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                        Instructor: {course.instructor?.name || 'Instructor'}
                      </Typography>

                      {/* Progress Bar */}
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" fontWeight={600}>
                            Progress
                          </Typography>
                          <Typography variant="caption" fontWeight={700} color={en.progress === 100 ? 'success.main' : 'primary.main'}>
                            {en.progress || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={en.progress || 0}
                          color={en.progress === 100 ? 'success' : 'primary'}
                          sx={{ height: 8, borderRadius: 4, mb: 2 }}
                        />

                        <Button
                          fullWidth
                          variant="contained"
                          component={RouterLink}
                          to={`/courses/${course._id || course.id}`}
                          endIcon={<ArrowForward />}
                          size="small"
                          sx={{ py: 1, fontWeight: 600 }}
                        >
                          {en.progress === 100 ? 'Review Course' : 'Continue Course'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
