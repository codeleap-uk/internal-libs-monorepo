import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ICSS } from '../types'

export const CACHE_WIPE_INTERVAL = 1000 // 15 * 60 * 1000 // 15 minutes

export const STORES_PERSIST_VERSION = 10

const styleKey = '@styles-version'
const version = require('../../package.json')?.version

export type StylesStore = {
  variantStyles: {
    [key: string]: any
  }
  styles: {
    [key: string]: any
  }
  cacheVariantStyle: (key: string, variantStyle: any) => void
  cacheStyles: (key: string, styles: ICSS[]) => void
  wipeCache: () => void
}

export const stylesStore = create(persist<StylesStore>(
  (set, get) => ({
    variantStyles: {},
    styles: {},
    cacheVariantStyle: (key: string, variantStyle: any) => {
      const newVariantStyles = get()?.variantStyles ?? {}

      newVariantStyles[key] = variantStyle

      set({ variantStyles: newVariantStyles })
    },
    cacheStyles: (key: string, styles: ICSS[]) => {
      const newStyles = get()?.styles ?? {}

      newStyles[key] = styles

      set({ styles: newStyles })
    },
    wipeCache: () => {
      set({ 
        styles: {}, 
        variantStyles: {} 
      })
    }
  }),
  {
    name: '@styles.stores.stylesRegistry',
    version: STORES_PERSIST_VERSION,
    migrate: (persistedState: StylesStore, version) => {
      console.log('DSD', { version, STORES_PERSIST_VERSION })
      if (version != STORES_PERSIST_VERSION) {
        persistedState.styles = {}
        persistedState.variantStyles = {}
        
        return persistedState
      }

      return persistedState as StylesStore
    },
  },
))

export const hashKey = (value: Array<any> | object) => {
  if (typeof value == 'object') {
    value[styleKey] = version
  }

  if (Array.isArray(value)) { 
    value.push({ [styleKey]: version })
  }

  return JSON.stringify(value)
}
