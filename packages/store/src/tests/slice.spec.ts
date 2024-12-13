import { expect, test } from "bun:test";
import {globalState} from '../globalState'
import { createStateSlice } from "../utils";

test("slice selects consistently", () => {
  const store = globalState({
    a: 1,
    b: "Test"
  })

  const slice = createStateSlice(store, 
    v => v.a
  )

  store.set({
    a: 4
  })

  expect(slice.get()).toBe(4)

  store.set({
    a: 10
  })

  expect(slice.get()).toBe(10)
});

test("slice sets consistently", () => {
  const store = globalState({
    a: 1,
    b: "Test"
  })

  const slice = createStateSlice(store, 
    v => v.a,
    v => ({ a: v })
  )

  slice.set(4)

  expect(slice.get()).toBe(4)
  expect(store.get().a).toBe(4)

  slice.set(10)

  expect(slice.get()).toBe(10)
  expect(store.get().a).toBe(10)
});