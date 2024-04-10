import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AnyRecord } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STORES_PERSIST_VERSION } from './constants'
import { CacheType } from '../types/cache'

export type CacheStore = {
  cached: Partial<Record<CacheType, AnyRecord>>
  cacheFor: (type: CacheType, key: string, value: any) => void
}

export const cacheStore = create(persist<CacheStore>(
  (set, get) => ({
    cached: {},
    cacheFor: (type, key, value) => set(store => {
      const cached = store.cached

      const newCache = cached[type] ?? {}

      newCache[key] = value

      cached[type] = newCache

      return {
        cached
      }
    }),
  }),
  {
    name: '@styles.stores.stylesRegistry',
    version: STORES_PERSIST_VERSION,
    migrate: (persistedState: CacheStore, version) => {
      if (version != STORES_PERSIST_VERSION) {
        persistedState.cached = {}

        return persistedState
      }

      return persistedState as CacheStore
    },
    storage: createJSONStorage(() => {
      if (typeof localStorage === 'undefined') {
        return AsyncStorage
      }

      return localStorage
    })
  },
))
