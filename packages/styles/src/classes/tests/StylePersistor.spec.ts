import { test, expect, describe, beforeEach, jest, Mock } from 'bun:test'
import { StylePersistor, StoragePersistor } from '../StylePersistor'
import { minifier } from '../../tools'

interface MockStorage extends StoragePersistor {
  set: Mock<(...args: any[]) => any>
  get: Mock<(...args: any[]) => any>
  del: Mock<(...args: any[]) => any>
}

describe('StylePersistor', () => {
  let mockStorage: MockStorage
  let persistor: StylePersistor

  beforeEach(() => {
    mockStorage = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn()
    } as MockStorage
    
    persistor = new StylePersistor(mockStorage)
  })

  describe('setItem', () => {
    test('should compress and store value using underlying storage', () => {
      const testValue = 'test-value'
      const compressedValue = minifier.compress(testValue)
      
      persistor.setItem('test-key', testValue)
      
      expect(mockStorage.set).toHaveBeenCalledWith('test-key', compressedValue)
    })

    test('should handle empty string values with compression', () => {
      const compressedEmpty = minifier.compress('')
      
      persistor.setItem('empty', '')
      
      expect(mockStorage.set).toHaveBeenCalledWith('empty', compressedEmpty)
    })

    test('should handle special characters with compression', () => {
      const value = 'value with spaces & symbols!'
      const compressedValue = minifier.compress(value)
      
      persistor.setItem('special/key:test', value)
      
      expect(mockStorage.set).toHaveBeenCalledWith('special/key:test', compressedValue)
    })
  })

  describe('getItem', () => {
    test('should retrieve and decompress stored value', () => {
      const originalData = 'test data for compression'
      const compressedData = minifier.compress(originalData)
      
      mockStorage.get.mockReturnValue(compressedData)
      
      const result = persistor.getItem('test-key')
      
      expect(mockStorage.get).toHaveBeenCalledWith('test-key')
      expect(result).toBe(originalData)
    })

    test('should return null when storage returns null', () => {
      mockStorage.get.mockReturnValue(null)
      
      const result = persistor.getItem('nonexistent-key')
      
      expect(result).toBeNull()
    })

    test('should return null when storage returns undefined', () => {
      mockStorage.get.mockReturnValue(undefined)
      
      const result = persistor.getItem('undefined-key')
      
      expect(result).toBeNull()
    })

    test('should handle various data types with compression/decompression', () => {
      const testCases = [
        'simple string',
        '{"json": "data"}',
        '',
        'special chars: áéíóú!@#$%',
        '12345'
      ]

      testCases.forEach(testData => {
        const compressedData = minifier.compress(testData)
        mockStorage.get.mockReturnValue(compressedData)
        
        const result = persistor.getItem('test-key')
        expect(result).toBe(testData)
      })
    })

    test('should return null when decompression fails', () => {
      const invalidData = 'invalid compressed data'
      mockStorage.get.mockReturnValue(invalidData)
      
      const originalDecompress = minifier.decompress
      minifier.decompress = jest.fn().mockReturnValue(null)
      
      const result = persistor.getItem('invalid-key')
      
      expect(result).toBeNull()
      
      minifier.decompress = originalDecompress
    })
  })

  describe('removeItem', () => {
    test('should delete item using underlying storage', () => {
      persistor.removeItem('test-key')
      
      expect(mockStorage.del).toHaveBeenCalledWith('test-key')
    })

    test('should handle removal of nonexistent keys', () => {
      persistor.removeItem('nonexistent-key')
      
      expect(mockStorage.del).toHaveBeenCalledWith('nonexistent-key')
    })

    test('should handle special characters in key', () => {
      persistor.removeItem('special/key:test')
      
      expect(mockStorage.del).toHaveBeenCalledWith('special/key:test')
    })
  })

  describe('integration with real minifier', () => {
    test('should handle complete compression/decompression workflow', () => {
      const testData = 'workflow test data'
      const compressedData = minifier.compress(testData)
      
      persistor.setItem('workflow-test', testData)
      expect(mockStorage.set).toHaveBeenCalledWith('workflow-test', compressedData)

      mockStorage.get.mockReturnValue(compressedData)
      const retrieved = persistor.getItem('workflow-test')
      expect(retrieved).toBe(testData)

      persistor.removeItem('workflow-test')
      expect(mockStorage.del).toHaveBeenCalledWith('workflow-test')
    })

    test('should verify compression actually reduces size for large data', () => {
      const largeData = 'a'.repeat(1000)
      const compressedData = minifier.compress(largeData)
      
      expect(compressedData.length).toBeLessThanOrEqual(largeData.length)
      
      mockStorage.get.mockReturnValue(compressedData)
      const result = persistor.getItem('large-data')
      
      expect(result).toBe(largeData)
    })
  })

  describe('error handling', () => {
    test('should handle storage set errors', () => {
      const errorStorage: MockStorage = {
        set: jest.fn().mockImplementation(() => { 
          throw new Error('Storage set error') 
        }),
        get: jest.fn(),
        del: jest.fn()
      } as MockStorage
      
      const errorPersistor = new StylePersistor(errorStorage)
      
      expect(() => errorPersistor.setItem('key', 'value')).toThrow('Storage set error')
    })

    test('should handle storage get errors', () => {
      const errorStorage: MockStorage = {
        set: jest.fn(),
        get: jest.fn().mockImplementation(() => { 
          throw new Error('Storage get error') 
        }),
        del: jest.fn()
      } as MockStorage
      
      const errorPersistor = new StylePersistor(errorStorage)
      
      expect(() => errorPersistor.getItem('key')).toThrow('Storage get error')
    })

    test('should handle storage delete errors', () => {
      const errorStorage: MockStorage = {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn().mockImplementation(() => { 
          throw new Error('Storage del error') 
        })
      } as MockStorage
      
      const errorPersistor = new StylePersistor(errorStorage)
      
      expect(() => errorPersistor.removeItem('key')).toThrow('Storage del error')
    })

    test('should handle minifier compression errors', () => {
      const originalCompress = minifier.compress
      minifier.compress = jest.fn().mockImplementation(() => {
        throw new Error('Compression error')
      })
      
      expect(() => persistor.setItem('key', 'value')).toThrow('Compression error')
      
      minifier.compress = originalCompress
    })

    test('should handle minifier decompression errors gracefully', () => {
      const originalDecompress = minifier.decompress
      minifier.decompress = jest.fn().mockImplementation(() => {
        throw new Error('Decompression error')
      })
      
      mockStorage.get.mockReturnValue('some data')
      
      expect(() => persistor.getItem('error-key')).toThrow('Decompression error')
      
      minifier.decompress = originalDecompress
    })
  })
})
