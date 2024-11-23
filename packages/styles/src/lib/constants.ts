// @ts-ignore
const isBrowser = ():boolean => typeof document !== 'undefined'

export const StyleConstants = {
  STORES_PERSIST_VERSION: 1,
  STORE_CACHE_ENABLED: true,
  CACHE_ENABLED: true,
  IS_BROWSER: isBrowser() as boolean,
}
