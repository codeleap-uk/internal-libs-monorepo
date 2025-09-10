import { describe, test, expect, beforeEach, mock } from 'bun:test'
import { Cache } from '../Cacher'
import { hashKey } from '../../tools'

interface MockStateStorage {
  getItem: (key: string) => any
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
}

describe('Cache', () => {
  let cache: Cache<string>
  let mockStorageInstance: MockStateStorage

  beforeEach(() => {
    mockStorageInstance = {
      getItem: mock(() => null),
      setItem: mock(() => {}),
      removeItem: mock(() => {}),
    }
  })

  describe('Constructor', () => {
    test('should create cache without persistence when storage is null', () => {
      cache = new Cache<string>('styles', null, false)
      
      expect(cache.registryName).toBe('styles')
      expect(cache.persistCache).toBe(false)
      expect(cache.cache).toEqual({})
    })

    test('should create cache with persistence enabled by default when storage is provided', () => {
      cache = new Cache<string>('components', mockStorageInstance)
      
      expect(cache.registryName).toBe('components')
      expect(cache.persistCache).toBe(true)
    })

    test('should load persisted cache when not staled', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      const persistedCache = { 'key1': 'value1' }
      
      mockStorageInstance.getItem = mock((key: string) => {
        if (key.includes('staleTime')) return futureDate.toISOString()
        if (key.includes('cache')) return persistedCache
        return null
      })
      
      cache = new Cache<string>('styles', mockStorageInstance)
      
      expect(cache.cache).toEqual(persistedCache)
    })

    test('should clear storage and not load cache when staled', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      const persistedCache = { 'key1': 'value1' }
      
      mockStorageInstance.getItem = mock((key: string) => {
        if (key.includes('staleTime')) return pastDate.toISOString()
        if (key.includes('cache')) return persistedCache
        return null
      })
      
      cache = new Cache<string>('styles', mockStorageInstance)
      
      expect(mockStorageInstance.removeItem).toHaveBeenCalledTimes(2)
      expect(cache.cache).toEqual({})
    })
  })

  describe('Persistence Keys', () => {
    beforeEach(() => {
      cache = new Cache<string>('components', mockStorageInstance)
    })

    test('should generate correct persistence key for cache', () => {
      expect(cache.persistKeyCache).toBe('@styles.caches.components.cache')
    })

    test('should generate correct persistence key for stale time', () => {
      expect(cache.persistKeyStaleTime).toBe('@styles.caches.components.staleTime')
    })
  })

  describe('keyFor', () => {
    beforeEach(() => {
      cache = new Cache<string>('styles', null, false)
    })

    test('should generate cache key and return null for non-existent value', () => {
      const result = cache.keyFor('base-key', ['data1', 'data2'])
      const expectedKey = hashKey(['base-key', ['data1', 'data2']])
      
      expect(result.key).toBe(expectedKey)
      expect(result.value).toBeNull()
    })

    test('should return existing cached value', () => {
      const cacheKey = hashKey(['base-key', 'data'])
      const testValue = 'cached-value'
      
      // Set up the cache with a known value
      cache.cache[cacheKey] = testValue
      
      const result = cache.keyFor('base-key', 'data')
      
      expect(result.key).toBe(cacheKey)
      expect(result.value).toBe(testValue)
    })
  })

  describe('cacheFor', () => {
    test('should store value in memory cache without persistence', () => {
      cache = new Cache<string>('styles', null, false)
      
      const result = cache.cacheFor('test-key', 'test-value')
      
      expect(cache.cache['test-key']).toBe('test-value')
      expect(result).toBe('test-value')
    })

    test('should store value and persist to storage when persistence enabled', () => {
      cache = new Cache<string>('styles', mockStorageInstance)
      
      const result = cache.cacheFor('test-key', 'test-value')
      
      expect(cache.cache['test-key']).toBe('test-value')
      expect(mockStorageInstance.setItem).toHaveBeenCalledWith(
        '@styles.caches.styles.cache',
        { 'test-key': 'test-value' }
      )
      expect(result).toBe('test-value')
    })
  })

  describe('setCache', () => {
    beforeEach(() => {
      cache = new Cache<string>('styles', null, false)
    })

    test('should replace entire cache with new data', () => {
      cache.cache = { 'old-key': 'old-value' }
      const newCache = { 'new-key': 'new-value', 'another-key': 'another-value' }
      
      cache.setCache(newCache)
      
      expect(cache.cache).toEqual(newCache)
    })

    test('should set empty object when null is passed', () => {
      cache.cache = { 'some-key': 'some-value' }
      
      cache.setCache(null as any)
      
      expect(cache.cache).toEqual({})
    })
  })

  describe('clear', () => {
    test('should clear memory cache and storage', () => {
      cache = new Cache<string>('styles', mockStorageInstance)
      cache.cache = { 'key1': 'value1', 'key2': 'value2' }
      
      cache.clear()
      
      expect(cache.cache).toEqual({})
      expect(mockStorageInstance.removeItem).toHaveBeenCalledWith('@styles.caches.styles.staleTime')
      expect(mockStorageInstance.removeItem).toHaveBeenCalledWith('@styles.caches.styles.cache')
    })

    test('should only clear memory cache when persistence disabled', () => {
      cache = new Cache<string>('styles', null, false)
      cache.cache = { 'key1': 'value1' }
      
      cache.clear()
      
      expect(cache.cache).toEqual({})
    })
  })

  describe('loadStorage', () => {
    test('should return default values when persistence disabled', () => {
      cache = new Cache<string>('styles', null, false)
      
      const result = cache.loadStorage()
      
      expect(result.persistedCache).toEqual({})
      expect(result.persistedStaleTime).toBeInstanceOf(Date)
      expect(result.persistedStaleTime.getTime()).toBeGreaterThan(new Date().getTime())
    })

    test('should load values from storage when available', () => {
      const testDate = new Date('2024-12-01T00:00:00Z')
      const testCache = { 'stored-key': 'stored-value' }
      
      mockStorageInstance.getItem = mock((key: string) => {
        if (key.includes('staleTime')) return testDate.toISOString()
        if (key.includes('cache')) return testCache
        return null
      })
      
      cache = new Cache<string>('styles', mockStorageInstance)
      const result = cache.loadStorage()
      
      expect(result.persistedStaleTime).toEqual(testDate)
      expect(result.persistedCache).toEqual(testCache)
    })

    test('should generate new stale time when not found in storage', () => {
      mockStorageInstance.getItem = mock((key: string) => {
        if (key.includes('staleTime')) return null
        if (key.includes('cache')) return { 'key': 'value' }
        return null
      })
      
      cache = new Cache<string>('styles', mockStorageInstance)
      const result = cache.loadStorage()
      
      expect(result.persistedStaleTime).toBeInstanceOf(Date)
      expect(result.persistedStaleTime.getTime()).toBeGreaterThan(new Date().getTime())
    })
  })

  describe('clearStorage', () => {
    test('should remove items from storage when persistence enabled', () => {
      cache = new Cache<string>('styles', mockStorageInstance)
      
      cache.clearStorage()
      
      expect(mockStorageInstance.removeItem).toHaveBeenCalledWith('@styles.caches.styles.staleTime')
      expect(mockStorageInstance.removeItem).toHaveBeenCalledWith('@styles.caches.styles.cache')
    })

    test('should do nothing when persistence disabled', () => {
      cache = new Cache<string>('styles', null, false)
      
      cache.clearStorage()
      
      // Should not throw or call any storage methods
      expect(true).toBe(true)
    })
  })

  describe('storeCache', () => {
    beforeEach(() => {
      cache = new Cache<string>('styles', mockStorageInstance)
    })

    test('should store current cache when no parameter provided', () => {
      cache.cache = { 'current-key': 'current-value' }
      
      cache.storeCache()
      
      expect(mockStorageInstance.setItem).toHaveBeenCalledWith(
        '@styles.caches.styles.cache',
        { 'current-key': 'current-value' }
      )
    })

    test('should store provided cache parameter', () => {
      const customCache = { 'custom-key': 'custom-value' }
      
      cache.storeCache(customCache)
      
      expect(mockStorageInstance.setItem).toHaveBeenCalledWith(
        '@styles.caches.styles.cache',
        customCache
      )
    })

    test('should do nothing when persistence disabled', () => {
      cache = new Cache<string>('styles', null, false)
      cache.cache = { 'key': 'value' }
      
      cache.storeCache()
      
      // Should not throw or call any storage methods
      expect(true).toBe(true)
    })
  })

  describe('storeStaleTime', () => {
    test('should store stale time as ISO string when persistence enabled', () => {
      cache = new Cache<string>('styles', mockStorageInstance)
      const testDate = new Date('2024-12-01T00:00:00Z')
      
      cache.storeStaleTime(testDate)
      
      expect(mockStorageInstance.setItem).toHaveBeenCalledWith(
        '@styles.caches.styles.staleTime',
        '2024-12-01T00:00:00.000Z'
      )
    })

    test('should do nothing when persistence disabled', () => {
      cache = new Cache<string>('styles', null, false)
      const testDate = new Date()
      
      cache.storeStaleTime(testDate)
      
      // Should not throw or call any storage methods
      expect(true).toBe(true)
    })
  })

  describe('generateStaleTime function', () => {
    test('should generate stale time 7 days in the future', () => {
      const startTime = new Date()
      cache = new Cache<string>('styles', null, false)
      
      const result = cache.loadStorage()
      const endTime = new Date()
      
      // Verify the stale time is approximately 7 days from now
      const expectedMinTime = new Date(startTime)
      expectedMinTime.setDate(expectedMinTime.getDate() + 7)
      
      const expectedMaxTime = new Date(endTime)
      expectedMaxTime.setDate(expectedMaxTime.getDate() + 7)
      
      expect(result.persistedStaleTime.getTime()).toBeGreaterThanOrEqual(expectedMinTime.getTime())
      expect(result.persistedStaleTime.getTime()).toBeLessThanOrEqual(expectedMaxTime.getTime())
    })
  })

  describe('Integration tests', () => {
    test('should handle full cache lifecycle with persistence', () => {
      // Initial setup with fresh cache
      mockStorageInstance.getItem = mock(() => null)
      cache = new Cache<string>('compositions', mockStorageInstance)
      
      // Add some data
      const { key } = cache.keyFor('test-base', 'test-data')
      cache.cacheFor(key, 'test-value')
      
      // Verify the value is cached
      const { value } = cache.keyFor('test-base', 'test-data')
      expect(value).toBe('test-value')
      
      // Verify storage was called
      expect(mockStorageInstance.setItem).toHaveBeenCalled()
      
      // Clear cache
      cache.clear()
      expect(cache.cache).toEqual({})
      expect(mockStorageInstance.removeItem).toHaveBeenCalledTimes(2)
    })

    test('should handle cache restoration from storage', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      const storedCache = { 'stored-key': 'stored-value' }
      
      mockStorageInstance.getItem = mock((key: string) => {
        if (key.includes('staleTime')) return futureDate.toISOString()
        if (key.includes('cache')) return storedCache
        return null
      })
      
      cache = new Cache<string>('responsive', mockStorageInstance)
      
      expect(cache.cache).toEqual(storedCache)
      
      // Should be able to retrieve the stored value
      const cachedValue = cache.cache['stored-key']
      expect(cachedValue).toBe('stored-value')
    })
  })
})
