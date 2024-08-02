import { StyleConstants } from '@codeleap/styles'

StyleConstants.STORES_PERSIST_VERSION = 1
StyleConstants.STORE_CACHE_ENABLED = process.env.NODE_ENV !== 'development'
StyleConstants.CACHE_ENABLED = true

import './theme'

import { WebStyleRegistry } from '@codeleap/web'

export * from './theme'
export * from './variants'

export const StyleRegistry = new WebStyleRegistry()
