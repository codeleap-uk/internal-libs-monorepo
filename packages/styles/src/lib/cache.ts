import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import valueHash from 'object-hash'
import { ICSS } from '../types'

export const STORES_PERSIST_VERSION = 7

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
  },
))

export const hashKey = (value: Array<any> | object) => {
  if (typeof value == 'object') {
    value[styleKey] = version
  }

  if (Array.isArray(value)) {
    value.push({ [styleKey]: version })
  }

  return valueHash(value)
}