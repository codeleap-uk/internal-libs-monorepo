import { expect, test } from "bun:test"
import {globalState} from '../globalState'

test("store.set()", () => {
  const store = globalState(1)

  store.set(4)

  expect(store.get()).toBe(4)
})

test("store.set() with object", () => {
  const store = globalState({
    a: 1,
    b: "Test"
  })

  store.set({
    a: 4
  })

  expect(store.get().a).toBe(4)
})

test("store.reset() with object", () => {
  const store = globalState({
    a: 1,
    b: "Test"
  })

  store.reset({
    a: 4,
    b: "Changed"
  })

  const newVal = store.get()
  expect(newVal.a).toBe(4)
  expect(newVal.b).toBe('Changed')
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

test("store.listen()", () => {
  const store = globalState(1)

  store.listen((current, prev) => {
      expect(current).toBe(4)
      expect(prev).toBe(1)
  })

  store.set(4)

  expect(store.get()).toBe(4)
})