import { useStore } from '@nanostores/react'
import { Store } from 'nanostores'

export const createStateSelector = <T, R>(
  store: Store<T>,
  selector: (state: T) => R
) => ({
  get: () => selector(store.get()),
  listen: (listener: (value: R) => void) => {
    return store.listen((state) => {
      listener(selector(state))
    })
  }
} as Store)

export function useStateSelector<T, R>(
  store: Store<T>,
  selector: (state: T) => R
): R {
  return useStore(createStateSelector(store, selector))
}

export function stateAssign<T>(newValue: Partial<T>, stateValue: T): T {
  if (Array.isArray(stateValue)) {
    return [
      ...stateValue,
      ...(Array.isArray(newValue) ? newValue : [newValue]),
    ] as T
  } else if (typeof stateValue === "object" && stateValue !== null) {
    return {
      ...stateValue,
      ...newValue,
    } as T
  } else {
    return newValue as T
  }
}
