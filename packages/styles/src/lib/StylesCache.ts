import { Cache } from './Cache'
import { hashKey } from './hashKey'
import { CacheStore, cacheStore } from './cacheStore'
import { STORES_PERSIST_VERSION } from './constants'
import { CacheType } from '../types/cache'

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
    this.registryStoredCache()
  }

  async registryStoredCache() {
    const hasHydrated = cacheStore.persist.hasHydrated()

    if (hasHydrated) {
      this.store = cacheStore.getState()
    } else {
      await cacheStore.persist.rehydrate()
      this.store = cacheStore.getState()
    }

    for (const cachedType in this.store.cached) {
      const cachedValue = this.store.cached[cachedType]

      console.log('CACHED ' + cachedType, cachedValue)

      if (typeof cachedValue === 'object') {
        this[cachedType as CacheType].setCache(cachedValue)
      }
    }
  }

  registryBaseKey(values: Array<any>) {
    const key = values.concat([STORES_PERSIST_VERSION])

    const baseKey = hashKey(key)

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

    return cache.keyFor(this.baseKey, keyData)
  }

  cacheFor(type: CacheType, key: string, value: any) {
    const cache = this[type]

    this.store.cacheFor(type, key, value)

    return cache.cacheFor(key, value)
  }
}
