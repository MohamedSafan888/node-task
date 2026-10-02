import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Container, Grid, Box, Typography, Button, Paper, Divider,
  List, ListItem, ListItemIcon, ListItemText, Checkbox, Avatar,
  TextField, IconButton, CircularProgress, Alert
} from '@mui/material'
import {
  PlayCircleOutline, ArrowBack, SendRounded, DeleteOutline,
  CheckCircle, RadioButtonUnchecked
} from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { lessonService } from '../../services/lessonService'
import { enrollmentService } from '../../services/enrollmentService'
import { useAuth } from '../../hooks/useAuth'

export default function LessonViewer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)

  // Fetch course lessons & enrollment
  const fetchCourseData = useCallback(async () => {
    try {
      const [lessonsList, enrollData] = await Promise.all([
        lessonService.getLessons(courseId),
        enrollmentService.getCourseStatus(courseId)
      ])
      setLessons(lessonsList || [])
      setEnrollment(enrollData?.enrollment || null)
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to load course lessons', { variant: 'error' })
    }
  }, [courseId, enqueueSnackbar])

  // Fetch single lesson & comments
  const fetchLessonData = useCallback(async () => {
    setLoading(true)
    try {
      const [lesson, comms] = await Promise.all([
        lessonService.getLessonById(lessonId),
        lessonService.getComments(lessonId)
      ])
      setCurrentLesson(lesson)
      setComments(comms || [])
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to load lesson', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [lessonId, enqueueSnackbar])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  useEffect(() => {
    if (lessonId) {
      fetchLessonData()
    }
  }, [lessonId, fetchLessonData])

  const handleToggleComplete = async () => {
    try {
      const res = await enrollmentService.toggleLessonProgress(courseId, lessonId)
      setEnrollment(prev => ({
        ...prev,
        progress: res.progress,
        completedLessons: res.completedLessons
      }))
      enqueueSnackbar(res.message, { variant: 'success' })
    } catch (err) {
      enqueueSnackbar('Failed to update progress', { variant: 'error' })
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const created = await lessonService.addComment(lessonId, newComment.trim())
      setComments(prev => [created, ...prev])
      setNewComment('')
      enqueueSnackbar('Comment posted!', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to post comment', { variant: 'error' })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await lessonService.deleteComment(commentId)
      setComments(prev => prev.filter(c => (c._id || c.id) !== commentId))
      enqueueSnackbar('Comment deleted', { variant: 'info' })
    } catch (err) {
      enqueueSnackbar('Failed to delete comment', { variant: 'error' })
    }
  }

  const isCompleted = enrollment?.completedLessons?.some(
    id => (typeof id === 'string' ? id : id._id || id.id) === lessonId
  )

  if (loading && !currentLesson) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ py: 3, bgcolor: 'background.default', minHeight: '90vh' }}>
      <Container maxWidth="xl">
        {/* Top Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button
            component={RouterLink}
            to={`/courses/${courseId}`}
            startIcon={<ArrowBack />}
            variant="text"
            color="inherit"
          >
            Back to Course Overview
          </Button>

          {enrollment && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Course Progress: {enrollment.progress || 0}%
              </Typography>
              <Button
                variant={isCompleted ? 'outlined' : 'contained'}
                color={isCompleted ? 'success' : 'primary'}
                startIcon={isCompleted ? <CheckCircle /> : <RadioButtonUnchecked />}
                onClick={handleToggleComplete}
              >
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Main Content & Video & Comments */}
          <Grid item xs={12} lg={8}>
            {/* Video Player or Placeholder */}
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', mb: 3, bgcolor: '#000' }}>
              {currentLesson?.videoUrl ? (
                <Box
                  component="iframe"
                  src={
                    currentLesson.videoUrl.includes('watch?v=')
                      ? currentLesson.videoUrl.replace('watch?v=', 'embed/')
                      : currentLesson.videoUrl
                  }
                  title={currentLesson.title}
                  sx={{ width: '100%', height: { xs: 260, sm: 400, md: 480 }, border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Typography variant="h6">No video uploaded for this lesson</Typography>
                </Box>
              )}
            </Paper>

            {/* Lesson Title & Notes */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {currentLesson?.title}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {currentLesson?.content}
              </Typography>
            </Paper>

            {/* Discussion & Comments Section */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Lesson Discussion ({comments.length})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Have questions about this lesson? Ask your instructor and peers below.
              </Typography>

              {/* Add Comment Input */}
              <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                <Avatar src={user?.avatar} sx={{ width: 40, height: 40 }}>
                  {user?.name?.[0]}
                </Avatar>
                <TextField
                  fullWidth
                  placeholder="Ask a question or write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submittingComment || !newComment.trim()}
                  sx={{ alignSelf: 'flex-start', minWidth: 48, height: 40, p: 0 }}
                >
                  <SendRounded fontSize="small" />
                </Button>
              </Box>

              {/* Comments List */}
              {comments.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No comments yet. Start the discussion!
                </Alert>
              ) : (
                <List disablePadding>
                  {comments.map((comm) => {
                    const isAuthor = (comm.student?._id || comm.student) === (user?._id || user?.id)
                    return (
                      <ListItem
                        key={comm._id}
                        alignItems="flex-start"
                        sx={{
                          px: 0,
                          py: 2,
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Avatar src={comm.student?.avatar} sx={{ width: 36, height: 36, mr: 2 }}>
                          {comm.student?.name?.[0]}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {comm.student?.name || 'User'}
                              </Typography>
                              {comm.student?.role === 'Instructor' && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: 1,
                                    fontWeight: 600,
                                    fontSize: 10
                                  }}
                                >
                                  Instructor
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comm.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                              {comm.content}
                            </Typography>
                          }
                        />
                        {isAuthor && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteComment(comm._id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        )}
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Sidebar Lessons Playlist */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                position: 'sticky',
                top: 80
              }}
            >
              <Box sx={{ p: 2.5, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={700}>
                  Course Lessons
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {lessons.length} total lessons
                </Typography>
              </Box>

              <List disablePadding sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {lessons.map((item, idx) => {
                  const active = (item._id || item.id) === lessonId
                  const completed = enrollment?.completedLessons?.some(
                    id => (typeof id === 'string' ? id : id._id || id.id) === (item._id || item.id)
                  )

                  return (
                    <ListItem
                      key={item._id}
                      divider={idx < lessons.length - 1}
                      onClick={() => navigate(`/courses/${courseId}/learn/${item._id}`)}
                      sx={{
                        py: 2,
                        cursor: 'pointer',
                        bgcolor: active ? 'primary.light' : 'transparent',
                        color: active ? 'primary.contrastText' : 'inherit',
                        '&:hover': {
                          bgcolor: active ? 'primary.light' : 'action.hover'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: active ? 'inherit' : (completed ? 'success.main' : 'action.active') }}>
                        {completed ? <CheckCircle fontSize="small" /> : <PlayCircleOutline fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={active ? 700 : 500}>
                            {item.order}. {item.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ opacity: active ? 0.9 : 0.6 }}>
                            {item.duration || 10} min
                          </Typography>
                        }
                      />
                    </ListItem>
                  )
                })}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
