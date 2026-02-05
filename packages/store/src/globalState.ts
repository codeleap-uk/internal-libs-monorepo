import { useStore } from '@nanostores/react'
import { setPersistentEngine, persistentAtom } from '@nanostores/persistent'
import { atom, WritableAtom } from 'nanostores'
import { GlobalState, GlobalStateConfig, StateSelector, StateSetter } from './types'
import { stateAssign, useStateSelector } from './utils'
import { arrayHandler, arrayOps } from './array'

const defaultConfig: GlobalStateConfig = {
  persistKey: null,
}

export const setGlobalStatePersistor = setPersistentEngine

export function globalState<T>(value: T, config: GlobalStateConfig = defaultConfig): GlobalState<T> {
  const { persistKey } = config

  const isPersistState = typeof persistKey === 'string'

  const store = isPersistState ? persistentAtom<T>(persistKey, value, {
    encode: JSON.stringify,
    decode: JSON.parse,
  }) : atom(value)

  return new Proxy(store, {
    get(target, prop, receiver) {
      if (prop === 'use') {
        return (selector?: StateSelector<T, any>) => {
          if (!selector) return useStore(target)
          return useStateSelector(target, selector)
        }
      }

      if (prop === 'get') {
        return (selector?: StateSelector<T, any>) => {
          if (!selector) return target.get()
          return selector(target.get())
        }
      }

      if (prop === 'set') {
        return (newValue: StateSetter<Partial<T>>) => {
          const value = stateAssign(newValue, target.get())
          target.set(value)
        }
      }

      if (prop == 'reset') {
        return Reflect.get(target, 'set', receiver)
      }

      if (arrayOps.includes(prop as string)) {
        const currentValue = target.get()

        if (!Array.isArray(currentValue)) {
          throw new Error('Cannot call array methods on a non array store')
        }

        const handle = arrayHandler(target as WritableAtom<any[]>)

        return Reflect.get(handle, prop, receiver)
      }

      return Reflect.get(target, prop, receiver)
    },
  }) as unknown as GlobalState<T>
}
