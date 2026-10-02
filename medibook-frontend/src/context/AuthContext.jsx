import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    authService.getProfile()
      .then(data => setUser(data))
      .catch(() => { localStorage.removeItem('token'); setToken(null); setUser(null) })
      .finally(() => setLoading(false))
  }, [token])

  const login = useCallback(async (credentials) => {
    setError(null)
    const data = await authService.login(credentials)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    setError(null)
    const data = await authService.register(payload)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((fields) => setUser(prev => ({ ...prev, ...fields })), [])

  return (
    <AuthContext.Provider value={{
      user, token, loading, error, setError,
      isAuthenticated: !!token && !!user,
      role: user?.role ?? null,
      login, register, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be inside <AuthProvider>')
  return ctx
}
