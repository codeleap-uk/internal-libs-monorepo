import { IColors } from '../types'
import { themeStore } from './themeStore'

export const dynamicVariants = [
  'backgroundColor', 
  'color',
  'borderColor'
] as const

export type DynamicVariants = typeof dynamicVariants[number]

export type DynamicPresets = `${DynamicVariants}:${keyof IColors}`

export const icss: React.CSSProperties = {
}

export const getDynamicPreset = () => {
  
}

export const createDynamicPresets = () => {
  const colors: Record<string, string> = themeStore.getState().current['colors']

  const dynamicPresets = {}

  dynamicVariants.map(variant => {
    dynamicPresets[`${variant}`] = (color: keyof IColors) => ({
      [variant]: colors[color]
    })
  })

  return dynamicPresets
}
