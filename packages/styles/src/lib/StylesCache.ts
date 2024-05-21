import { Cache } from './Cacher'
import { hashKey } from './hashKey'
import { CacheStore, cacheStore } from './cacheStore'
import { STORE_CACHE_ENABLED, STORES_PERSIST_VERSION, CACHE_ENABLED, STORED_CACHES } from './constants'
import { CacheType } from '../types/cache'
import { minifier } from './minifier'

export class StylesCache {
  baseKey: string

  variants = new Cache()
  common = new Cache()
  styles = new Cache()
  compositions = new Cache()
  responsive = new Cache()
  components = new Cache()

  store: CacheStore

  constructor() {
    this.registerStoredCache()
  }

  async registerStoredCache() {
    const hasHydrated = cacheStore.persist.hasHydrated()

    if (hasHydrated) {
      this.store = cacheStore.getState()
    } else {
      await cacheStore.persist.rehydrate()
      this.store = cacheStore.getState()
    }

    if (!STORE_CACHE_ENABLED) return

    const currentTime = new Date()
    const staleTime = new Date(this.store.staleTime)

    const isStaled = currentTime > staleTime

    if (isStaled) {
      this.store.rehydrate()
      return
    }

    for (const cachedType in this.store.cached) {
      const cachedValue = this.store.cached[cachedType]

      if (typeof cachedValue === 'object') {
        this[cachedType as CacheType].setCache(cachedValue)
      }
    }
  }

  registerBaseKey(keys: Array<any>) {
    keys.push(STORES_PERSIST_VERSION)

    const baseKey = hashKey(keys)

    this.baseKey = baseKey

    return baseKey
  }

  wipeCache() {
    this.components.clear()
    this.responsive.clear()
    this.compositions.clear()
    this.variants.clear()
    this.common.clear()
    this.styles.clear()
    
    cacheStore.persist.clearStorage()
  }

  keyFor(type: CacheType, keyData: Array<any> | any) {
    const cache = this[type]

    const values = [this.baseKey, keyData]

    const cacheKey = hashKey(values)
    const cachedValue = minifier.decompress(cache.cache[cacheKey] ?? null)

    return {
      key: cacheKey,
      value: cachedValue,
    }
  }

  cacheFor(type: CacheType, key: string, value: any) {
    if (!CACHE_ENABLED) {
      return value
    }

    const cache = this[type]

    const minifiedValue = minifier.compress(value)

    if (STORED_CACHES.includes(type) && STORE_CACHE_ENABLED && !!this.store) {
      this.store.cacheFor(type, key, minifiedValue)
    }

    return cache.cacheFor(key, minifiedValue)
  }
}
