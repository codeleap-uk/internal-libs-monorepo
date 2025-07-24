import { Cache } from './Cacher'
import { hashKey } from './hashKey'
import { StyleConstants } from './constants'
import { CacheType } from '../types/cache'
import { minifier } from './minifier'
import { StateStorage } from '../types/store'

export class StyleCache {
  baseKey: string

  styles = new Cache('styles')

  compositions = new Cache('compositions')

  responsive = new Cache('responsive')

  variants: Cache

  common: Cache

  components: Cache

  constructor(storage: StateStorage) {
    this.variants = new Cache('variants', storage)
    this.common = new Cache('common', storage)
    this.components = new Cache('components', storage)
  }

  registerBaseKey(keys: Array<any>) {
    keys.push(StyleConstants.STORES_PERSIST_VERSION)

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
  }

  keyFor(type: CacheType, keyData: Array<any> | any) {
    const cache = this[type]

    const withFunctionsHash = Object.values(keyData).map((value) => {
      if (typeof value === 'function') {
        return value.toString()
      }

      return value
    })

    const values = [this.baseKey, ...withFunctionsHash]

    const cacheKey = hashKey(values)
    const cachedValue = minifier.decompress(cache.cache[cacheKey] ?? null)

    return {
      key: cacheKey,
      value: cachedValue,
    }
  }

  cacheFor(type: CacheType, key: string, value: any) {
    if (!StyleConstants.CACHE_ENABLED) {
      return value
    }

    const cache = this[type]

    const minifiedValue = minifier.compress(value)

    return cache.cacheFor(key, minifiedValue)
  }
}
