import React from 'react'
import { onMount, TypeGuards, useState } from '@codeleap/common'

export type LocalStorageHandler<T> = (key: T, event: StorageEvent) => void
export type Key<T> = keyof T

export class LocalStorage<T extends Record<string, string>> {
  public storageKeys: T

  private storageListeners: LocalStorageHandler<Key<T>>[] = []

  constructor(keys: T) {
    this.storageKeys = keys
  }

  public getLocalStorage(): Storage {
    if (typeof window === 'undefined') {
      return {} as Storage
    }
    return localStorage
  }

  public getStorageKey(key: Key<T>): string {
    return String(this.storageKeys[key] ?? key)
  }

  private parseValue(value: any): string {
    if (TypeGuards.isString(value)) return value
    return JSON.stringify(value)
  }

  public replaceItem(key: Key<T>, value: any): string {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    storage.removeItem(storageKey)
    const parsedValue = this.parseValue(value)
    storage.setItem(storageKey, parsedValue)
    return parsedValue
  }

  public getItem(key: Key<T>): string | null {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    return storage.getItem(storageKey)
  }

  public removeItem(key: Key<T>): void {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    storage.removeItem(storageKey)
  }

  public setItem(key: Key<T>, value: any): string {
    const storageKey = this.getStorageKey(key)
    const storage = this.getLocalStorage()
    const parsedValue = this.parseValue(value)
    storage.setItem(storageKey, parsedValue)
    return parsedValue
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

  public use<S = any>(key: Key<T>, value: any): [S, (to: S | ((prev: S) => S)) => any] {
    const [_value, _setValue] = useState<S>(value)

    onMount(() => {
      let initialValue = value
      let storedValue = this.getItem(key)

      if (TypeGuards.isString(storedValue)) {
        initialValue = JSON.parse(storedValue)
      }

      _setValue(initialValue)
    })

    const setValue = (to: S | ((prev:S) => S)) => {
      return _setValue((prev) => {
        let newValue = prev

        if (!TypeGuards.isFunction(to)) {
          newValue = to
        } else {
          newValue = to(value)
        }

        this.setItem(key, newValue)

        return newValue
      })
    }

    return [_value, setValue]
  }

  public listen(key: Key<T>, handler: LocalStorageHandler<Key<T>>) {
    const newLength = this.storageListeners.push(handler)

    return () => {
      this.storageListeners.splice(newLength - 1, 1)
    }
  }

  public useValue(
    key: Key<T>, 
    handler: (newValue: string | null | undefined, event: StorageEvent) => void, 
    deps: Array<any>,
    options: AddEventListenerOptions = {}
  ) {
    React.useEffect(() => {
      if (typeof window === 'undefined') {
        return null
      }

      const listener = (event: StorageEvent) => {
        const storageKey = this.getStorageKey(key)
  
        if (event?.key === storageKey) {
          handler(event?.newValue, event)
        }
      }

      window.addEventListener('storage', listener, options)

      return () => {
        window.removeEventListener('storage', listener)
      }
    }, deps)
  }
}
