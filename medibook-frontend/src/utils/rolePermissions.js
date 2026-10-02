import { ROLES, ROUTES } from './constants'

export const ROUTE_PERMISSIONS = {
  [ROUTES.PROFILE]: [],
  [ROUTES.STUDENT_DASHBOARD]: [ROLES.STUDENT],
  [ROUTES.INSTRUCTOR_DASHBOARD]: [ROLES.INSTRUCTOR],
  [ROUTES.INSTRUCTOR_CREATE_COURSE]: [ROLES.INSTRUCTOR],
  [ROUTES.INSTRUCTOR_EDIT_COURSE]: [ROLES.INSTRUCTOR],
  [ROUTES.INSTRUCTOR_COURSE_STUDENTS]: [ROLES.INSTRUCTOR]
}

export const canAccess = (role, route) => {
  const allowed = ROUTE_PERMISSIONS[route]
  if (allowed === undefined) return true
  if (allowed.length === 0) return !!role
  return allowed.includes(role)
}

export const defaultRedirect = (role) => {
  switch (role) {
    case ROLES.INSTRUCTOR:
      return ROUTES.INSTRUCTOR_DASHBOARD
    case ROLES.STUDENT:
      return ROUTES.STUDENT_DASHBOARD
    default:
      return ROUTES.COURSES
  }
}
