import { useState, useEffect, useCallback } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Container, Box, Typography, Button, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, LinearProgress, CircularProgress, Chip
} from '@mui/material'
import { ArrowBack, School } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { courseService } from '../../services/courseService'

export default function CourseStudents() {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const [students, setStudents] = useState([])
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStudents = useCallback(async () => {
    try {
      const [courseData, studentsData] = await Promise.all([
        courseService.getCourseById(id),
        courseService.getCourseStudents(id)
      ])
      setCourse(courseData)
      setStudents(studentsData || [])
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Failed to load enrolled students', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [id, enqueueSnackbar])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

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
        <Button
          component={RouterLink}
          to="/instructor/dashboard"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
          color="inherit"
        >
          Back to Instructor Studio
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Enrolled Students
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Course: <strong>{course?.title}</strong> ({students.length} students enrolled)
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          {students.length === 0 ? (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <School sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                No students have enrolled in this course yet.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell fontWeight={700}>Student</TableCell>
                    <TableCell fontWeight={700}>Email</TableCell>
                    <TableCell fontWeight={700}>Progress</TableCell>
                    <TableCell fontWeight={700}>Completed Lessons</TableCell>
                    <TableCell fontWeight={700}>Enrolled Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((item) => (
                    <TableRow key={item.enrollmentId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={item.student?.avatar} sx={{ width: 34, height: 34 }}>
                            {item.student?.name?.[0]}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {item.student?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.student?.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 150 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={item.progress || 0}
                            color={item.progress === 100 ? 'success' : 'primary'}
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" fontWeight={700}>
                            {item.progress || 0}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${item.completedLessonsCount} completed`}
                          size="small"
                          color={item.progress === 100 ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.enrolledAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
