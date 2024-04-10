import { IColors, ICSS } from '../types'
import { borderDirection } from './dynamicVariants'
import { themeStore } from './themeStore'
import { capitalize } from './utils'

type Args = {
  color: keyof IColors
  width?: number | string
  // @ts-ignore
  style?: ICSS['borderStyle']
  directions?: typeof borderDirection[number][]
}

export type BorderBuilder = (args: Args) => ICSS

export const borderBuilder: BorderBuilder = (args) => {
  const { 
    color: colorKey, 
    width = 1, 
    style = 'solid', 
    directions = ['left', 'top', 'bottom', 'right'] 
  } = args

  const color = themeStore.getState().current['colors']?.[colorKey]

  if (!color) {
    throw new Error(`Border cannot be create for "color ${colorKey}" not exists in theme.`)
  }

  const borderStyles: ICSS = {}

  for (const direction of directions) {
    const property = `border${capitalize(direction)}`
    
    borderStyles[`${property}Color`] = color
    borderStyles[`${property}Width`] = width
    
    if (!!window.navigator) {
      borderStyles[`${property}Style`] = style
    }
  }

  return borderStyles
}
