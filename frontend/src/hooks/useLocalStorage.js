import { useEffect, useState } from 'react'

// Small helper so any piece of state can persist itself to localStorage
// without every context having to re-implement the same read/write logic.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.warn(`Could not read localStorage key "${key}":`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Could not write localStorage key "${key}":`, err)
    }
  }, [key, value])

  return [value, setValue]
}
