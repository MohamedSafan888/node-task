import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { defaultRedirect } from '../utils/rolePermissions'

export default function RoleRoute({ roles = [], children }) {
  const { role } = useAuth()
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to={defaultRedirect(role)} replace />
  }
  return children
}
