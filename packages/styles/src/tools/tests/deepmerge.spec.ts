import { test, expect, describe } from 'bun:test'
import { deepmerge } from '../deepmerge'

describe('deepmerge', () => {
  const merge = deepmerge()

  test('should merge simple objects', () => {
    const target = { a: 1, b: 2 }
    const source = { b: 3, c: 4 }
    const result = merge(target, source)
    
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
    expect(result).not.toBe(target)
    expect(result).not.toBe(source)
  })

  test('should merge nested objects', () => {
    const target = { 
      user: { name: 'John', age: 30 },
      settings: { theme: 'light' }
    }
    const source = { 
      user: { age: 31, city: 'NY' },
      settings: { language: 'en' }
    }
    const result = merge(target, source)
    
    expect(result).toEqual({
      user: { name: 'John', age: 31, city: 'NY' },
      settings: { theme: 'light', language: 'en' }
    })
  })

  test('should concatenate arrays by default', () => {
    const target = { items: [1, 2, 3] }
    const source = { items: [4, 5] }
    const result = merge(target, source)
    
    expect(result).toEqual({ items: [1, 2, 3, 4, 5] })
  })

  test('should handle mixed data types', () => {
    const target = {
      string: 'hello',
      number: 42,
      boolean: true,
      nested: { a: 1 }
    }
    const source = {
      string: 'world',
      array: [1, 2, 3],
      nested: { b: 2 }
    }
    const result = merge(target, source)
    
    expect(result).toEqual({
      string: 'world',
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      nested: { a: 1, b: 2 }
    })
  })

  test('should not mutate original objects', () => {
    const target = { a: { x: 1 }, arr: [1] }
    const source = { a: { y: 2 }, arr: [2] }
    
    const result = merge(target, source)
    
    expect(target.a).toEqual({ x: 1 })
    expect(target.arr).toEqual([1])
    expect(source.a).toEqual({ y: 2 })
    expect(source.arr).toEqual([2])
    expect(result.a).toEqual({ x: 1, y: 2 })
    expect(result.arr).toEqual([1, 2])
  })

  test('should handle primitive values', () => {
    const result1 = merge({ a: 1 }, { a: 'string' })
    const result2 = merge({ a: null }, { a: 'value' })
    const result3 = merge({ a: undefined }, { a: 42 })
    
    expect(result1).toEqual({ a: 'string' })
    expect(result2).toEqual({ a: 'value' })
    expect(result3).toEqual({ a: 42 })
  })

  test('should handle RegExp and Date objects', () => {
    const target = { regex: /old/, date: new Date('2023-01-01') }
    const source = { regex: /new/, date: new Date('2024-01-01') }
    const result = merge(target, source)
    
    expect(result.regex).toEqual(/new/)
    expect(result.date).toEqual(new Date('2024-01-01'))
    expect(result.regex).not.toBe(target.regex)
    expect(result.date).not.toBe(target.date)
  })

  test('should merge multiple levels deep', () => {
    const target = {
      level1: {
        level2: {
          level3: { a: 1, b: 2 }
        }
      }
    }
    const source = {
      level1: {
        level2: {
          level3: { b: 3, c: 4 },
          other: 'value'
        }
      }
    }
    const result = merge(target, source)
    
    expect(result).toEqual({
      level1: {
        level2: {
          level3: { a: 1, b: 3, c: 4 },
          other: 'value'
        }
      }
    })
  })

  test('should handle empty objects', () => {
    const result1 = merge({}, { a: 1 })
    const result2 = merge({ a: 1 }, {})
    
    expect(result1).toEqual({ a: 1 })
    expect(result2).toEqual({ a: 1 })
  })

  test('should handle array vs object type mismatch', () => {
    const result1 = merge({ a: [1, 2] }, { a: { x: 1 } })
    const result2 = merge({ a: { x: 1 } }, { a: [1, 2] })
    
    expect(result1).toEqual({ a: { x: 1 } })
    expect(result2).toEqual({ a: [1, 2] })
  })

  test('should support mergeAll option', () => {
    const mergeAll = deepmerge({ all: true })
    const result = mergeAll(
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { a: 10 }
    )
    
    expect(result).toEqual({ a: 10, b: 2, c: 3 })
  })
})
