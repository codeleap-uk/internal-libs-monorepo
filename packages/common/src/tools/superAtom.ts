import { useStore } from '@nanostores/react'
import { atom, Store, WritableAtom } from 'nanostores'

type Selector<S, R> = (state: S) => R

type SuperAtom<T> = Omit<WritableAtom<T>, 'set'> & {
  use: <Selected = T>(selector?: Selector<T, Selected>) => Selected
  deletePersistedValue: () => void
  set: (newValue: Partial<T>) => T
}

const createAtomSelector = <T, R>(
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

function useAtomSelector<T, R>(
  store: Store<T>,
  selector: (state: T) => R
): R {
  return useStore(createAtomSelector(store, selector))
}

function atomAssign<T>(newValue: Partial<T>, stateValue: T): T {
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

export type AtomPersistor = {
  set: (key: string, value: string) => void
  get: (key: string) => string
  remove: (key: string) => void
}

type SuperAtomConfig = {
  persist?: boolean
  persistKey?: string
  persistor?: AtomPersistor
}

const defaultConfig: SuperAtomConfig = {
  persist: false,
  persistKey: null,
  persistor: null,
}

export function superAtom<T>(value: T, config: SuperAtomConfig = defaultConfig): SuperAtom<T> {
  if (config.persist && (!config.persistKey || !config.persistor)) {
    throw new Error('Atom persist invalid configuration: "persistKey" and "persistor" is required when "persist" is enabled.')
  }

  const { persistKey, persistor, persist } = config

  let persistedValue = persist ? persistor.get(persistKey) : null

  if (persistedValue) {
    persistedValue = JSON.parse(persistedValue)
  }

  const store = atom(persistedValue ?? value)

  return new Proxy(store, {
    get(target, prop, receiver) {
      if (prop === 'use') {
        return (selector?: Selector<T, any>) => {
          if (!selector) return useStore(target)
          return useAtomSelector(target, selector)
        }
      }

      if (prop === 'set') {
        return (newValue: Partial<T>) => {
          const value = atomAssign(newValue, target.get())
          target.set(value)
          if (persist) persistor.set(persistKey, JSON.stringify(value))
        }
      }

      if (prop === 'deletePersistedValue') {
        return () => {
          if (persist) persistor.remove(persistKey)
        }
      }

      return Reflect.get(target, prop, receiver)
    }
  }) as unknown as SuperAtom<T>
}
