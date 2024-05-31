import { StateStorage } from 'zustand/middleware'
import { minifier } from './minifier'

export type StoragePersistor = {
  set: (key: string, value: any) => void
  get: (key: string) => any
  del: (key: string) => void
}

export class StylePersistor implements StateStorage {
  constructor(
    private storage: StoragePersistor
  ) {}

  setItem(name: string, _value: string): void {
    const value = minifier.compress(_value)
    
    return this.storage.set(name, value)
  }

  getItem(name: string): string | null {
    const persistedValue = this.storage?.get(name)

    return minifier.decompress(persistedValue ?? null)
  }

  removeItem(name: string): void {
    return this.storage.del(name)
  }
}
