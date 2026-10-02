import api from './api'
export const adminService = {
  getUsers:       async (params) => { const {data} = await api.get('/admin/users', {params});           return data },
  updateUser:     async (id, payload) => { const {data} = await api.put(`/admin/users/${id}`, payload); return data },
  getSpecialties: async ()        => { const {data} = await api.get('/admin/specialties');               return data },
  addSpecialty:   async (payload) => { const {data} = await api.post('/admin/specialties', payload);     return data },
  deleteSpecialty:async (id)      => { const {data} = await api.delete(`/admin/specialties/${id}`);      return data },
  getAllAppointments: async ()     => { const {data} = await api.get('/admin/appointments');              return data },
}
