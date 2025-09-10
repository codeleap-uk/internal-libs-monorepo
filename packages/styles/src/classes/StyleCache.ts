import { Cache } from './Cacher'
import { hashKey, minifier } from '../tools'
import { StyleConstants } from '../constants'
import { CacheType } from '../types/cache'
import { StateStorage } from '../types/store'

/**
 * StyleCache manages multiple cache instances for different style-related data.
 * Provides centralized caching functionality with compression and key generation.
 */
export class StyleCache {
  /** Base key used for cache key generation */
  baseKey: string

  /** Cache for style data */
  styles = new Cache('styles')

  /** Cache for style compositions */
  compositions = new Cache('compositions')

  /** Cache for responsive styles */
  responsive = new Cache('responsive')

  /** Cache for style variants with persistent storage */
  variants: Cache

  /** Cache for common styles with persistent storage */
  common: Cache

  /** Cache for component styles with persistent storage */
  components: Cache

  /**
   * Creates a new StyleCache instance
   * @param storage - State storage instance for persistent caches
   */
  constructor(storage: StateStorage) {
    this.variants = new Cache('variants', storage)
    this.common = new Cache('common', storage)
    this.components = new Cache('components', storage)
  }

  /**
   * Registers and generates a base key for cache operations
   * @param keys - Array of values to include in base key generation
   * @returns The generated base key hash
   */
  registerBaseKey(keys: Array<any>): string {
    keys.push(StyleConstants.STORES_PERSIST_VERSION)

    const baseKey = hashKey(keys)

    this.baseKey = baseKey

    return baseKey
  }

  /**
   * Clears all cache instances
   */
  wipeCache(): void {
    this.components.clear()
    this.responsive.clear()
    this.compositions.clear()
    this.variants.clear()
    this.common.clear()
    this.styles.clear()
  }

  /**
   * Generates a cache key and retrieves cached value if exists
   * @param type - The cache type to use
   * @param keyData - Data to use for key generation (array or object)
   * @returns Object containing the generated key and cached value (if any)
   */
  keyFor(type: CacheType, keyData: Array<any> | any): { key: string; value: any } {
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

  /**
   * Stores a value in the specified cache with compression
   * @param type - The cache type to use
   * @param key - Cache key
   * @param value - Value to cache
   * @returns The cached value (compressed if caching is enabled)
   */
  cacheFor(type: CacheType, key: string, value: any): any {
    if (!StyleConstants.CACHE_ENABLED) {
      return value
    }

    const cache = this[type]

    const minifiedValue = minifier.compress(value)

    return cache.cacheFor(key, minifiedValue)
  }
}
