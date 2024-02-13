import { IBorderRadius, IColors, IEffects } from '../types'
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

export type Value =
  | number
  | ''

export type DynamicPresets = 
  `${typeof colorVariants[number]}:${keyof IColors}` |
  `border${Capitalize<typeof borderDirection[number]>}Width:${keyof IBorderRadius}` |
  `border${Capitalize<typeof borderDirection[number]>}Color:${keyof IColors}` |
  `borderRadius:${keyof IBorderRadius}` |
  `border${Capitalize<typeof borderYDirection[number]>}${Capitalize<typeof borderXDirection[number]>}Radius:${keyof IBorderRadius}` |
  `cursor:${typeof cursorTypes[number]}` |
  `bg:${keyof IColors}` |
  `scale:${Value}`

export const createDynamicPresets = () => {
  const dynamicVariants = {}

  function createVariant(variantName: string, variantReturn: any) {
    dynamicVariants[variantName] = variantReturn
  }

  colorVariants.forEach(variant => {
    createVariant(variant, (theme, color: keyof IColors) => ({
      [variant]: theme['colors'][color]
    }))
  })

  borderDirection.forEach(direction => {
    if (borderYDirection.includes(direction as any)) {
      borderXDirection.forEach(y => {
        const variant = `border${capitalize(direction)}${capitalize(y)}Radius`

        createVariant(variant, (theme, value: keyof IBorderRadius) => ({
          [variant]: theme['borderRadius'][value]
        }))
      })
    }

    borderProperties.forEach(property => {
      const variant = `border${capitalize(direction)}${capitalize(property)}`

      createVariant(variant, (theme, value: string) => ({
        [variant]: property == 'color' ? theme['colors'][value] : theme['borderRadius'][value]
      }))
    })
  })

  createVariant('cursor', (cursorType: typeof cursorTypes[number]) => ({
    cursor: cursorType
  }))

  createVariant('bg', (theme, color: keyof IColors) => ({ 
    backgroundColor: theme['colors'][color] 
  }))

  createVariant('effect', (theme, effect: keyof IEffects) => theme['effects'][effect])

  createVariant('scale', (theme, value: any) => ({
    transform: !!window?.navigator ? `scale(${value})` : [{ 'scale': Number(value) }]
  }))

  console.log({
    ...dynamicVariants,
  })

  return dynamicVariants
}
