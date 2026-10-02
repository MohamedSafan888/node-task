import api from './api'
export const appointmentService = {
  book:         async (payload) => { const {data} = await api.post('/appointments/book', payload);         return data },
  getMyAll:     async ()        => { const {data} = await api.get('/appointments');                        return data },
  updateStatus: async (id, status, notes) => {
    const {data} = await api.put(`/appointments/${id}/status`, { status, notes })
    return data
  },
}
