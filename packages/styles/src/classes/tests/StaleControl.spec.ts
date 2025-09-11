import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test'
import { StaleControl } from '../StaleControl'

describe('StaleControl', () => {
  let staleControl: StaleControl

  beforeEach(() => {
    staleControl = new StaleControl()
  })

  afterEach(() => {
    staleControl.destroy()
  })

  describe('constructor', () => {
    test('should create instance with default values', () => {
      expect(staleControl).toBeInstanceOf(StaleControl)
    })

    test('should create instance with custom values', () => {
      const customStaleControl = new StaleControl(120, '::', 60000)
      expect(customStaleControl).toBeInstanceOf(StaleControl)
      customStaleControl.destroy()
    })
  })

  describe('insertStaleTime', () => {
    test('should insert stale time into value', () => {
      const value = 'test-value'
      const result = staleControl.insertStaleTime(value)

      expect(result).toInclude(value)
      expect(result).toInclude('//:')
      expect(result.split('//:')).toHaveLength(2)
    })

    test('should handle empty string', () => {
      const result = staleControl.insertStaleTime('')
      expect(result).toInclude('//:')
    })
  })

  describe('extractStaleTime', () => {
    test('should extract stale time and original value', () => {
      const originalValue = 'test-value'
      const valueWithStaleTime = staleControl.insertStaleTime(originalValue)

      const result = staleControl.extractStaleTime(valueWithStaleTime)

      expect(result.value).toBe(originalValue)
      expect(result.staleTime).toBeInstanceOf(Date)
      expect(result.staleTime.getTime()).toBeGreaterThan(Date.now())
    })

    test('should handle value without stale time', () => {
      const value = 'plain-value'
      const result = staleControl.extractStaleTime(value)

      expect(result.value).toBe(value)
      expect(result.staleTime.getTime()).toBe(0)
    })

    test('should handle malformed stale time', () => {
      const value = 'test//:invalid-date'
      const result = staleControl.extractStaleTime(value)

      expect(result.value).toBe('test')
      expect(result.staleTime.toString()).toBe('Invalid Date')
    })
  })

  describe('isStaled', () => {
    test('should return false for fresh value', () => {
      const value = staleControl.insertStaleTime('fresh-value')
      const isStaled = staleControl.isStaled(value)

      expect(isStaled).toBeFalse()
    })

    test('should return true for expired value', () => {
      const expiredControl = new StaleControl(-60)
      const value = expiredControl.insertStaleTime('expired-value')
      const isStaled = expiredControl.isStaled(value)

      expect(isStaled).toBeTrue()
      expiredControl.destroy()
    })

    test('should handle value without stale time', () => {
      const isStaled = staleControl.isStaled('plain-value')
      expect(isStaled).toBeTrue()
    })
  })

  describe('refreshStaleTime', () => {
    test('should refresh stale time', () => {
      const originalValue = 'test-value'
      const originalStale = staleControl.insertStaleTime(originalValue)
      
      Bun.sleepSync(10)
      
      const refreshed = staleControl.refreshStaleTime(originalStale)
      
      const originalExtracted = staleControl.extractStaleTime(originalStale)
      const refreshedExtracted = staleControl.extractStaleTime(refreshed)
      
      expect(refreshedExtracted.value).toBe(originalValue)
      expect(refreshedExtracted.staleTime.getTime()).toBeGreaterThan(
        originalExtracted.staleTime.getTime()
      )
    })
  })

  describe('cacheWiper', () => {
    test('should throw error when called', () => {
      expect(() => staleControl.cacheWiper()).toThrow(
        'Cache Wiper not implemented - Requires storage integration for future use'
      )
    })
  })

  describe('interval management', () => {
    test('should register and unregister cache wiper', () => {
      const mockCacheWiper = mock(() => {})
      staleControl.cacheWiper = mockCacheWiper

      staleControl.registerCacheWiper()
      staleControl.unregisterCacheWiper()

      expect(mockCacheWiper).not.toHaveBeenCalled()
    })

    test('should handle multiple register calls', () => {
      const mockCacheWiper = mock(() => {})
      staleControl.cacheWiper = mockCacheWiper

      staleControl.registerCacheWiper()
      staleControl.registerCacheWiper()
      staleControl.unregisterCacheWiper()

      expect(mockCacheWiper).not.toHaveBeenCalled()
    })

    test('should unregister non-existent wiper without error', () => {
      expect(() => staleControl.unregisterCacheWiper()).not.toThrow()
    })
  })

  describe('destroy', () => {
    test('should clean up resources', () => {
      const mockCacheWiper = mock(() => {})
      staleControl.cacheWiper = mockCacheWiper

      staleControl.registerCacheWiper()
      staleControl.destroy()

      expect(mockCacheWiper).not.toHaveBeenCalled()
    })
  })

  describe('custom staleTimeIdentifier', () => {
    test('should work with custom identifier', () => {
      const customControl = new StaleControl(60, '::')
      const value = customControl.insertStaleTime('test')
      
      expect(value).toInclude('::')
      expect(value.split('::')).toHaveLength(2)
      
      const extracted = customControl.extractStaleTime(value)
      expect(extracted.value).toBe('test')
      
      customControl.destroy()
    })
  })
})
