import { expect, test, describe } from 'bun:test'
import { globalState } from '../globalState'

describe('globalState', () => {
  describe('set method', () => {
    test('store.set()', () => {
      const store = globalState(1)

      store.set(4)

      expect(store.get()).toBe(4)
    })

    test('store.set with callback function', async () => {
      const store = globalState(1)

      store.set((x) => x + 1)

      expect(store.get()).toBe(2)

      const add = Array(10).fill(0).map(() => Math.round(Math.random() * 100))

      const totalExpected = store.get() + add.reduce((acc, val) => acc + val)

      add.forEach(async n => {
        store.set(current => current + n)
      })

      expect(store.get()).toBe(totalExpected)
    })

    test('store.set() with object', () => {
      const store = globalState({
        a: 1,
        b: 'Test',
      })

      store.set({
        a: 4,
      })

      expect(store.get().a).toBe(4)
    })

    test('store.set() with object preserves other keys', () => {
      const store = globalState({
        a: 1,
        b: 'Test',
        c: true,
      })

      store.set({ a: 99 })

      const val = store.get()
      expect(val.a).toBe(99)
      expect(val.b).toBe('Test')
      expect(val.c).toBe(true)
    })

    test('store.set() with callback on object', () => {
      const store = globalState({
        count: 0,
        name: 'test',
      })

      store.set((current) => ({ count: current.count + 5 }))

      const val = store.get()
      expect(val.count).toBe(5)
      expect(val.name).toBe('test')
    })
  })

  describe('reset method', () => {
    test('store.reset() with object', () => {
      const store = globalState({
        a: 1,
        b: 'Test',
      })

      store.reset({
        a: 4,
        b: 'Changed',
      })

      const newVal = store.get()
      expect(newVal.a).toBe(4)
      expect(newVal.b).toBe('Changed')
    })

    test('store.reset() with primitive', () => {
      const store = globalState(100)

      store.set(50)
      expect(store.get()).toBe(50)

      store.reset(100)
      expect(store.get()).toBe(100)
    })
  })

  describe('get method', () => {
    test('store.get() with selector', () => {
      const store = globalState({
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark' },
      })

      const userName = store.get((s) => s.user.name)
      const theme = store.get((s) => s.settings.theme)

      expect(userName).toBe('John')
      expect(theme).toBe('dark')
    })

    test('store.get() without selector returns full state', () => {
      const store = globalState({ a: 1, b: 2 })

      const state = store.get()

      expect(state).toEqual({ a: 1, b: 2 })
    })
  })

  test('store array methods', () => {
    const store = globalState([] as number[])

    store.push(10)
    store.unshift(100)

    const doubled = store.map(v => v * 2)

    const val = store.get()

    expect(val[0]).toBe(100)
    expect(val[1]).toBe(10)

    expect(doubled[0]).toBe(200)
    expect(doubled[1]).toBe(20)
  })

  describe('listen method', () => {
    test('store.listen() receives current and previous values', () => {
      const store = globalState(1)

      store.listen((current, prev) => {
        expect(current).toBe(4)
        expect(prev).toBe(1)
      })

      store.set(4)

      expect(store.get()).toBe(4)
    })

    test('store.listen() tracks multiple updates', () => {
      const store = globalState(0)
      const values: number[] = []

      store.listen((current) => {
        values.push(current)
      })

      store.set(1)
      store.set(2)
      store.set(3)

      expect(values).toEqual([1, 2, 3])
    })

    test('store.listen() unsubscribe stops receiving updates', () => {
      const store = globalState(0)
      const values: number[] = []

      const unsubscribe = store.listen((current) => {
        values.push(current)
      })

      store.set(1)
      store.set(2)

      unsubscribe()

      store.set(3)
      store.set(4)

      expect(values).toEqual([1, 2])
    })
  })

  describe('array methods', () => {
    test('mutating array methods update state', () => {
      const store = globalState([] as number[])

      store.push(10)
      store.unshift(100)

      const val = store.get()

      expect(val[0]).toBe(100)
      expect(val[1]).toBe(10)
    })

    test('non-mutating array methods return correct values', () => {
      const store = globalState([1, 2, 3, 4, 5])

      const doubled = store.map((v) => v * 2)
      const filtered = store.filter((v) => v > 2)
      const found = store.find((v) => v === 3)
      const index = store.indexOf(4)

      expect(doubled).toEqual([2, 4, 6, 8, 10])
      expect(filtered).toEqual([3, 4, 5])
      expect(found).toBe(3)
      expect(index).toBe(3)
    })

    test('array methods on non-array store throws error', () => {
      const store = globalState({ value: 1 })

      expect(() => {
        // @ts-expect-error - intentionally testing runtime error
        store.push(10)
      }).toThrow('Cannot call array methods on a non array store')
    })
  })

  describe('edge cases', () => {
    test('store with null initial value', () => {
      const store = globalState<string | null>(null)

      expect(store.get()).toBe(null)

      store.set('value')
      expect(store.get()).toBe('value')

      store.set(null)
      expect(store.get()).toBe(null)
    })

    test('store with undefined initial value', () => {
      const store = globalState<number | undefined>(undefined)

      expect(store.get()).toBe(undefined)

      store.reset(42)
      expect(store.get()).toBe(42)
    })

    test('store with empty object', () => {
      const store = globalState<Record<string, number>>({})

      store.set({ a: 1 })
      expect(store.get()).toEqual({ a: 1 })

      store.set({ b: 2 })
      expect(store.get()).toEqual({ a: 1, b: 2 })
    })
  })

})
