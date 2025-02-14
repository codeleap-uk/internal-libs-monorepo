import { useStore } from '@nanostores/react'
import { WritableAtom } from 'nanostores'
import { useMemo } from 'react'

export function stateAssign<T>(newValue: Partial<T>, stateValue: T): T {
  if (
    typeof stateValue === "object" && stateValue !== null
  ) {
    return {
      ...stateValue,
      ...newValue,
    } as T
  }  
  
  return newValue as T
  
}

export const createStateSlice = <T, R>(
  store: WritableAtom<T>,
  selector: (state: T) => R,
  deselector?: (result: R) => Partial<T>  
) => ({
  get: () => selector(store.get()),
  listen: (listener: (value: R) => void) => {
    return store.listen((state) => {
      listener(selector(state))
    })
  },
  set(v: R) {
    
    if(!deselector) {
      throw new Error('[createStateSelector] deselector must be implemented to call set on state slices')
    }

    const parsed = deselector(v)
    
    const newValue = stateAssign(parsed, store.get())

    store.set(newValue)
  }
} as WritableAtom<R>)

export function useStateSelector<T, R>(
  store: WritableAtom<T>,
  selector: (state: T) => R
): R {
  const slice = useMemo(() => createStateSlice(store, selector), [selector])

  return useStore(slice)
}
