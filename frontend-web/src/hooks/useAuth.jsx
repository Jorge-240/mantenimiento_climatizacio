import { useState, useEffect, useContext, createContext } from 'react'
import { api } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.rol) {
          api.defaults.headers.Authorization = `Bearer ${token}`
          setUser(parsedUser)
        } else {
          // Si hay token pero el usuario no tiene rol, limpiar para evitar crashes
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      api.defaults.headers.Authorization = `Bearer ${token}`
      setUser(user)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Error login' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

