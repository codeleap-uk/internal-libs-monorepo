export class Collection<
    T extends Record<string, any>,
    K extends keyof T,
    KT extends T[K],

> extends Array {

  indexMap:Record<KT, number>

  indexKey: K

  constructor(items: T[], indexKey: K) {
    //@ts-ignore
    super()
    this.push(...items)
    this.indexKey = indexKey

    this.indexMap = Object.fromEntries(
      this.map((i, idx) => [i[this.indexKey], idx]),
    )

  }

  updateIndexMap() {
    this.indexMap = Object.fromEntries(
      this.map((i, idx) => [i[this.indexKey], idx]),
    )
  }

  getItem<D extends unknown>(key: KT, defaultValue?:D): T {
    this.updateIndexMap()

    if (!defaultValue) {
      defaultValue = null
    }

    if (!this.hasItem(key)) {
      return defaultValue as T
    }

    const val = this?.[this.indexMap[key]]

    return val
  }

  setItem(key: KT, to: Omit<T, K>) {
    this.updateIndexMap()
    const current = this[this.indexMap[key]]

    // @ts-ignore
    this[this.indexMap[key]] = {
      ...to,
      [this.indexKey]: current[this.indexKey],
    }

  }

  hasItem(key:KT) {
    this.updateIndexMap()

    return key in this.indexMap
  }
}

