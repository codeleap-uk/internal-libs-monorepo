type ColorMap = {
  [key: string]: string
}

type BreakpointMap = {
  [key: string]: number
}

export type Theme = {
  colors: ColorMap
  alternateColors?: {
    [key: string]: ColorMap
  }
  breakpoints?: BreakpointMap
}

export type DefaultColorSchemeName = 'default'

export type ColorScheme<T extends Theme = Theme> = DefaultColorSchemeName | keyof T['alternateColors']

export type AppTheme<T extends Theme> = {
  colors: T['colors']
  breakpoints: T['breakpoints']
  setColorScheme: (colorScheme: ColorScheme<T>) => void
  currentColorScheme: ColorScheme<T>
}
