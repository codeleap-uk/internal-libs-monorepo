import { create } from 'zustand'
import { IAppVariants, ITheme } from '../types'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IS_MOBILE, STORES_PERSIST_VERSION } from './constants'
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
    migrate: () => {
      return {
        value: 'default',
      }
    },
    storage: createJSONStorage(() => {
      if (IS_MOBILE) {
        return AsyncStorage
      }

      return localStorage
    })
  },
))
