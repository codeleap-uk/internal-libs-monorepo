import { test, expect, describe } from 'bun:test'
import { hashKey } from '../hashKey'

describe('hashKey', () => {
  test('should generate consistent hash for same input', () => {
    const input = ['style1', 'style2']
    const hash1 = hashKey([...input])
    const hash2 = hashKey([...input])
    
    expect(hash1).toBe(hash2)
  })

  test('should generate different hashes for different inputs', () => {
    const input1 = ['style1', 'style2']
    const input2 = ['style3', 'style4']
    
    const hash1 = hashKey([...input1])
    const hash2 = hashKey([...input2])
    
    expect(hash1).not.toBe(hash2)
  })

  test('should return a valid SHA-256 hash string', () => {
    const input = ['test']
    const hash = hashKey([...input])
    
    // SHA-256 hash should be 64 characters long (hex)
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  test('should handle empty array', () => {
    const hash = hashKey([])
    
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  test('should handle arrays with objects', () => {
    const input = [{ color: 'red' }, { fontSize: '14px' }]
    const hash = hashKey([...input])
    
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  test('should mutate original array by adding version', () => {
    const input = ['style1']
    const originalLength = input.length
    
    hashKey(input)
    
    expect(input).toHaveLength(originalLength + 1)
    expect(input[input.length - 1]).toHaveProperty('@styles-version')
  })

  test('should include version in hash calculation', () => {
    // Mock different versions to test version impact
    const input = ['same-style']
    
    const hash1 = hashKey([...input])
    
    // Simulate version change by adding version manually
    const inputWithDifferentVersion = [...input, { '@styles-version': 'different-version' }]
    const hash2 = hashKey([...inputWithDifferentVersion])
    
    expect(hash1).not.toBe(hash2)
  })
})
