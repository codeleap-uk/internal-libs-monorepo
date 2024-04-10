
// [] inserir um stale na key, entre {{}}
// [] no wipe passar pelas keys e remover aquelas que passou o tempo
// [] sempre que acessar uma key, tem que renovar o stale dela
// [] precisa de um método pra pegar a key sem o stale, talvez um método só pra checar se existe
// [] storage com stale time

export const CACHE_WIPE_INTERVAL = 1000 // 15 * 60 * 1000 // 15 minutes

export class StaleControl {
  wiperId: NodeJS.Timer = null

  staleTime: number = 30 // seconds

  staleTimeIdentifier: string = '//:'

  constructor() {

  }

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
    console.log('Cache Wiper')
    // wipe staled caches
  }

  registerCacheWiper() {
    if (this.wiperId !== null) {
      this.unregisterCacheWiper()
    }

    this.wiperId = setInterval(() => {
      this.cacheWiper()
    }, CACHE_WIPE_INTERVAL)
  }

  unregisterCacheWiper() {
    clearInterval(this.wiperId)
    this.wiperId = null
  }
}
