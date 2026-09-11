import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USER_KEY = 'icytales-user'
const REGISTERED_KEY = 'icytales-registered'

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser)

  function login(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    localStorage.setItem(REGISTERED_KEY, 'true')
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  function markRegistered() {
    localStorage.setItem(REGISTERED_KEY, 'true')
  }

  function hasRegisteredOnThisBrowser() {
    return localStorage.getItem(REGISTERED_KEY) === 'true'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, markRegistered, hasRegisteredOnThisBrowser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
