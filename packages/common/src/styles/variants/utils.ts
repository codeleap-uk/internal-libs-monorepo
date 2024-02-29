import { AnyFunction } from 'callsites'
import { CSSProperties } from 'react'
import { VariantProp } from '.'
import { AppTheme, BorderIdentifiers, EnhancedTheme } from '..'
import { VariantList, VariantsOf } from '../../types'
import { deepMerge } from '../../utils/object'
import {
  ApplyVariantsArgs,
  DefaultVariantBuilder,
  FromVariantsBuilder,
} from './types'

export function mapVariants<
  S = CSSProperties,
  T extends DefaultVariantBuilder<S> = DefaultVariantBuilder<S>
>(theme: EnhancedTheme<any>, variantsObject: T) {
  const thisComponentVariants = {} as FromVariantsBuilder<S, T>

  for (const [variantName, variantBuilder] of Object.entries(variantsObject)) {
    // @ts-ignore
    thisComponentVariants[variantName as keyof T] = (t) => variantBuilder(
      t,
      variantName,
    ) as ReturnType<T[keyof T]>
  }

  return thisComponentVariants
}

export function standardizeVariants<T = any, V extends VariantList<VariantsOf<T>> = VariantList<VariantsOf<T>>>(variants: VariantProp<any>): V {
  let variantList = []
  if (!variants) return [] as unknown as V
  if (typeof variants === 'string') {
    variantList = variants.split(' ')
  } else {
    variantList = [...(variants.filter((v) => !!v) || [])]
  }
  return variantList as unknown as V
}

export function applyVariants({
  computedStyles,
  rootElement = 'wrapper',
  styles,
  theme,
  variantName,
  wrapStyle = (style) => style,
}: ApplyVariantsArgs) {
  if (typeof variantName !== 'string') return {}
  if (!styles[variantName]) {
    if (variantName.startsWith('padding') || variantName.startsWith('margin') || variantName.startsWith('gap')) {
      const [spacingFunction, multiplier] = variantName.split(':')
      let arg: number | string = Number(multiplier)
      if (Number.isNaN(arg)) {
        arg = multiplier
      }

      return deepMerge(computedStyles, {
        [rootElement]: wrapStyle({
          ...theme.spacing[spacingFunction](arg),
        }),
      })
    } else if (variantName.startsWith('d:') && styles.dynamicHandler) {
      return deepMerge(
        computedStyles,
        styles.dynamicHandler(theme, variantName.replace('d:', '')),
      )
    } else if (variantName.startsWith('w:') || variantName.startsWith('h:')) {
      const [dimension, size] = variantName.split(':')

      let value:string|number = 0

      if (size.endsWith('su')) {
        value = theme.spacing.value(
          Number(size.replace('su', '').trim()),
        )
      } else if (size.endsWith('px')) {
        value = Number(size.replace('px', '').trim())

      } else {
        value = `${size}%`
      }

      const dim = dimension === 'w' ? 'width' : 'height'

      return deepMerge(computedStyles, {
        [rootElement]: wrapStyle({
          [dim]: value,
        }),
      })
    } else if (variantName.startsWith('backgroundColor') || variantName.startsWith('bg') || variantName.startsWith('color')) {
      let [property, themeColor] = variantName.split(':')

      const _rootElement = variantName.startsWith('color') ? (rootElement === 'text' ? rootElement : 'text') : rootElement

      if (property === 'bg') property = 'backgroundColor'

      const value = theme.colors[themeColor]
      const browserOnly = theme.IsBrowser && { fill: value, stroke: value }
      return deepMerge(computedStyles, {
        [_rootElement]: wrapStyle({
          [property]: value,
          ...browserOnly,
        }),
      })
    } else if (variantName.startsWith('border')) {
      const [properties, value] = variantName.split(':')
      const [property, type] = properties.split('-')

      let borderStyle = {}
      switch (type as BorderIdentifiers) {
        case 'width':
          borderStyle = { [`${property}Width`]: theme.values.borderWidth[value] }
          break
        case 'style':
          borderStyle = { [`${property}Style`]: value }
          break
        case 'radius':
          borderStyle = { [`${property}Radius`]: theme.borderRadius[value] }
          break
        case 'color':
          borderStyle = { [`${property}Color`]: theme.colors[value] }
          break
        default:
          break
      }

      return deepMerge(computedStyles, { [rootElement]: wrapStyle(borderStyle) })
    } else if (variantName.startsWith('scale') || variantName.startsWith('rotate') || variantName.startsWith('translate')) {
      const [property, value] = variantName.split(':')

      return deepMerge(computedStyles, {
        [rootElement]: wrapStyle({
          transform: theme.IsBrowser ? `${property}(${value})` : [{
            [property]: property !== 'rotate' ? Number(value) : value,
          }],
        }),
      })
    } else if (theme.IsBrowser) {
      if (variantName.startsWith('cursor')) {
        const [property, value] = variantName.split(':')

        return deepMerge(computedStyles, {
          [rootElement]: wrapStyle({
            [property]: value,
          }),
        })
      }
    }

    return computedStyles
  } else {
    const wrapped = {}
    const overWriteStyles = styles[variantName](theme)
    for (const [key, val] of Object.entries(overWriteStyles)) {
      wrapped[key] = wrapStyle(val)
    }
    return deepMerge(computedStyles, wrapped)
  }
}
