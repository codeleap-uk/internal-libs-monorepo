import { hashKey } from './hashKey'

export class Cache<T extends any = any> {
  cache: Record<string, T> = {}

  constructor(public name: string = 'StyleCache') {}

  keyFor(cacheBaseKey: string, data: Array<any> | any) {
    let values = []

    if (Array.isArray(data)) {
      values = data.concat([cacheBaseKey])
    } else {
      values.push(data)
    }

    const cacheKey = hashKey(values)
    const cachedValue = this.cache[cacheKey] ?? null

    return {
      key: cacheKey,
      value: cachedValue,
    }
  }

  cacheFor(key: string, cache: T) {
    this.cache[key] = cache
    return cache
  }

  setCache(cache: Record<string, T>) {
    this.cache = cache
  }

  clear() {
    this.cache = {}
  }
}
