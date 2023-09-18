import React from 'react'

export * from './Settings'
export * from './logger'
export * from './theme'
export * from './performance'
export { LocalStorageKeys, IS_SSR } from './constants'

export * from './api'

export type { AppIcon } from './assets/icons'
export { IconNames, iconImages } from './assets/icons'
import * as AppImages from './assets/images' 
import * as ComponentStyleSheets from './stylesheets'

export { default as licenses } from './license.json'
export { default as timestamp } from './timestamp.json'

export { assignTextStyle } from './stylesheets/Text'

export {
  React,
  AppImages,
  ComponentStyleSheets,
}
