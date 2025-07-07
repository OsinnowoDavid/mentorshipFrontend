import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [] 
}) => {
  const { user, isAuthenticated, token } = useAuth()
  const location = useLocation()

  // If authentication is not required, render children directly
  if (!requireAuth) {
    return <>{children}</>
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user exists but no roles are specified, allow access
  if (allowedRoles.length === 0) {
    return <>{children}</>
  }

  // Check if user has required role
  if (user && user.role && allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  // If user doesn't have required role, redirect to unauthorized page
  return <Navigate to="/unauthorized" replace />
}

export default ProtectedRoute 