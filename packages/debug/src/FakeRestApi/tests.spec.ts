import { describe, test, expect, beforeEach } from 'bun:test'
import { FakeRestApi } from './class'
import { createFakeRestApi } from './factor'

type User = {
  id: number
  name: string
  email: string
  age: number
  active: boolean
}

type UserFilters = {
  name?: string
  minAge?: number
  active?: boolean
}

describe('FakeRestApi', () => {
  let api: FakeRestApi<User, UserFilters>

  beforeEach(() => {
    api = createFakeRestApi<User, UserFilters>({
      name: 'users',
      enableDelay: false,
      maxCount: 20,
      generatorFn: (id) => ({
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
        age: 20 + id,
        active: id % 2 === 0,
      }),
      filterFn: (item, filters) => {
        if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) {
          return false
        }

        if (filters.minAge !== undefined && item.age < filters.minAge) {
          return false
        }

        if (filters.active !== undefined && item.active !== filters.active) {
          return false
        }

        return true
      },
    })
  })

  describe('Constructor', () => {
    test('should create the API with default settings', () => {
      expect(api.name).toBe('users')
      expect(api.count).toBe(20)
    })

    test('should automatically generate initial items', () => {
      const data = api.getData()
      expect(data).toHaveLength(20)
      expect(data[0].id).toBe(1)
      expect(data[0].name).toBe('User 1')
    })
  })

  describe('listItems', () => {
    test('should list items with default pagination', async () => {
      const result = await api.listItems()

      expect(result.count).toBe(20)
      expect(result.results).toHaveLength(10)
      expect(result.next).toBe('https://api.users?limit=10&offset=10')
      expect(result.previous).toBeNull()
    })

    test('should respect limit and offset', async () => {
      const result = await api.listItems(5, 10)

      expect(result.results).toHaveLength(5)
      expect(result.results[0].id).toBe(11)
      expect(result.next).toBe('https://api.users?limit=5&offset=15')
      expect(result.previous).toBe('https://api.users?limit=5&offset=5')
    })

    test('should return null for next when there are no more items', async () => {
      const result = await api.listItems(10, 15)

      expect(result.results).toHaveLength(5)
      expect(result.next).toBeNull()
    })

    test('should return null for previous when offset is 0', async () => {
      const result = await api.listItems(10, 0)

      expect(result.previous).toBeNull()
    })

    test('should filter by name', async () => {
      const result = await api.listItems(20, 0, { name: 'User 1' })

      expect(result.count).toBe(11)
      expect(result.results.every(u => u.name.includes('User 1'))).toBe(true)
    })

    test('should filter by minimum age', async () => {
      const result = await api.listItems(20, 0, { minAge: 30 })

      expect(result.results.every(u => u.age >= 30)).toBe(true)
    })

    test('should filter by active status', async () => {
      const result = await api.listItems(20, 0, { active: true })

      expect(result.results.every(u => u.active === true)).toBe(true)
    })

    test('should apply multiple filters', async () => {
      const result = await api.listItems(20, 0, { active: true, minAge: 25 })

      expect(result.results.every(u => u.active === true && u.age >= 25)).toBe(true)
    })

    test('should handle negative offset', async () => {
      const result = await api.listItems(10, -5)

      expect(result.results[0].id).toBe(1)
    })
  })

  describe('retrieveItem', () => {
    test('should retrieve item by id', async () => {
      const user = await api.retrieveItem(5)

      expect(user.id).toBe(5)
      expect(user.name).toBe('User 5')
      expect(user.email).toBe('user5@example.com')
    })

    test('should throw an error when item does not exist', async () => {
      expect(async () => {
        await api.retrieveItem(999)
      }).toThrow('users with id 999 not found')
    })
  })

  describe('createItem', () => {
    test('should create item with provided data', async () => {
      const newUser = await api.createItem({
        name: 'John Smith',
        email: 'john@example.com',
        age: 28,
        active: true,
      })

      expect(newUser.id).toBe(21)
      expect(newUser.name).toBe('John Smith')
      expect(api.count).toBe(21)
    })

    test('should generate item automatically when not provided', async () => {
      const newUser = await api.createItem()

      expect(newUser.id).toBe(21)
      expect(newUser.name).toBe('User 21')
      expect(api.count).toBe(21)
    })

    test('should auto-increment the id', async () => {
      const user1 = await api.createItem()
      const user2 = await api.createItem()

      expect(user1.id).toBe(21)
      expect(user2.id).toBe(22)
    })
  })

  describe('updateItem', () => {
    test('should update existing item', async () => {
      const updated = await api.updateItem(5, {
        name: 'User Updated',
        age: 99,
      })

      expect(updated.id).toBe(5)
      expect(updated.name).toBe('User Updated')
      expect(updated.age).toBe(99)
      expect(updated.email).toBe('user5@example.com')
    })

    test('should preserve the original id', async () => {
      const updated = await api.updateItem(5, { id: 999 } as any)

      expect(updated.id).toBe(5)
    })

    test('should throw an error when item does not exist', async () => {
      expect(async () => {
        await api.updateItem(999, { name: 'Test' })
      }).toThrow('users with id 999 not found')
    })
  })

  describe('deleteItem', () => {
    test('should delete existing item', async () => {
      const deleted = await api.deleteItem(5)

      expect(deleted.id).toBe(5)
      expect(api.count).toBe(19)
      expect(api.getItem(5)).toBeUndefined()
    })

    test('should throw an error when item does not exist', async () => {
      expect(async () => {
        await api.deleteItem(999)
      }).toThrow('users with id 999 not found')
    })
  })

  describe('Utility methods', () => {
    test('getItem should return existing item', () => {
      const user = api.getItem(5)

      expect(user).toBeDefined()
      expect(user?.id).toBe(5)
    })

    test('getItem should return undefined for non-existing item', () => {
      const user = api.getItem(999)

      expect(user).toBeUndefined()
    })

    test('getData should return frozen array', () => {
      const data = api.getData()

      expect(data).toHaveLength(20)
      expect(Object.isFrozen(data)).toBe(true)
    })

    test('clear should remove all items', () => {
      api.clear()

      expect(api.count).toBe(0)
      expect(api.getData()).toHaveLength(0)
    })

    test('reset should restore initial items', () => {
      api.clear()
      expect(api.count).toBe(0)

      api.reset()

      expect(api.count).toBe(20)
      expect(api.getData()[0].id).toBe(1)
    })

    test('generateItem should generate new item with provided id', () => {
      const user = api.generateItem(100)

      expect(user.id).toBe(100)
      expect(user.name).toBe('User 100')
    })

    test('generateItem should use lastId + 1 when not provided', () => {
      const user = api.generateItem()

      expect(user.id).toBe(21)
    })
  })

  describe('setOptions', () => {
    test('should update options', () => {
      api.setOptions({ enableDelay: true, delayMs: 5000 })

      expect(api.name).toBe('users')
    })
  })

  describe('Delay', () => {
    test('should respect delay when enabled', async () => {
      const apiWithDelay = createFakeRestApi<User>({
        name: 'delayed',
        enableDelay: true,
        delayMs: 100,
        maxCount: 5,
        generatorFn: (id) => ({
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`,
          age: 20,
          active: true,
        }),
      })

      const start = Date.now()
      await apiWithDelay.listItems()
      const duration = Date.now() - start

      expect(duration).toBeGreaterThanOrEqual(100)
    })

    test('should be instantaneous when delay is disabled', async () => {
      const start = Date.now()
      await api.listItems()
      const duration = Date.now() - start

      expect(duration).toBeLessThan(50)
    })
  })

  describe('Edge cases', () => {
    test('should handle maxCount = 0', () => {
      const emptyApi = createFakeRestApi<User>({
        name: 'empty',
        maxCount: 0,
        generatorFn: (id) => ({
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`,
          age: 20,
          active: true,
        }),
      })

      expect(emptyApi.count).toBe(0)
    })

    test('should handle empty filters', async () => {
      const result = await api.listItems(10, 0, {})

      expect(result.count).toBe(20)
    })

    test('should handle limit greater than total', async () => {
      const result = await api.listItems(100, 0)

      expect(result.results).toHaveLength(20)
      expect(result.next).toBeNull()
    })

    test('should handle offset greater than total', async () => {
      const result = await api.listItems(10, 100)

      expect(result.results).toHaveLength(0)
      expect(result.next).toBeNull()
    })
  })

  describe('API without filterFn', () => {
    test('should work without filterFn defined', async () => {
      const simpleApi = createFakeRestApi<User>({
        name: 'simple',
        maxCount: 10,
        generatorFn: (id) => ({
          id,
          name: `User ${id}`,
          email: `user${id}@example.com`,
          age: 20,
          active: true,
        }),
      })

      const result = await simpleApi.listItems(5, 0, { name: 'test' })

      expect(result.count).toBe(10)
    })
  })
})
