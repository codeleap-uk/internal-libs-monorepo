import { useStore } from '@nanostores/react'
import { setPersistentEngine, persistentAtom } from '@nanostores/persistent'
import { atom } from 'nanostores'
import { GlobalState, GlobalStateConfig, StateSelector } from './types'
import { stateAssign, useStateSelector } from './utils'

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

      if (prop === 'set') {
        return (newValue: Partial<T>) => {
          const value = stateAssign(newValue, target.get())
          target.set(value)
        }
      }

      return Reflect.get(target, prop, receiver)
    }
  }) as unknown as GlobalState<T>
}
