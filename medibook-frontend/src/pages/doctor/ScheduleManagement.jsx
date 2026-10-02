import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  MenuItem,
  TextField,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material'

import { AddOutlined, DeleteOutlined } from '@mui/icons-material'
import { doctorService } from '../../services/doctorService'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../context/LanguageContext'
import { useSnackbar } from 'notistack'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const TIMES = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, '0')}:00`
)

const INIT = {
  day: 1,
  start_time: '08:00',
  end_time: '09:00'
}

export default function ScheduleManagement() {

  const { t } = useLang()
  const { enqueueSnackbar } = useSnackbar()

  const [slots, setSlots] = useState([])
  const [form, setForm] = useState(INIT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useTitle(t('manageAvailability'))


  // =========================
  // Load doctor's schedule
  // =========================

  const loadSlots = async () => {

    try {

      setError('')

      const data =
        await doctorService.getAvailability('me')

      console.log('Availability:', data)

      setSlots(
        Array.isArray(data)
          ? data
          : []
      )

    } catch (err) {

      console.error(
        'Failed to load availability:',
        err
      )

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        t('error')
      )
    }
  }


  useEffect(() => {
    loadSlots()
  }, [])


  // =========================
  // Add slot
  // =========================

  const handleAdd = async (e) => {

    e.preventDefault()

    setError('')

    // Validate time
    if (form.start_time >= form.end_time) {

      setError(
        'End time must be after start time'
      )

      return
    }

    setSaving(true)

    try {

      // Add slot
      await doctorService.setAvailability({

        day: Number(form.day),

        start_time: form.start_time,

        end_time: form.end_time,

        is_available: true

      })


      // Reload slots from backend
      await loadSlots()


      enqueueSnackbar(
        'Slot added!',
        {
          variant: 'success'
        }
      )


      // Reset form
      setForm(INIT)

    } catch (err) {

      console.error(
        'Failed to add slot:',
        err
      )

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        t('error')
      )

    } finally {

      setSaving(false)

    }
  }


  // =========================
  // Delete slot
  // =========================

  const handleDelete = async (slotId) => {

    try {

      /*
        IMPORTANT:
        This currently removes the slot
        only from the UI.

        Backend delete endpoint is not
        implemented yet.
      */

      setSlots(prev =>
        prev.filter(
          slot => slot.id !== slotId
        )
      )

      enqueueSnackbar(
        'Slot removed!',
        {
          variant: 'success'
        }
      )

    } catch (err) {

      console.error(
        'Failed to delete slot:',
        err
      )

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        t('error')
      )
    }
  }


  return (

    <Container maxWidth="lg">

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        {t('manageAvailability')}
      </Typography>


      <Grid container spacing={3}>


        {/* =========================
            Add Slot Form
        ========================= */}

        <Grid item xs={12} md={4}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
              >
                Add new slot
              </Typography>


              {error && (

                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                >
                  {error}
                </Alert>

              )}


              <Box
                component="form"
                onSubmit={handleAdd}
              >

                <Stack spacing={2}>


                  {/* Day */}

                  <TextField
                    select
                    label="Day"
                    value={form.day}
                    onChange={(e) =>
                      setForm(prev => ({
                        ...prev,
                        day: Number(
                          e.target.value
                        )
                      }))
                    }
                  >

                    {DAYS.map(
                      (day, index) => (

                        <MenuItem
                          key={index}
                          value={index}
                        >
                          {day}
                        </MenuItem>

                      )
                    )}

                  </TextField>


                  {/* Start time */}

                  <TextField
                    select
                    label="Start time"
                    value={form.start_time}
                    onChange={(e) =>
                      setForm(prev => ({
                        ...prev,
                        start_time:
                          e.target.value
                      }))
                    }
                  >

                    {TIMES.map(time => (

                      <MenuItem
                        key={time}
                        value={time}
                      >
                        {time}
                      </MenuItem>

                    ))}

                  </TextField>


                  {/* End time */}

                  <TextField
                    select
                    label="End time"
                    value={form.end_time}
                    onChange={(e) =>
                      setForm(prev => ({
                        ...prev,
                        end_time:
                          e.target.value
                      }))
                    }
                  >

                    {TIMES.map(time => (

                      <MenuItem
                        key={time}
                        value={time}
                      >
                        {time}
                      </MenuItem>

                    ))}

                  </TextField>


                  {/* Add button */}

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={
                      <AddOutlined />
                    }
                    disabled={saving}
                  >

                    {saving ? (

                      <CircularProgress
                        size={20}
                        color="inherit"
                      />

                    ) : (

                      'Add slot'

                    )}

                  </Button>

                </Stack>

              </Box>

            </CardContent>

          </Card>

        </Grid>


        {/* =========================
            Existing Slots
        ========================= */}

        <Grid item xs={12} md={8}>

          <Card>

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
              >
                Your schedule
              </Typography>


              {slots.length === 0 ? (

                <Typography
                  color="text.secondary"
                  sx={{
                    py: 3,
                    textAlign: 'center'
                  }}
                >
                  No slots added yet.
                </Typography>

              ) : (

                DAYS.map(
                  (day, dayIdx) => {

                    const daySlots =
                      slots.filter(
                        slot =>
                          Number(
                            slot.day
                          ) === dayIdx
                      )


                    if (
                      !daySlots.length
                    ) {
                      return null
                    }


                    return (

                      <Box
                        key={dayIdx}
                        mb={2}
                      >

                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          mb={1}
                        >
                          {day}
                        </Typography>


                        <Stack
                          direction="row"
                          flexWrap="wrap"
                          gap={1}
                        >

                          {daySlots.map(
                            slot => (

                              <Chip
                                key={slot.id}
                                label={`${slot.start_time} – ${slot.end_time}`}
                                color={
                                  slot.is_available
                                    ? 'success'
                                    : 'default'
                                }
                                variant="outlined"
                                onDelete={() =>
                                  handleDelete(
                                    slot.id
                                  )
                                }
                                deleteIcon={
                                  <DeleteOutlined
                                    fontSize="small"
                                  />
                                }
                              />

                            )
                          )}

                        </Stack>

                      </Box>

                    )
                  }
                )

              )}

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Container>
  )
}