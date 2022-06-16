import {
  PartialComponentStyle,
  CommonVariantObject,
  GetStylesArgs,
  ComponentStyleMap,
  TypedComponents,
} from './types'
import { mapVariants, standardizeVariants, applyVariants } from './utils'
import { DefaultVariants, DEFAULT_VARIANTS, DEFAULT_STYLES } from './defaults'
import { AppTheme, EnhancedTheme } from '../types'
import { AnyFunction, NestedKeys } from '../../types'
import { mapObject, TypeGuards } from '../../utils'

import { silentLogger } from '../../constants'
import { FunctionType } from '../../types'
import { ThemeColorScheme } from '.'
import { createBorderHelpers } from '../helpers'
const SCOPE = 'Styles'

type GetThemeWithColorSchemeReturn<T extends EnhancedTheme> = Omit<T, 'colors'> & { colors: T['colors'][keyof T['colors']]}

function getThemeWithColorScheme<T extends EnhancedTheme>(theme:T, scheme: keyof T['colors']):GetThemeWithColorSchemeReturn<T> {
  return {
    ...theme,
    colors: theme.colors[scheme as string],
  } as unknown as GetThemeWithColorSchemeReturn<T>
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

  // @ts-ignore
  colorSchemeListeners:FunctionType<[Theme], any>[] = []

  styleSheets = {}

  constructor(theme: Theme, rootStyleFunction?: RootStyler, public logger = silentLogger) {
    this.createStylesheet = rootStyleFunction || (((a) => a) as RootStyler)
    this.theme = theme
  }

  getDefaultVariants(): DefaultVariants<CSSIn>;

  getDefaultVariants<ComponentName extends keyof DefaultVariants>(
    componentName?: ComponentName
  ): DefaultVariants<CSSIn>[ComponentName];

  getDefaultVariants(componentName?: keyof DEFAULT_VARIANTS) {

    const TransformedVariants = {} as DefaultVariants<CSSIn>
    try {

      if (!componentName) {
        Object.entries(DEFAULT_STYLES).forEach(([component, variantsObject]) => {
          TransformedVariants[component] = mapVariants(
            // @ts-ignore
            this.withColorScheme(),
            variantsObject,
          )

        })

        return TransformedVariants as DefaultVariants<CSSIn>
      } else {

        return mapVariants<CSSIn>(this.withColorScheme(), DEFAULT_STYLES[componentName])
      }
    } catch (e) {
      throw new Error(`Error on getDefaultVariants ${componentName || 'AllComponents'} ${e}`)
    }
  }

  withColorScheme(scheme?: string) {
    // @ts-ignore
    return getThemeWithColorScheme(this.theme, scheme || this.theme.theme)
  }

  createComponentStyle<T extends Record<string, CSSIn> = Record<string, CSSIn>>(
    styles: FunctionType<[ThemeColorScheme<AT>], T>, staticStyles?: false, useTheme?: keyof AT['colors'],
  ):FunctionType<[Theme], T>

  createComponentStyle<T extends Record<string, CSSIn> = Record<string, CSSIn>>(
    styles: T, staticStyles?: true, useTheme?: keyof AT['colors'],
  ):T

  createComponentStyle<T extends Record<string, CSSIn> = Record<string, CSSIn>>(
    styles: FunctionType<[ThemeColorScheme<AT>], T>, staticStyles?: true, useTheme?: keyof AT['colors'],
  ):T

  createComponentStyle<T extends Record<string, CSSIn> = Record<string, CSSIn>>(
    styles: T | FunctionType<[Theme], T>, staticStyles = false, useTheme?: keyof AT['colors'],
  ) {
    try {

      const isFunction = TypeGuards.isFunction(styles)
      if (staticStyles) {
        // @ts-ignore
        const styleObject = isFunction ? styles(this.withColorScheme(useTheme)) : styles

        const styleMap = mapObject(styleObject, ([key, value]) => [
          key,
          this.createStylesheet(value),
        ])
        return Object.fromEntries(styleMap) as Record<keyof T, CSSIn>

      } else {
        if (!isFunction) {
          throw new Error(`
            createComponentStyle was called with a non function styles argument and staticStyles set to false.
            Either use a function as the styles argument, or enable staticStyles to get rid of this error.
          `)
        }

        return styles
      }
    } catch (e) {
      this.logger.error('createComponentStyle', {
        arguments,
        e,
      })
    }
  }

  createVariantFactory<
    Composition extends string,
    T = PartialComponentStyle<Composition, CSSIn>
  >(name = '') {
    return (variant: ((theme: ThemeColorScheme<AT>) => T)) => {
      try {

        if (TypeGuards.isFunction(variant)) {
          const themeGetter = variant

          return themeGetter
        }
        return variant
      } catch (e) {
        this.logger.error(`Error on variant factory for ${name}`, e, SCOPE)
      }
    }
  }

  getStyles<VariantObject extends CommonVariantObject<any, CSSIn>>(
    ...args: GetStylesArgs<
      VariantObject,
      Theme,
      keyof VariantObject[keyof VariantObject]
    >
  ) {
    const [
      styles,
      {
        variants,
        rootElement = 'wrapper',
        responsiveVariants,
        styles: override,
        debugName = '',
      },
      useTheme,
    ] = args
    const variantList = standardizeVariants(variants)
    try {

      let computedStyles = {} as Record<string, CSSOut>
      for (const variant of ['default', ...variantList]) {
        computedStyles = applyVariants({
          computedStyles,
          rootElement,
          styles,
          // @ts-ignore
          theme: this.withColorScheme(useTheme),
          variantName: variant,
        })
      }

      if (responsiveVariants) {
        for (const breakpoint in responsiveVariants) {
          const shouldApplyResponsiveVariants = this.theme.hooks.down(breakpoint)

          if (shouldApplyResponsiveVariants) {
            const responseVariantList = standardizeVariants(
              responsiveVariants[breakpoint],
            )

            for (const variant of responseVariantList) {
              computedStyles = applyVariants({
                computedStyles,
                rootElement,
                styles,
                // @ts-ignore
                theme: this.withColorScheme(useTheme),
                variantName: variant,
              })
            }
          }
        }
      }

      const appliableStyles = Object.fromEntries(
        mapObject(computedStyles, ([k, v]) => [
          k,
          this.createStylesheet({ ...v, ...override?.[k] }),
        ]),
      ) as Record<NestedKeys<VariantObject>, CSSOut>
      return appliableStyles
    } catch (e) {
      this.logger.error(`Error on getStyles for Component ${debugName} \n${variantList.join('\n')}\n` + debugName, e, SCOPE)
      return {}
    }
  }

  typeComponents<T extends ComponentStyleMap<CSSIn>>(components: T) {
    const typed = {}

    for (const [name, [render]] of Object.entries(components)) {
      typed[name] = render
    }

    return typed as unknown as TypedComponents<T, Theme>
  }

  setColorScheme(to: keyof AT['colors']) {
    this.theme.theme = to
    // @ts-ignore
    this.theme.border = createBorderHelpers(this.theme, this.theme.IsBrowser, to)

    this.colorSchemeListeners.forEach(l => l(this.theme))
  }

  onColorSchemeChange(callback:FunctionType<[Theme], any>) {
    const newLen = this.colorSchemeListeners.push(callback)

    return () => {
      this.colorSchemeListeners.splice(newLen - 1)
    }
  }
}
