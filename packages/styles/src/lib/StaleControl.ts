
export class StaleControl {
  private wiperId: NodeJS.Timeout = null

  constructor(
    private staleTime: number = 60, // minutes
    private staleTimeIdentifier: string = '//:',
    private wiperInterval: number = 30 * 60 * 1000, // 30 minutes
  ) {}

  isStaled(value: string) {
    const { staleTime } = this.extractStaleTime(value)

    const currentTime = new Date()

    const isStaled = currentTime > staleTime

    return isStaled
  }

  insertStaleTime(value: string) {
    let currentTime = new Date()

    currentTime.setMinutes(currentTime.getMinutes() + this.staleTime)

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

  /**
   * wipe staled cache; verify isStaled values and remove
   */
  cacheWiper() {
    throw new Error('Cache Wiper not implement')
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
