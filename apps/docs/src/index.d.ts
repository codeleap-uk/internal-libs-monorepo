import '@codeleap/styles'

import React from 'react'
import { Logger } from '@codeleap/common'
import type { AppThemeType, AppVariants } from './app/styles'

declare module '*.png' {
  const value: any
  export default value
}

declare global {
  const logger: Logger
}

type OmitCSSKeys = 'top' | 'bottom' | 'zIndex' | 'left' | 'right'

type Style = Omit<React.CSSProperties, OmitCSSKeys> & {
  right?: number | string
  left?: number | string
  top?: number | string
  bottom?: number | string
  zIndex?: number
}

type Colors = AppThemeType['colors']

type BorderRadius = AppThemeType['borderRadius']

type Breakpoints = AppThemeType['breakpoints']

type Effect = {
  boxShadow: Style['boxShadow'],
}

type Effects = AppThemeType['effects']

type ThemeAppIcons = AppThemeType['icons']

declare module '@codeleap/styles' {

  export interface ICSS extends Style {}

  export interface ITheme extends AppThemeType {}

  export interface IJSX extends React.ReactElement {}

  export interface IColors extends Colors {}

  export interface IBorderRadius extends BorderRadius {}

  export interface IAppVariants extends AppVariants {}

  export interface IBreakpoints extends Breakpoints {}

  export interface IEffect extends Effect {}

  export interface IEffects extends Effects {}

  export type AppIcon = keyof ThemeAppIcons
}
