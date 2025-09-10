import { test, expect, describe } from 'bun:test'
import { deepClone } from '../deepClone'

describe('deepClone', () => {
  test('should clone primitive values', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
  })

  test('should create independent copy of objects', () => {
    const original = { name: 'John', age: 30 }
    const cloned = deepClone(original)
    
    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    
    cloned.name = 'Jane'
    expect(original.name).toBe('John')
  })

  test('should clone nested objects', () => {
    const original = {
      user: { name: 'John', details: { age: 30, city: 'NY' } },
      settings: { theme: 'dark' }
    }
    const cloned = deepClone(original)
    
    expect(cloned).toEqual(original)
    expect(cloned.user).not.toBe(original.user)
    expect(cloned.user.details).not.toBe(original.user.details)
    
    cloned.user.details.age = 31
    expect(original.user.details.age).toBe(30)
  })

  test('should clone arrays', () => {
    const original = [1, 2, [3, 4]]
    const cloned = deepClone(original)
    
    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned[2]).not.toBe(original[2])
    
    cloned[2][0] = 5
    expect(original[2][0]).toBe(3)
  })

  test('should handle complex nested structures', () => {
    const original = {
      items: [
        { id: 1, tags: ['red', 'blue'] },
        { id: 2, tags: ['green'] }
      ],
      meta: { count: 2, filters: { active: true } }
    }
    const cloned = deepClone(original)
    
    expect(cloned).toEqual(original)
    
    cloned.items[0].tags.push('yellow')
    cloned.meta.filters.active = false
    
    expect(original.items[0].tags).toHaveLength(2)
    expect(original.meta.filters.active).toBe(true)
  })

  test('should handle dates', () => {
    const original = new Date('2023-01-01')
    const cloned = deepClone(original)
    
    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned instanceof Date).toBe(true)
  })

  test('should handle empty objects and arrays', () => {
    const emptyObj = deepClone({})
    const emptyArr = deepClone([])
    
    expect(emptyObj).toEqual({})
    expect(emptyArr).toEqual([])
  })

  test('should clone class instances as plain objects', () => {
    class Person {
      constructor(public name: string) {}
      greet() { return `Hello, ${this.name}` }
    }
    
    const original = new Person('John')
    const cloned = deepClone(original) as any
    
    expect(cloned).toEqual({ name: 'John' })
    expect(cloned).not.toBe(original)
    expect((cloned as any).name).toBe('John')
    // Methods are not cloned, only data properties
    expect((cloned as any).greet).toBeUndefined()
  })
})
