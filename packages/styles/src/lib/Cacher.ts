import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { AnyRecord } from '../types'
import { CacheType } from '../types/cache'
import { STORES_PERSIST_VERSION, STORE_CACHE_ENABLED } from './constants'
import { hashKey } from './hashKey'

function getStaleTime() {
  const time = 7

  let currentTime = new Date()

  currentTime.setDate(currentTime.getDate() + time)

  return currentTime
}

type StorePersistor = {
  cached: AnyRecord
  cacheFor: (key: string, value: any) => void
  staleTime: Date
  reset: () => void
}

export class Cache<T extends any = any> {
  cache: Record<string, T> = {}

  persistor = null

  store: StorePersistor = {
    cached: {},
    cacheFor: () => null,
    reset: () => null,
    staleTime: null
  }

  constructor(
    public registryName: CacheType,
    private storage: StateStorage = null,
    public persistCache: boolean = !!storage,
  ) {
    if (!persistCache) return

    this.createPersistor(registryName)
    
    if (!STORE_CACHE_ENABLED || !this.persistor) return

    const currentTime = new Date()
    const staleTime = new Date(this.store.staleTime)

    const isStaled = currentTime > staleTime

    if (isStaled) {
      this.store.reset()
      return
    }

    this.setCache(this.store.cached)
  }

  keyFor(cacheBaseKey: string, data: Array<any> | any) {
    const values = [cacheBaseKey, data]

    const cacheKey = hashKey(values)
    const cachedValue = this.cache[cacheKey] ?? null

    return {
      key: cacheKey,
      value: cachedValue,
    }
  }

  cacheFor(key: string, cache: T) {
    this.cache[key] = cache
    if (this.persistCache) this.store.cacheFor(key, cache)
    return cache
  }

  setCache(cache: Record<string, T>) {
    this.cache = cache
  }

  clear() {
    this.cache = {}
    if (this.persistCache) this.persistor.persist.clearStorage()
  }

  createPersistor(registryName: string) {
    if (!this.persistCache) return null

    const persistor = create(persist<StorePersistor>(
      (set, get) => ({
        staleTime: getStaleTime(),
        cached: {},
        cacheFor: (key, value) => set(store => {
          const cached = store.cached

          cached[key] = value
    
          return {
            cached
          }
        }),
        reset: () => set({
          cached: {},
          staleTime: getStaleTime()
        })
      }),
      {
        name: `@styles.caches.${registryName}`,
        version: STORES_PERSIST_VERSION,
        migrate: (persistedState: StorePersistor, version) => {
          if (version != STORES_PERSIST_VERSION) {
            persistedState.staleTime = getStaleTime()
            persistedState.cached = {}
    
            return persistedState
          }
    
          return persistedState as StorePersistor
        },
        storage: createJSONStorage(() => this.storage),
      }
    ))

    this.persistor = persistor
    this.store = persistor.getState()

    return persistor
  }
}
