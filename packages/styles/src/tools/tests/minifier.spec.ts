import { test, expect, describe } from 'bun:test'
import { compress, decompress, minifier } from '../minifier'

describe('minifier', () => {
  describe('compress', () => {
    test('should compress string values', () => {
      const original = 'hello world'
      const compressed = compress(original)
      
      expect(typeof compressed).toBe('string')
      expect(compressed).not.toBe(original)
      expect(compressed.length).toBeGreaterThan(0)
    })

    test('should compress objects', () => {
      const original = { name: 'John', age: 30, items: [1, 2, 3] }
      const compressed = compress(original)
      
      expect(typeof compressed).toBe('string')
      expect(compressed).not.toEqual(original)
    })

    test('should return falsy values unchanged', () => {
      expect(compress(null)).toBe(null)
      expect(compress(undefined)).toBe(undefined)
      expect(compress('')).toBe('')
      expect(compress(0)).toBe(0)
      expect(compress(false)).toBe(false)
    })

    test('should handle arrays', () => {
      const original = [1, 2, { a: 'test' }, [4, 5]]
      const compressed = compress(original)
      
      expect(typeof compressed).toBe('string')
      expect(compressed.length).toBeGreaterThan(0)
    })

    test('should handle nested objects', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              data: 'nested value',
              numbers: [1, 2, 3, 4, 5]
            }
          }
        }
      }
      const compressed = compress(original)
      
      expect(typeof compressed).toBe('string')
      expect(compressed.length).toBeGreaterThan(0)
    })
  })

  describe('decompress', () => {
    test('should decompress string values', () => {
      const original = 'hello world'
      const compressed = compress(original)
      const decompressed = decompress(compressed)
      
      expect(decompressed).toBe(original)
    })

    test('should decompress objects', () => {
      const original = { name: 'John', age: 30, items: [1, 2, 3] }
      const compressed = compress(original)
      const decompressed = decompress(compressed)
      
      expect(decompressed).toEqual(original)
      expect(decompressed).not.toBe(original) // Different object reference
    })

    test('should return falsy values unchanged', () => {
      expect(decompress(null)).toBe(null)
      expect(decompress(undefined)).toBe(undefined)
      expect(decompress('')).toBe('')
      expect(decompress(0)).toBe(0)
      expect(decompress(false)).toBe(false)
    })

    test('should handle arrays', () => {
      const original = [1, 2, { a: 'test' }, [4, 5]]
      const compressed = compress(original)
      const decompressed = decompress(compressed)
      
      expect(decompressed).toEqual(original)
    })

    test('should handle nested objects', () => {
      const original = {
        level1: {
          level2: {
            level3: {
              data: 'nested value',
              numbers: [1, 2, 3, 4, 5]
            }
          }
        }
      }
      const compressed = compress(original)
      const decompressed = decompress(compressed)
      
      expect(decompressed).toEqual(original)
    })
  })

  describe('roundtrip compression', () => {
    test('should maintain data integrity through compress/decompress cycle', () => {
      const testCases = [
        'simple string',
        { simple: 'object' },
        [1, 2, 3, 4, 5],
        { mixed: ['array', { nested: true }] },
        42,
        true,
        { date: '2023-01-01', count: 100 }
      ]

      testCases.forEach(original => {
        const compressed = compress(original)
        const decompressed = decompress(compressed)
        expect(decompressed).toEqual(original)
      })
    })

    test('should actually compress large repetitive data', () => {
      const original = {
        data: Array(1000).fill('repeated string data that should compress well')
      }
      const compressed = compress(original)
      const originalStr = JSON.stringify(original)
      
      expect(compressed.length).toBeLessThan(originalStr.length)
      
      const decompressed = decompress(compressed)
      expect(decompressed).toEqual(original)
    })
  })

  describe('minifier object', () => {
    test('should have compress and decompress methods', () => {
      expect(typeof minifier.compress).toBe('function')
      expect(typeof minifier.decompress).toBe('function')
    })

    test('should work the same as individual functions', () => {
      const original = { test: 'data' }
      
      const compressed1 = compress(original)
      const compressed2 = minifier.compress(original)
      expect(compressed1).toBe(compressed2)
      
      const decompressed1 = decompress(compressed1)
      const decompressed2 = minifier.decompress(compressed1)
      expect(decompressed1).toEqual(decompressed2)
    })
  })

  describe('error handling', () => {
    test('should return null for invalid compressed data', () => {
      const result = decompress('invalid-base64-data')
      expect(result).toBe(null)
    })

    test('should throw error for non-JSON compressed data', () => {
      // Create a valid base64 string that decompresses to non-JSON
      const nonJsonCompressed = compress('valid data').slice(0, -1) + 'X' // Corrupt the data
      expect(() => decompress(nonJsonCompressed)).toThrow()
    })
  })
})
