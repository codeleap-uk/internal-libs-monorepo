import { useStore } from '@nanostores/react'
import { WritableAtom } from 'nanostores'
import { useMemo } from 'react'
import { StateSetter, StateSetterFunction } from './types'

function isFunctionSetter<T>(x: any): x is StateSetterFunction<T> {
  return typeof x === 'function'
}

function resolveSetter<T>(setter: StateSetter<T>, currentValue:T):T {
  if (isFunctionSetter(setter)) {
    return setter(currentValue)
  }

  return setter
}

export function stateAssign<T>(newValue: StateSetter<Partial<T>>, stateValue: T): T {
  const resolvedValue = resolveSetter(newValue, stateValue)
  if (
    typeof stateValue === 'object' && stateValue !== null
  ) {
    return {
      ...stateValue,
      ...resolvedValue,
    } as T
  }

  return resolvedValue as T
}

export const createStateSlice = <T, R, S extends WritableAtom<T>>(
  store: S,
  selector: (state: T) => R,
  deselector?: (result: R) => Partial<T>,
) => ({
    get: () => selector(store.get()),
    listen: (listener: (value: R) => void) => {
      return store.listen((state) => {
        listener(selector(state))
      })
    },
    set(v: R) {
      if (!deselector) {
        throw new Error('[createStateSelector] deselector must be implemented to call set on state slices')
      }

      const parsed = deselector(v)

      const newValue = stateAssign(parsed, store.get())

      store.set(newValue)
    },
  } as WritableAtom<R>)

export function useStateSelector<T, R, S extends WritableAtom<T>>(
  store: S,
  selector: (state: T) => R,
): R {
  const slice = useMemo(() => createStateSlice(store, selector), [selector])

  return useStore(slice)
}
