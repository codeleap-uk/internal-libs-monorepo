import { CacheType } from '../types/cache'
import { StateStorage } from '../types/store'
import { StyleConstants } from '../constants'
import { hashKey } from '../tools'

function getStaleTime() {
  const time = 7

  let currentTime = new Date()

  currentTime.setDate(currentTime.getDate() + time)

  return currentTime
}

export class Cache<T extends any = any> {
  cache: Record<string, T> = {}

  get persistKeyCache() {
    return `@styles.caches.${this.registryName}.cache`
  }

  get persistKeyStaleTime() {
    return `@styles.caches.${this.registryName}.staleTime`
  }

  constructor(
    public registryName: CacheType,
    private storage: StateStorage = null,
    public persistCache: boolean = !!storage,
  ) {
    if (!persistCache || !StyleConstants.STORE_CACHE_ENABLED) return

    const { persistedCache, persistedStaleTime } = this.loadStorage()

    const currentTime = new Date()

    const isStaled = currentTime > persistedStaleTime

    if (isStaled) {
      this.clearStorage()
      return
    }

    this.setCache(persistedCache)
    this.storeStaleTime(persistedStaleTime)
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
    if (this.persistCache) this.storeCache()
    return cache
  }

  // utils

  setCache(cache: Record<string, T>) {
    this.cache = cache ?? {}
  }

  clear() {
    this.cache = {}
    this.clearStorage()
  }

  // storage

  loadStorage() {
    if (!this.persistCache) return

    const persistedStaleTime = this.storage.getItem(this.persistKeyStaleTime)
    const persistedCache = this.storage.getItem(this.persistKeyCache)

    return {
      persistedStaleTime: !persistedStaleTime ? getStaleTime() : new Date(persistedStaleTime),
      persistedCache,
    }
  }

  clearStorage() {
    if (!this.persistCache) return

    this.storage.removeItem(this.persistKeyStaleTime)
    this.storage.removeItem(this.persistKeyCache)
  }

  storeCache(cache: Record<string, T> = null) {
    if (!this.persistCache) return

    const value = cache ?? this.cache
    this.storage.setItem(this.persistKeyCache, value)
  }

  storeStaleTime(staleTime: Date) {
    if (!this.persistCache) return

    const value = staleTime.toISOString()
    this.storage.setItem(this.persistKeyStaleTime, value)
  }
}
