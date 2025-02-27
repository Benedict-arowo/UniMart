"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Notification {
  id: number
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (id: number) => void
  clearNotification: (id: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Fetch notifications from API
    // This is a mock implementation
    setNotifications([
      { id: 1, message: "Welcome to UniMarket!", type: "info", read: false, timestamp: new Date() },
      {
        id: 2,
        message: "Your item has been listed successfully.",
        type: "success",
        read: false,
        timestamp: new Date(),
      },
    ])
  }, [])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: notifications.length + 1,
      timestamp: new Date(),
    }
    setNotifications([newNotification, ...notifications])
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const clearNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

