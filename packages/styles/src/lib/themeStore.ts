import { create } from 'zustand'
import { IAppVariants, ITheme } from '../types'
import { createJSONStorage, persist } from 'zustand/middleware'
import { STORES_PERSIST_VERSION } from './store'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ThemeStore = {
  colorScheme: string | null
  current: ITheme | null
  variants: IAppVariants
}

export const themeStore = create<ThemeStore>(() => ({
  colorScheme: null,
  current: null,
  variants: {},
}))

export type ColorSchemaStore = {
  value: string
}

export const colorSchemaStore = create(persist<ColorSchemaStore>(
  () => ({
    value: 'default'
  }),
  {
    name: '@styles.stores.colorSchema',
    version: STORES_PERSIST_VERSION,
    storage: createJSONStorage(() => {
      if (typeof localStorage === 'undefined') {
        return AsyncStorage
      }

      return localStorage
    })
  },
))
