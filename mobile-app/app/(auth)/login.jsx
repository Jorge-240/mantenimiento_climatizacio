"use client"

import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Link, router } from 'expo-router'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const loginAction = useAuthStore((state) => state.login)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      loginAction(token, user)
      router.replace('/(tabs)')
    } catch (err) {
      setError(err.response?.data?.error || 'Error en login')
    }
    setLoading(false)
  }

  return (
    <View className="flex-1 justify-center p-8 bg-gradient-to-b from-blue-500 to-purple-600">
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-white mb-2">Mantenimiento</Text>
        <Text className="text-xl text-blue-100">SENA ADSO</Text>
      </View>

      <View className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 space-y-6">
        {error ? (
          <View className="bg-red-500/20 border border-red-500 p-4 rounded-xl">
            <Text className="text-red-200 text-center">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-2">
          <Text className="text-white/90 font-medium ml-4">Email</Text>
          <TextInput
            className="bg-white/30 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-200"
            placeholder="admin@sena.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View className="space-y-2">
          <Text className="text-white/90 font-medium ml-4">Contraseña</Text>
          <TextInput
            className="bg-white/30 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-gray-200"
            placeholder="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          className="bg-white rounded-xl p-4 items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#3b82f6" />
          ) : (
            <Text className="text-blue-600 font-bold text-lg">Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View className="pt-6">
          <Text className="text-center text-white/70 text-sm">
            Demo: admin@sena.com / password
          </Text>
        </View>
      </View>
    </View>
  )
}

