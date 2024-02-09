import { IBorderRadius, IColors } from '../types'
import { themeStore } from './themeStore'
import { capitalize } from './utils'

export type VariantFunction = (value: any) => any

export const colorVariants = ['backgroundColor', 'color'] as const

export const borderXDirection = ['left', 'right'] as const
export const borderYDirection = ['bottom', 'top'] as const
export const borderDirection = [...borderYDirection, ...borderXDirection, ''] as const
export const borderProperties = ['color', 'radius', 'width'] as const

export const cursorTypes = [
  'not-allowed', 
  'help', 
  'pointer', 
  'wait', 
  ''
] as const

export type DynamicPresets = 
  `${typeof colorVariants[number]}:${keyof IColors}` |
  `border${Capitalize<typeof borderDirection[number]>}Width:${keyof IBorderRadius}` |
  `border${Capitalize<typeof borderDirection[number]>}Color:${keyof IColors}` |
  `borderRadius:${keyof IBorderRadius}` |
  `border${Capitalize<typeof borderYDirection[number]>}${Capitalize<typeof borderXDirection[number]>}Radius:${keyof IBorderRadius}` |
  `cursor:${typeof cursorTypes[number]}` |
  `bg:${keyof IColors}`

export const createDynamicPresets = () => {
  const colors: () => IColors = () => themeStore.getState().current['colors']
  const borderValues: IBorderRadius = themeStore.getState().current['borderRadius']

  const dynamicVariants = {}

  function createVariant(variantName: string, variantReturn: any) {
    dynamicVariants[variantName] = variantReturn
  }

  colorVariants.forEach(variant => {
    createVariant(variant, (color: keyof IColors) => ({
      [variant]: colors()[color]
    }))
  })

  borderDirection.forEach(direction => {
    if (borderYDirection.includes(direction as any)) {
      borderXDirection.forEach(y => {
        const variant = `border${capitalize(direction)}${capitalize(y)}Radius`

        createVariant(variant, (value: keyof IBorderRadius) => ({
          [variant]: borderValues[value]
        }))
      })
    }

    borderProperties.forEach(property => {
      const variant = `border${capitalize(direction)}${capitalize(property)}`

      createVariant(variant, (value) => ({
        [variant]: property == 'color' ? colors()[value] : borderValues[value]
      }))
    })
  })

  createVariant('cursor', (cursorType: typeof cursorTypes[number]) => ({
    cursor: cursorType
  }))

  createVariant('bg', (color: keyof IColors) => ({ 
    backgroundColor: colors()[color] 
  }))

  console.log({
    ...dynamicVariants,
  })

  return dynamicVariants
}
