
export class StaleControl {
  private wiperId: NodeJS.Timer = null

  constructor(
    private staleTime: number = 30,
    private staleTimeIdentifier: string = '//:',
    private wiperInterval: number = 1000 // 15 * 60 * 1000
  ) {}

  isStaled(value: string) {
    const { staleTime } = this.extractStaleTime(value)

    const currentTime = new Date()

    const isStaled = currentTime > staleTime

    return isStaled
  }

  insertStaleTime(value: string) {
    let currentTime = new Date()

    currentTime.setSeconds(currentTime.getSeconds() + this.staleTime)

    const staleTime = currentTime.toISOString()

    const valueWithStaleTime = `${value}${this.staleTimeIdentifier}${staleTime}`

    return valueWithStaleTime
  }

  refreshStaleTime(value: string) {
    const { value: extractedValue } = this.extractStaleTime(value)

    const refreshedValue = this.insertStaleTime(extractedValue)

    return refreshedValue
  }

  extractStaleTime(value: string) {
    const [extractedValue, _staleTime] = value?.split(this.staleTimeIdentifier)

    const staleTime = new Date(_staleTime)

    return {
      staleTime,
      value: extractedValue,
    }
  }

  cacheWiper() {
    // wipe staled caches
    // verify isStaled and remove
  }

  registerCacheWiper() {
    if (this.wiperId !== null) {
      this.unregisterCacheWiper()
    }

    this.wiperId = setInterval(() => {
      this.cacheWiper()
    }, this.wiperInterval)
  }

  unregisterCacheWiper() {
    clearInterval(this.wiperId)
    this.wiperId = null
  }
}
