import { CacheType } from '../types/cache'
import { StateStorage } from '../types/store'
import { StyleConstants } from '../constants'
import { hashKey } from '../tools'

/**
 * Generates a stale time date by adding 7 days to the current date
 * @returns {Date} The future date representing the stale time
 */
function generateStaleTime() {
  const time = 7

  let currentTime = new Date()

  currentTime.setDate(currentTime.getDate() + time)

  return currentTime
}

/**
 * Generic cache implementation with persistence and stale time management
 * @template T - The type of values stored in the cache
 */
export class Cache<T extends any = any> {
  /** In-memory cache storage */
  cache: Record<string, T> = {}

  /** Debounce timer for batch persistence */
  private persistTimer: NodeJS.Timer | null = null

  /** Debounce delay in milliseconds */
  private persistDelay: number = 4500

  /**
   * Gets the persistence key for cache data
   * @returns {string} The storage key for cache data
   */
  get persistKeyCache() {
    return `@styles.caches.${this.registryName}.cache`
  }

  /**
   * Gets the persistence key for stale time
   * @returns {string} The storage key for stale time
   */
  get persistKeyStaleTime() {
    return `@styles.caches.${this.registryName}.staleTime`
  }

  /**
   * Creates a new Cache instance
   * @param {CacheType} registryName - The name/type of the cache registry
   * @param {StateStorage} [storage=null] - The storage implementation for persistence
   * @param {boolean} [persistCache=!!storage] - Whether to persist cache to storage
   */
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

    if (StyleConstants.LOG) {
      console.log('Cache [constructor] ->', { persistedCache, persistedStaleTime, registryName })
    }

    this.setCache(persistedCache)
    this.storeStaleTime(persistedStaleTime)
  }

  /**
   * Generates a cache key and retrieves the cached value
   * @param {string} cacheBaseKey - The base key for cache generation
   * @param {Array<any> | any} data - The data to use for key generation
   * @returns {{ key: string, value: T | null }} Object containing the cache key and value
   */
  keyFor(cacheBaseKey: string, data: Array<any> | any) {
    const values = [cacheBaseKey, data]

    const cacheKey = hashKey(values)
    const cachedValue = this.cache[cacheKey] ?? null

    return {
      key: cacheKey,
      value: cachedValue,
    }
  }

  /**
   * Stores a value in the cache and optionally persists it
   * @param {string} key - The cache key
   * @param {T} cache - The value to cache
   * @returns {T} The cached value
   */
  cacheFor(key: string, cache: T) {
    this.cache[key] = cache

    if (this.persistCache) {
      this.schedulePersist()
    }

    return cache
  }

  /**
   * Replaces the entire cache with new data
   * @param {Record<string, T>} cache - The new cache data
   */
  setCache(cache: Record<string, T>) {
    this.cache = cache ?? {}
  }

  /**
   * Clears both in-memory and persistent cache
   */
  clear() {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer)
      this.persistTimer = null
    }

    this.cache = {}
    this.clearStorage()
  }

  /**
   * Schedules cache persistence with debounce
   */
   private schedulePersist() {
    if (this.persistTimer) {
      clearTimeout(this.persistTimer)
    }
    
    this.persistTimer = setTimeout(() => {
      this.storeCache()
      this.persistTimer = null
    }, this.persistDelay)
  }

  /**
   * Loads cache data and stale time from persistent storage
   * @returns {{ persistedStaleTime: Date, persistedCache: any }} Loaded data from storage
   */
  loadStorage() {
    if (!this.persistCache) return { persistedStaleTime: generateStaleTime(), persistedCache: {} }

    const persistedStaleTime = this.storage.getItem(this.persistKeyStaleTime)
    const persistedCache = this.storage.getItem(this.persistKeyCache)

    return {
      persistedStaleTime: !persistedStaleTime ? generateStaleTime() : new Date(persistedStaleTime),
      persistedCache,
    }
  }

  /**
   * Clears cache data from persistent storage
   */
  clearStorage() {
    if (!this.persistCache) return

    this.storage.removeItem(this.persistKeyStaleTime)
    this.storage.removeItem(this.persistKeyCache)
  }

  /**
   * Stores cache data to persistent storage
   * @param {Record<string, T>} [cache=null] - Cache data to store (uses current cache if not provided)
   */
  storeCache(cache: Record<string, T> = null) {
    if (!this.persistCache) return

    const value = cache ?? this.cache
    this.storage.setItem(this.persistKeyCache, value)
  }

  /**
   * Stores stale time to persistent storage
   * @param {Date} staleTime - The stale time to store
   */
  storeStaleTime(staleTime: Date) {
    if (!this.persistCache) return

    const value = staleTime.toISOString()
    this.storage.setItem(this.persistKeyStaleTime, value)
  }
}
