import api from './api'

export const authService = {
  login: async (creds) => {
    const { data } = await api.post('/auth/login', creds)
    return data
  },
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  },
  getProfile: async () => {
    const { data } = await api.get('/auth/me')
    return data.user
  },
  updateProfile: async (payload) => {
    const { data } = await api.put('/auth/update-profile', payload)
    return data.user
  },
  logout: () => {
    localStorage.removeItem('token')
  }
}
