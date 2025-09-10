import { StateStorage } from '../types/store'
import { minifier } from '../tools'

export type StoragePersistor = {
  set: (key: string, value: any) => void
  get: (key: string) => any
  del: (key: string) => void
}

export class StylePersistor implements StateStorage {
  /**
   * Creates a new StylePersistor instance with compression capabilities
   * @param {StoragePersistor} storage - The underlying storage implementation
   */
  constructor(
    private storage: StoragePersistor
  ) { }

  /**
   * Stores a value in the underlying storage with compression
   * 
   * @param {string} name - Storage key identifier
   * @param {string} value - Value to store (will be compressed)
   * @returns {void}
   * @throws {Error} If the underlying storage fails to set the value
   */
  setItem(name: string, value: string): void {
    const minifiedValue = minifier.compress(value)

    return this.storage.set(name, minifiedValue)
  }

  /**
   * Retrieves and decompresses a value from storage
   * Returns null if key doesn't exist, value is null/undefined, or decompression fails
   * 
   * @param {string} name - Storage key identifier
   * @returns {string | null} Decompressed value or null if not found/invalid
   * @throws {Error} If the underlying storage fails to get the value
   */
  getItem(name: string): string | null {
    const persistedValue = this.storage.get(name)

    return minifier.decompress(persistedValue ?? null)
  }

  /**
   * Removes an item from storage
   * 
   * @param {string} name - Storage key identifier
   * @returns {void}
   * @throws {Error} If the underlying storage fails to delete the value
   */
  removeItem(name: string): void {
    return this.storage.del(name)
  }
}
