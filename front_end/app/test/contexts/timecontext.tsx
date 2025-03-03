"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface TimeContextType {
  now: Date
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

export function TimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 100) // Update every 100ms for smoother transitions

    return () => clearInterval(interval)
  }, [])

  return <TimeContext.Provider value={{ now }}>{children}</TimeContext.Provider>
}

export function useTime() {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error("useTime must be used within a TimeProvider")
  }
  return context
}

