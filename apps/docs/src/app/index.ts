import React from 'react'

export * from './styles'
export * from './Settings'
export * from './logger'
export * from './constants'
export * from './api'

export type { AppIcon } from './assets/icons'
export { IconNames, iconImages } from './assets/icons'
import * as AppImages from './assets/images' 
import * as StyleSheets from './stylesheets'

export { default as licenses } from './license.json'
export { default as timestamp } from './timestamp.json'

export {
  React,
  AppImages,
  StyleSheets,
}
