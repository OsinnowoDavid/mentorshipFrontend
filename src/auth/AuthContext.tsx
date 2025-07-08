import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import axios from 'axios'
import { useShopContext } from '../context'

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const fetchUserData = async (token: string) => {
      try {
        const context = useShopContext();
        const backendUrl = context?.backendUrl || '';
        const response = await axios.get(`${backendUrl}/api/auth/getUserData`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data.user)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
      }
    }
    if (storedToken) {
      setToken(storedToken)
      fetchUserData(storedToken)
    } else if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = (newToken: string, userData: User) => {
    setToken(newToken)
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.error('Logout API call failed:', response.statusText)
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Always clear local state regardless of API call success
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 