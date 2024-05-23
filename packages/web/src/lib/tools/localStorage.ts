import { useEffect, useState } from 'react'
import { TypeGuards } from '@codeleap/common'

export type LocalStorageHandler<T> = (key: T, event: StorageEvent, value: any) => void
export type Key<T> = keyof T

type UseLocalStorageOptions = {
  disableListen?: boolean
  setItemValueOnMutate?: boolean
  getItemValueOnMount?: boolean
  parseValueOnGet?: boolean
}

export class LocalStorage<T extends Record<string, string>> {
  public storageKeys: T

  private storageListeners: ((event: StorageEvent) => void)[] = []

  constructor(keys: T) {
    this.storageKeys = keys
  }

  public getLocalStorage(): Storage {
    if (typeof window === 'undefined') {
      return {
        getItem: () => null,
        setItem: () => null,
        clear: () => null,
        removeItem: () => null,
      } as any
    }

    return localStorage
  }

  public getStorageKey(key: Key<T>): string {
    return String(this.storageKeys[key] ?? key)
  }

  private parseValue(value: any) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }

  private serializeValue(value: any): string {
    if (TypeGuards.isString(value)) return value

    try {
      return JSON.stringify(value)
    } catch (e) {
      return value
    }
  }

  public replaceItem(key: Key<T>, value: any): string {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    storage.removeItem(storageKey)
    const serializedValue = this.serializeValue(value)
    storage.setItem(storageKey, serializedValue)
    return serializedValue
  }

  public getItem(key: Key<T>, parseValue = true): string | null {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()

    let value = storage.getItem(storageKey)

    if (parseValue) {
      value = this.parseValue(value)
    }

    return value
  }

  public removeItem(key: Key<T>): void {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    storage.removeItem(storageKey)
  }

  public setItem(key: Key<T>, value: any): string {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    const serializedValue = this.serializeValue(value)
    storage.setItem(storageKey, serializedValue)
    return serializedValue
  }

  public clear(): void {
    const storage = this.getLocalStorage()
    storage.clear()
  }

  public multiSet(keyValuePairs: Array<[Key<T>, any]>): void {
    for (const [key, value] of keyValuePairs) {
      this.setItem(key, value)
    }
  }

  public multiRemove(keys: Key<T>[]): void {
    for (const key of keys) {
      this.removeItem(key)
    }
  }

  public multiGet(keys: Key<T>[]): Record<string, any> {
    const storage = this.getLocalStorage()
    const values: Record<string, any> = {}

    for (const key of keys) {
      const storageKey = this.getStorageKey(key)
      const value = storage.getItem(storageKey)
      
      values[key as string] = value
    }

    return values
  }

  public use<S = any>(
    key: Key<T>, 
    initialValue: any = null,
    options: UseLocalStorageOptions = {}
  ): [S, (to: S | ((prev: S) => S)) => any] {
    const { 
      disableListen = false, 
      setItemValueOnMutate = true,
      getItemValueOnMount = true,
      parseValueOnGet = true,
    } = options

    const [value, _setValue] = useState<S>(() => {
      return getItemValueOnMount ? (this.getItem(key, parseValueOnGet) ?? initialValue) : initialValue
    })
    
    useEffect(() => {
      const handler = () => {
        let _initialValue = initialValue
        let storedValue = this.getItem(key, parseValueOnGet)

        if (!TypeGuards.isNil(storedValue) && getItemValueOnMount) {
          _initialValue = this.parseValue(storedValue)
        }

        _setValue(_initialValue)
      }

      handler()

      return disableListen ? null : this.listen(key, handler)
    }, [])

    const setValue = (to: S | ((prev:S) => S)) => {
      return _setValue((prev) => {
        let newValue = prev

        if (!TypeGuards.isFunction(to)) {
          newValue = to
        } else {
          const fn = to as ((prev:S) => S)
          newValue = fn(value)
        }

        if (setItemValueOnMutate) {
          this.setItem(key, newValue)
        }

        return newValue
      })
    }

    return [value, setValue]
  }

  public listen(key: Key<T>, handler: LocalStorageHandler<Key<T>>) {
    const trigger = (event: StorageEvent) => {
      const storageKey = this.getStorageKey(key)

      if (event?.key === storageKey) {
        handler(key, event, this.parseValue(event?.newValue))
      }
    }

    const newLength = this.storageListeners.push(trigger)
    window.addEventListener('storage', trigger)

    return () => {
      this.storageListeners.splice(newLength - 1, 1)
      window.removeEventListener('storage', trigger)
    }
  }
}
