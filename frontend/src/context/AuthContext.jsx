import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const USER_KEY = 'icytales-user'
const TOKEN_KEY = 'icytales-token'
const REGISTERED_KEY = 'icytales-registered'

function getSavedUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  function login(userData, authToken) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    if (authToken) localStorage.setItem(TOKEN_KEY, authToken)
    localStorage.setItem(REGISTERED_KEY, 'true')
    setToken(authToken || localStorage.getItem(TOKEN_KEY))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem(USER_KEY); localStorage.removeItem(TOKEN_KEY); setUser(null); setToken(null)
  }

  function markRegistered() { localStorage.setItem(REGISTERED_KEY, 'true') }
  function hasRegisteredOnThisBrowser() { return localStorage.getItem(REGISTERED_KEY) === 'true' }

  return <AuthContext.Provider value={{ user, token, login, logout, markRegistered, hasRegisteredOnThisBrowser }}>
    {children}
  </AuthContext.Provider>
}
export function useAuth() { return useContext(AuthContext) }
