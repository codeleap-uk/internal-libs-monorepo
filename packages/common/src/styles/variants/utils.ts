/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-restricted-imports */
import { CSSProperties } from 'react'
import { ResponsiveVariantsProp, VariantProp } from '.'
import { AppTheme, EnhancedTheme } from '..'
import { ComponentVariants } from '../..'
import { AnyFunction, NestedKeys } from '../../types/utility'
import { deepMerge, mapObject } from '../../utils/object'
import { DEFAULT_VARIANTS, DEFAULT_STYLES, DefaultVariants } from './defaults'
import {
  CommonVariantObject,
  DefaultVariantBuilder,
  FromVariantsBuilder,
  PartialComponentStyle, 
} from './types'

function mapVariants<S = CSSProperties, 
T extends DefaultVariantBuilder<S> = DefaultVariantBuilder<S>>
(theme: EnhancedTheme<any>, variantsObject: T) {
  const thisComponentVariants = {} as FromVariantsBuilder<S, T>

  for (const [variantName, variantBuilder] of Object.entries(variantsObject)) {
    thisComponentVariants[variantName as keyof T] = variantBuilder(theme) as ReturnType<T[keyof T]>
  }

  return thisComponentVariants
}

export function standardizeVariants(variants:VariantProp<any>):string[] {
  let variantList = []
  if (typeof variants === 'string') {
    variantList = variants.split(' ')
  } else {
    variantList = [...variants]
  }
  return variantList
}

type GetStylesArgs<VariantObject, Theme extends EnhancedTheme<any>, Root> = [
  styles:VariantObject,
  variants: VariantProp<VariantObject>,
  rootElement?:Root,
  responsiveVariants?: ResponsiveVariantsProp<Theme, VariantObject>
]
type ApplyVariantsArgs = {
  variantName:string,
  styles: any,
  computedStyles:any,
  rootElement:any,
  theme:EnhancedTheme<any>
}

function applyVariants({ computedStyles, rootElement = 'wrapper', styles, theme, variantName }:ApplyVariantsArgs) {
  if (!styles[variantName]) {

    if (variantName.startsWith('padding') || variantName.startsWith('margin')) {

      const [spacingFunction, multiplier] = variantName.split(':')

      return deepMerge(computedStyles, {
        [rootElement]: {
          ...theme.spacing[spacingFunction](Number(multiplier)),
        },
      })
    }

    return computedStyles
  } else {
    return deepMerge(computedStyles, styles[variantName])
  }
}

type CT<StyleType> = [Component: React.FC<any>, style: CommonVariantObject<string, StyleType>]

type ComponentStyleMap<CSS = CSSProperties> = Partial<{
  [Property in keyof DefaultVariants] : CT<CSS>
}>

type ReplaceProps<T extends CT<any>, 
NewProps = ComponentVariants<T[1], any>, 
Props = Parameters<T[0]>[0]> = React.FC<Omit<Props, 'responsiveVariants'|'variants'> & NewProps>

type TypedComponents<T extends ComponentStyleMap = ComponentStyleMap, Theme extends EnhancedTheme<any> = EnhancedTheme<any>> = {
  [Property in keyof DEFAULT_VARIANTS] : ReplaceProps<T[Property], ComponentVariants<T[Property][1], Theme>>
}

/**
 * [[include:Variants.md]]
 */
export class VariantProvider<
  RootStyler extends AnyFunction,
  AT extends AppTheme,
  Theme extends EnhancedTheme<AT> = EnhancedTheme<AT>,
  CSSIn = Parameters<RootStyler>[0],
  CSSOut = ReturnType<RootStyler>
> {
  createStylesheet: RootStyler

  theme: Theme

  constructor(theme: Theme, rootStyleFunction?: RootStyler) {
    this.createStylesheet = rootStyleFunction || (((a) => a) as RootStyler)
    this.theme = theme
  }

  getDefaultVariants(): DefaultVariants<CSSIn>;

  getDefaultVariants<ComponentName extends keyof DefaultVariants>(componentName?: ComponentName): DefaultVariants<CSSIn>[ComponentName];

  getDefaultVariants(componentName?: keyof DEFAULT_VARIANTS) {
    const TransformedVariants = {} as DefaultVariants<CSSIn>

    if (!componentName) {
      Object.entries(DEFAULT_STYLES).forEach(([component, variantsObject]) => {

        TransformedVariants[component] = mapVariants(this.theme, variantsObject)
      })

      return TransformedVariants as DefaultVariants<CSSIn>
    } else {
      return mapVariants<CSSIn>(this.theme, DEFAULT_STYLES[componentName])
    }
  }


  createVariantFactory<Composition extends string, T = PartialComponentStyle<Composition, CSSIn>>() {
    return (variant: ((theme: Theme) => T) | T) => {
      if (typeof variant === 'function') {
        const themeGetter = variant as (theme: Theme) => T
        return themeGetter(this.theme)
      }
      return variant
    }
  }

  getStyles<VariantObject extends CommonVariantObject<any, CSSIn>>(...args:GetStylesArgs<VariantObject, Theme, keyof VariantObject[keyof VariantObject]>) {
    const [styles, variants, rootElement, responsiveVariants] = args
    const variantList = standardizeVariants(variants)

    let computedStyles = {}

    for (const variant of ['default', ...variantList]) {
      computedStyles = applyVariants({
        computedStyles,
        rootElement,
        styles,
        theme: this.theme,
        variantName: variant,
      })
    }

    if (responsiveVariants) {
      for (const breakpoint in responsiveVariants) {

        const shouldApplyResponsiveVariants = this.theme.hooks.down(breakpoint)

        if (shouldApplyResponsiveVariants) {

          const responseVariantList = standardizeVariants(responsiveVariants[breakpoint])

          for (const variant of responseVariantList) {
            computedStyles = applyVariants({
              computedStyles,
              rootElement,
              styles,
              theme: this.theme,
              variantName: variant,
            })
          }
        }
      }
    }

    const appliableStyles = Object.fromEntries(mapObject(computedStyles, ([k, v]) => [k, this.createStylesheet(v)])) as Record<
      NestedKeys<VariantObject>,
      CSSOut
    >
    return appliableStyles
  }


  typeComponents<T extends ComponentStyleMap<CSSIn>>(components:T) {
    const typedComponents = {} as TypedComponents<T>

    for (const [name, [Component, style]] of Object.entries(components)) {
      const ReactComponent = (props: Parameters<typeof Component>[0] & ComponentVariants<typeof style, Theme>) => {
        return Component({
          ...props,
        })
      }


      typedComponents[name] = ReactComponent
    }

    return typedComponents as TypedComponents<T, Theme>
  }
}


