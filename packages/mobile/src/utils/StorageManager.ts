import { MMKV } from 'react-native-mmkv'
import { AnyFunction, AnyRecord } from '@codeleap/types'

type StorageKey<T extends Record<string, any>> = keyof T | (string & {}) | ((allKeys: T) => string) | [keyof T, any]

type ValueTypeMap<V = AnyRecord> = {
  string: string
  number: number
  boolean: boolean
  object: V
}

export class StorageManager<T extends Record<string, any>> {
  public instance = new MMKV()

  public storageKeys: T

  constructor(keys: T) {
    this.storageKeys = keys
  }

  public getStorageKey(key: StorageKey<T>): string {
    if (typeof key == 'function') {
      return key(this.storageKeys)
    }

    if (Array.isArray(key)) {
      const [storageKey, value] = key

      const extractor = this.storageKeys?.[storageKey] as unknown as AnyFunction

      return extractor?.(value)
    }

    const storageKey = this.storageKeys?.[key]

    if (!!storageKey) {
      return storageKey
    } else {
      return key as string
    }
  }

  private parseValue(value: any) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }

  public exists(key: StorageKey<T>) {
    const storageKey = this.getStorageKey(key)
    return this.instance.contains(storageKey)
  }

  public get(key: StorageKey<T>, type: 'string'): string | undefined
  public get(key: StorageKey<T>, type: 'number'): number | undefined
  public get(key: StorageKey<T>, type: 'boolean'): boolean | undefined
  public get<V extends AnyRecord = AnyRecord>(key: StorageKey<T>): V | undefined
  public get<V extends AnyRecord = AnyRecord>(key: StorageKey<T>, type?: keyof ValueTypeMap<V>): ValueTypeMap<V>[keyof ValueTypeMap<V>] | undefined {
    const storageKey = this.getStorageKey(key)

    if (type === 'string') {
      return this.instance.getString(storageKey) as ValueTypeMap<V>[keyof ValueTypeMap<V>]
    } else if (type === 'number') {
      return this.instance.getNumber(storageKey) as ValueTypeMap<V>[keyof ValueTypeMap<V>]
    } else if (type === 'boolean') {
      return this.instance.getBoolean(storageKey) as ValueTypeMap<V>[keyof ValueTypeMap<V>]
    } else {
      const value = this.instance.getString(storageKey)

      return !!value ? this.parseValue(value) : undefined
    }
  }

  public set<V extends any>(key: StorageKey<T>, value: V) {
    const storageKey = this.getStorageKey(key)

    const isValidValue = typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean'

    const parsedValue = isValidValue ? value : JSON.stringify(value)

    this.instance.set(storageKey, parsedValue)
  }

  public remove(key: StorageKey<T>) {
    const storageKey = this.getStorageKey(key)

    this.instance.delete(storageKey)
  }

  public multiRemove(keys: Array<StorageKey<T>>) {
    for (const key of keys) {
      const storageKey = this.getStorageKey(key)
      this.instance.delete(storageKey)
    }
  }

  public multiGet(keys: Array<StorageKey<T>>): Partial<Record<keyof T, any>> {
    const values: Partial<Record<keyof T, any>> = {}

    for (const key of keys) {
      const storageKey = this.getStorageKey(key)
      const value = this.instance.getString(storageKey)
      
      values[key as keyof T] = value
    }

    return values
  }
}
