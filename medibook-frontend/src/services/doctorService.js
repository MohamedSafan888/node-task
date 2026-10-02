import api from './api'

export const doctorService = {

  getAll: async (params) => {
    const { data } = await api.get('/doctors', { params })
    return data
  },

  getById: async (id) => {
    const { data } = await api.get(`/doctors/${id}`)
    return data
  },

  getAvailability: async (id) => {
    const { data } = await api.get(
      id === 'me'
        ? '/doctor/availability'
        : `/doctors/${id}/availability`
    )

    return data
  },

  updateProfile: async (payload) => {
    const { data } = await api.put('/doctor/profile', payload)
    return data
  },

  setAvailability: async (payload) => {
    const { data } = await api.post('/doctor/availability', payload)
    return data
  },

  getAppointments: async () => {
    const { data } = await api.get('/doctor/appointments')
    return data
  },

}