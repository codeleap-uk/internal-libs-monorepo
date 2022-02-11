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
import { mapObject } from '../../utils'
import { Logger } from '../../tools/Logger'
import { silentLogger } from '../../constants'

const SCOPE = 'Styles'

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
  createStylesheet: RootStyler;

  theme: Theme;

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
            this.theme,
            variantsObject,
          )
        })
          
        return TransformedVariants as DefaultVariants<CSSIn>
      } else {
        return mapVariants<CSSIn>(this.theme, DEFAULT_STYLES[componentName])
      }
    } catch (e){
      throw new Error(`Error on getDefaultVariants ${componentName||'AllComponents'} ${e}`)
    }
  }

  createComponentStyle<T extends Record<string, CSSIn> = Record<string, CSSIn>>(
    styles: T,
  ) {
    const styleMap = mapObject(styles, ([key, value]) => [
      key,
      this.createStylesheet(value),
    ])
    return Object.fromEntries(styleMap) as Record<keyof T, CSSIn>
  }

  createVariantFactory<
    Composition extends string,
    T = PartialComponentStyle<Composition, CSSIn>
  >(name = '') {
    return (variant: ((theme: Theme) => T) | T) => {
      try {

        if (typeof variant === 'function') {
          const themeGetter = variant as (theme: Theme) => T
          return themeGetter(this.theme)
        }
        return variant
      } catch (e){
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
    ] = args
    const variantList = standardizeVariants(variants)
    try {
    

      let computedStyles = {} as Record<string, CSSOut>

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
            const responseVariantList = standardizeVariants(
              responsiveVariants[breakpoint],
            )

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

      const appliableStyles = Object.fromEntries(
        mapObject(computedStyles, ([k, v]) => [
          k,
          this.createStylesheet({ ...v, ...override?.[k] }),
        ]),
      ) as Record<NestedKeys<VariantObject>, CSSOut>
      return appliableStyles
    } catch (e){
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
}
