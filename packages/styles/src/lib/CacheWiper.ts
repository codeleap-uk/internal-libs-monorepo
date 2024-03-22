
// [] inserir um stale na key, entre {{}}
// [] no wipe passar pelas keys e remover aquelas que passou o tempo
// [] sempre que acessar uma key, tem que renovar o stale dela
// [] precisa de um método pra pegar a key sem o stale, talvez um método só pra checar se existe

import { CACHE_WIPE_INTERVAL } from './cache'

export class CacheWiper {
  wiperId: NodeJS.Timer = null

  constructor() {

  }

  cacheWiper() {
    console.log('Cache Wiper')
    // wipe staled caches
  }

  setCacheWiper() {
    if (this.wiperId !== null) {
      this.cancelCacheWiper()
    }

    this.wiperId = setInterval(() => {
      this.cacheWiper()
    }, CACHE_WIPE_INTERVAL)
  }

  cancelCacheWiper() {
    clearInterval(this.wiperId)
    this.wiperId = null
  }
}
