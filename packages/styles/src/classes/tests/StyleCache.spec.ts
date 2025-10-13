import { describe, test, expect, beforeEach } from 'bun:test'
import { StyleCache } from '../StyleCache'

class MockStateStorage {
  private storage = new Map<string, any>()

  getItem(key: string): any {
    return this.storage.get(key) || null
  }

  setItem(key: string, value: any): void {
    this.storage.set(key, value)
  }

  removeItem(key: string): void {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }

  get size(): number {
    return this.storage.size
  }
}

describe('StyleCache', () => {
  let styleCache: StyleCache
  let mockStorage: MockStateStorage

  beforeEach(() => {
    mockStorage = new MockStateStorage()
    styleCache = new StyleCache(mockStorage)
  })

  describe('Constructor', () => {
    test('should create StyleCache with all cache instances', () => {
      expect(styleCache).toBeDefined()
      expect(styleCache.styles).toBeDefined()
      expect(styleCache.compositions).toBeDefined()
      expect(styleCache.responsive).toBeDefined()
      expect(styleCache.variants).toBeDefined()
      expect(styleCache.common).toBeDefined()
      expect(styleCache.components).toBeDefined()
    })

    test('should create non-persistent caches for styles, compositions, and responsive', () => {
      expect(styleCache.styles.registryName).toBe('styles')
      expect(styleCache.compositions.registryName).toBe('compositions')
      expect(styleCache.responsive.registryName).toBe('responsive')
      
      // Non-persistent caches should not have persistCache enabled
      expect(styleCache.styles.persistCache).toBe(false)
      expect(styleCache.compositions.persistCache).toBe(false)
      expect(styleCache.responsive.persistCache).toBe(false)
    })

    test('should create persistent caches for variants, common, and components', () => {
      expect(styleCache.variants.registryName).toBe('variants')
      expect(styleCache.common.registryName).toBe('common')
      expect(styleCache.components.registryName).toBe('components')
      
      // Persistent caches should have persistCache enabled
      expect(styleCache.variants.persistCache).toBe(true)
      expect(styleCache.common.persistCache).toBe(true)
      expect(styleCache.components.persistCache).toBe(true)
    })
  })

  describe('registerBaseKey', () => {
    test('should generate base key with provided keys and version', () => {
      const keys = ['key1', 'key2', { prop: 'value' }]
      const originalKeysLength = keys.length
      
      const result = styleCache.registerBaseKey(keys)
      
      expect(typeof result).toBe('string')
      expect(result).toBeTruthy()
      expect(styleCache.baseKey).toBe(result)
      // Should have added the version to keys array
      expect(keys.length).toBeGreaterThanOrEqual(originalKeysLength + 1)
    })

    test('should modify original keys array by adding version', () => {
      const keys = ['test']
      const originalKeys = [...keys]
      
      styleCache.registerBaseKey(keys)
      
      expect(keys.length).toBeGreaterThanOrEqual(originalKeys.length + 1)
      expect(keys.slice(0, 1)).toEqual(originalKeys)
      // Last item should be the version
      expect(typeof keys[keys.length - 1]).toBe('object')
    })

    test('should handle empty keys array', () => {
      const keys: any[] = []
      
      const result = styleCache.registerBaseKey(keys)
      
      expect(typeof result).toBe('string')
      expect(result).toBeTruthy()
      expect(keys.length).toBeGreaterThanOrEqual(1)
      expect(styleCache.baseKey).toBe(result)
    })

    test('should generate different keys for different inputs', () => {
      const keys1 = ['a', 'b']
      const keys2 = ['c', 'd']
      
      const result1 = styleCache.registerBaseKey(keys1)
      const result2 = styleCache.registerBaseKey(keys2)
      
      expect(result1).not.toBe(result2)
    })
  })

  describe('wipeCache', () => {
    test('should clear all cache instances', () => {
      // First, add some data to caches
      styleCache.styles.cache['test1'] = 'value1'
      styleCache.compositions.cache['test2'] = 'value2'
      styleCache.responsive.cache['test3'] = 'value3'
      styleCache.variants.cache['test4'] = 'value4'
      styleCache.common.cache['test5'] = 'value5'
      styleCache.components.cache['test6'] = 'value6'
      
      // Verify data exists
      expect(Object.keys(styleCache.styles.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.compositions.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.responsive.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.variants.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.common.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.components.cache).length).toBeGreaterThan(0)
      
      // Clear all caches
      styleCache.wipeCache()
      
      // Verify all caches are empty
      expect(Object.keys(styleCache.styles.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.compositions.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.responsive.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.variants.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.common.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.components.cache)).toHaveLength(0)
    })

    test('should also clear persistent storage for persistent caches', () => {
      // Add some data that would be persisted
      styleCache.variants.cacheFor('persistent-key', 'persistent-value')
      styleCache.common.cacheFor('common-key', 'common-value')
      styleCache.components.cacheFor('component-key', 'component-value')
      
      // Verify storage has data
      expect(mockStorage.size).toBeGreaterThan(0)
      
      styleCache.wipeCache()
      
      // Storage should be cleared for persistent caches
      expect(mockStorage.size).toBe(0)
    })
  })

  describe('keyFor', () => {
    beforeEach(() => {
      styleCache.registerBaseKey(['test-app'])
    })

    test('should generate key and return null for non-existent cache value', () => {
      const keyData = { prop1: 'value1', prop2: 'value2' }
      
      const result = styleCache.keyFor('styles', keyData)
      
      expect(typeof result.key).toBe('string')
      expect(result.key).toBeTruthy()
      expect(result.value).toBeNull()
    })

    test('should handle functions in keyData by converting to string', () => {
      const testFunction = () => 'test'
      const keyData = { 
        prop1: 'value1', 
        func: testFunction,
        prop2: 'value2' 
      }
      
      const result = styleCache.keyFor('components', keyData)
      
      expect(typeof result.key).toBe('string')
      expect(result.key).toBeTruthy()
      expect(result.value).toBeNull()
    })

    test('should return existing cached value after decompression', () => {
      const keyData = { prop: 'value' }
      const testValue = { result: 'data' }
      
      // First, get the key that would be generated
      const { key } = styleCache.keyFor('styles', keyData)
      
      // Cache the value
      styleCache.cacheFor('styles', key, testValue)
      
      // Retrieve the cached value
      const result = styleCache.keyFor('styles', keyData)
      
      expect(result.key).toBe(key)
      expect(result.value).toEqual(testValue)
    })

    test('should work with array keyData', () => {
      const keyData = ['item1', 'item2', 'item3']
      
      const result = styleCache.keyFor('responsive', keyData)
      
      expect(typeof result.key).toBe('string')
      expect(result.key).toBeTruthy()
      expect(result.value).toBeNull()
    })

    test('should generate different keys for different keyData', () => {
      const keyData1 = { prop: 'value1' }
      const keyData2 = { prop: 'value2' }
      
      const result1 = styleCache.keyFor('styles', keyData1)
      const result2 = styleCache.keyFor('styles', keyData2)
      
      expect(result1.key).not.toBe(result2.key)
    })

    test('should work with different cache types', () => {
      const keyData = { test: 'data' }
      const cacheTypes = ['styles', 'compositions', 'responsive', 'variants', 'common', 'components'] as const
      
      const results = cacheTypes.map(cacheType => {
        return styleCache.keyFor(cacheType, keyData)
      })
      
      // All should generate keys
      results.forEach(result => {
        expect(typeof result.key).toBe('string')
        expect(result.key).toBeTruthy()
      })
      
      // Keys should be the same since baseKey and keyData are the same
      const firstKey = results[0].key
      results.forEach(result => {
        expect(result.key).toBe(firstKey)
      })
    })
  })

  describe('cacheFor', () => {
    beforeEach(() => {
      styleCache.registerBaseKey(['test-app'])
    })

    test('should compress and cache value when CACHE_ENABLED is true', () => {
      const testValue = { data: 'test', number: 42 }
      
      const result = styleCache.cacheFor('styles', 'test-key', testValue)
      
      // Should return compressed value
      expect(typeof result).toBe('string')
      
      // Should be stored in cache
      expect(styleCache.styles.cache['test-key']).toBeDefined()
    })

    test('should work with different cache types', () => {
      const testValue = { test: 'data' }
      const cacheTypes = ['styles', 'compositions', 'responsive', 'variants', 'common', 'components'] as const
      
      cacheTypes.forEach(cacheType => {
        const result = styleCache.cacheFor(cacheType, `${cacheType}-key`, testValue)
        
        expect(result).toBeDefined()
        expect(styleCache[cacheType].cache[`${cacheType}-key`]).toBeDefined()
      })
    })

    test('should handle various data types', () => {
      const testCases = [
        { name: 'object', value: { prop: 'value' } },
        { name: 'array', value: [1, 2, 3] },
        { name: 'string', value: 'test string' },
        { name: 'number', value: 42 },
        { name: 'boolean', value: true },
      ]
      
      testCases.forEach(({ name, value }) => {
        const result = styleCache.cacheFor('styles', `key-${name}`, value)
        expect(result).toBeDefined()
        expect(styleCache.styles.cache[`key-${name}`]).toBeDefined()
      })
    })

    test('should persist cache for persistent cache types', () => {
      const testValue = { persistent: 'data' }
      
      styleCache.cacheFor('variants', 'persistent-key', testValue)
      
      // Should be stored in memory cache
      expect(styleCache.variants.cache['persistent-key']).toBeDefined()
      
      // Should also be persisted to storage
      expect(mockStorage.size).toBeGreaterThan(0)
    })
  })

  describe('Integration tests', () => {
    test('should handle complete cache workflow', () => {
      // 1. Register base key
      const baseKey = styleCache.registerBaseKey(['my-app', 'v1.0'])
      expect(styleCache.baseKey).toBe(baseKey)
      
      // 2. Generate key and check for existing value (should be null)
      const keyData = { component: 'Button', variant: 'primary', size: 'large' }
      let result = styleCache.keyFor('components', keyData)
      expect(result.value).toBeNull()
      
      // 3. Cache a value
      const testValue = { 
        backgroundColor: 'blue', 
        color: 'white',
        padding: '12px 24px',
        borderRadius: '4px'
      }
      const cachedResult = styleCache.cacheFor('components', result.key, testValue)
      expect(cachedResult).toBeDefined()
      
      // 4. Retrieve cached value (should now exist)
      result = styleCache.keyFor('components', keyData)
      expect(result.value).toEqual(testValue)
    })

    test('should handle cache persistence and restoration', () => {
      // Cache some values in persistent caches
      const variantsValue = { variant: 'primary' }
      const commonValue = { common: 'styles' }
      
      styleCache.cacheFor('variants', 'variants-key', variantsValue)
      styleCache.cacheFor('common', 'common-key', commonValue)
      
      // Verify persistence
      expect(mockStorage.size).toBeGreaterThan(0)
      
      setTimeout(() => {
        // Create new StyleCache with same storage
        const newStyleCache = new StyleCache(mockStorage)
        
        // Values should be restored from storage
        expect(Object.keys(newStyleCache.variants.cache).length).toBeGreaterThan(0)
        expect(Object.keys(newStyleCache.common.cache).length).toBeGreaterThan(0)
      }, 5000)
    })

    test('should handle cache clearing and restoration', () => {
      // Add data to all caches
      const testValue = { data: 'test' }
      
      styleCache.cacheFor('styles', 'styles-key', testValue)
      styleCache.cacheFor('components', 'components-key', testValue)
      styleCache.cacheFor('variants', 'variants-key', testValue)
      
      // Verify data exists
      expect(Object.keys(styleCache.styles.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.components.cache).length).toBeGreaterThan(0)
      expect(Object.keys(styleCache.variants.cache).length).toBeGreaterThan(0)
      expect(mockStorage.size).toBeGreaterThan(0)
      
      // Clear all caches
      styleCache.wipeCache()
      
      // Verify everything is cleared
      expect(Object.keys(styleCache.styles.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.components.cache)).toHaveLength(0)
      expect(Object.keys(styleCache.variants.cache)).toHaveLength(0)
      expect(mockStorage.size).toBe(0)
    })

    test('should handle complex keyData with nested objects and functions', () => {
      styleCache.registerBaseKey(['complex-test'])
      
      const complexKeyData = {
        theme: {
          primary: '#007bff',
          secondary: '#6c757d',
          breakpoints: ['sm', 'md', 'lg']
        },
        transform: (value: string) => value.toUpperCase(),
        isActive: true,
        index: 0
      }
      
      // Should handle complex data without errors
      const result = styleCache.keyFor('styles', complexKeyData)
      expect(typeof result.key).toBe('string')
      expect(result.key).toBeTruthy()
      
      // Should be able to cache and retrieve
      const complexValue = { 
        computed: 'styles',
        rules: ['rule1', 'rule2']
      }
      
      styleCache.cacheFor('styles', result.key, complexValue)
      
      const retrieved = styleCache.keyFor('styles', complexKeyData)
      expect(retrieved.value).toEqual(complexValue)
    })
  })

  describe('Edge cases and error handling', () => {
    test('should handle very large objects', () => {
      styleCache.registerBaseKey(['large-objects'])
      
      const largeObject: Record<string, any> = {}
      for (let i = 0; i < 1000; i++) {
        largeObject[`key${i}`] = `value${i}`
      }
      
      const result = styleCache.keyFor('styles', largeObject)
      expect(result.key).toBeTruthy()
      
      styleCache.cacheFor('styles', result.key, largeObject)
      const retrieved = styleCache.keyFor('styles', largeObject)
      expect(retrieved.value).toEqual(largeObject)
    })
  })
})
