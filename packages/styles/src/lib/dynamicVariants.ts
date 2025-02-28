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
  '',
] as const

export type Value =
  | number
  | ''

export type DynamicVariants =
  `color:${keyof IColors}` |
  `border${Capitalize<typeof borderDirection[number]>}Width:${keyof IBorderRadius}` |
  `border${Capitalize<typeof borderDirection[number]>}Color:${keyof IColors}` |
  `borderRadius:${keyof IBorderRadius}` |
  `border${Capitalize<typeof borderYDirection[number]>}${Capitalize<typeof borderXDirection[number]>}Radius:${keyof IBorderRadius}` |
  `cursor:${typeof cursorTypes[number]}` |
  `bg:${keyof IColors}` |
  `br:${keyof IBorderRadius}` |
  `scale:${Value}`

export const createDynamicVariants = () => {
  const dynamicVariants = {}

  function createVariant(variantName: string, variantReturn: any) {
    dynamicVariants[variantName] = variantReturn
  }

  colorVariants.forEach(variant => {
    createVariant(variant, (theme, color: keyof IColors) => ({
      [variant]: theme.baseColors[color],
    }))
  })

  borderDirection.forEach(direction => {
    if (borderYDirection.includes(direction as any)) {
      borderXDirection.forEach(y => {
        const variant = `border${capitalize(direction)}${capitalize(y)}Radius`

        createVariant(variant, (theme, value: keyof IBorderRadius) => ({
          [variant]: theme.radius[value],
        }))
      })
    }

    borderProperties.forEach(property => {
      const variant = `border${capitalize(direction)}${capitalize(property)}`

      createVariant(variant, (theme, value: string) => ({
        [variant]: property == 'color' ? theme.baseColors[value] : theme.radius[value],
      }))
    })
  })

  createVariant('cursor', (theme, cursor: typeof cursorTypes[number]) => ({ cursor }))

  createVariant('bg', (theme, color: keyof IColors) => ({
    backgroundColor: theme.baseColors[color],
  }))

  createVariant('effect', (theme, effect: keyof IEffects) => theme.effects[effect])

  createVariant('scale', (theme, value: any) => ({
    transform: theme.isBrowser ? `scale(${value})` : [{ 'scale': Number(value) }],
  }))

  createVariant('br', (theme, value: keyof IBorderRadius) => ({
    borderRadius: theme.radius[value],
  }))

  createVariant('borderRadius', (theme, value: keyof IBorderRadius) => ({
    borderRadius: theme.radius[value],
  }))

  return dynamicVariants
}

export const dynamicVariants = createDynamicVariants()
