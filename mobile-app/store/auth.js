import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  init: async () => {
    try {
      const token = await SecureStore.getItemAsync('token')
      const user = await SecureStore.getItemAsync('user')
      if (token && user) {
        set({ token, user: JSON.parse(user), isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
    }
  },

  login: async (token, user) => {
    await SecureStore.setItemAsync('token', token)
    await SecureStore.setItemAsync('user', JSON.stringify(user))
    set({ token, user })
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token')
    await SecureStore.deleteItemAsync('user')
    set({ token: null, user: null })
  }
}))

