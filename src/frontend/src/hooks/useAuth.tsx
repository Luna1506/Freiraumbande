import { createContext, useContext, useState, ReactNode } from 'react'
import { authService } from '../services/authService'

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('fb_token'))

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password)
    localStorage.setItem('fb_token', response.accessToken)
    setToken(response.accessToken)
  }

  const logout = () => {
    localStorage.removeItem('fb_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden')
  return ctx
}
