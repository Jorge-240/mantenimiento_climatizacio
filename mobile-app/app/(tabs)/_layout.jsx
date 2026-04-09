"use client"

import { Tabs } from 'expo-router'
import { useAuthStore } from '../../store/auth'
import { useEffect } from 'react'

export default function TabsLayout() {
  const { user, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [])

  if (!user) {
    return null // Redirect by parent
  }

  const rol = user.rol.toLowerCase()

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name={rol} />
    </Tabs>
  )
}

