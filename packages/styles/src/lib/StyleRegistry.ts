import { AnyStyledComponent, AppTheme, ICSS, SpacingMap, StyleProp, Theme, VariantStyleSheet } from '../types'
import { themeStore } from './themeStore'
import deepmerge from '@fastify/deepmerge'
import trieMemoize from "trie-memoize"
import { objectPickBy } from '@codeleap/common'
import { SpacingFunction } from './spacing'
import { createStyles } from './createStyles'
import { defaultPresets } from './presets'
import { createDynamicPresets, dynamicVariants } from './dynamicPresets'
export class CodeleapStyleRegistry {
  stylesheets: Record<string, VariantStyleSheet> = {}

  variantStyles: Record<string, ICSS> = {}

  commonVariantsStyles: Record<string, ICSS | SpacingFunction> = {}

  styles: Record<string, ICSS> = {}

  components: Record<string, AnyStyledComponent> = {}

  constructor() {}

  keyForVariants(componentName: string, variants:string[]) {
    const currentColorScheme = themeStore.getState().colorScheme

    return [
      componentName,
      currentColorScheme,
      ...variants.filter(Boolean),
    ].join('-')
  }

  computeCommonVariantStyle(componentName: string, variant: string) {
    const { rootElement } = this.getRegisteredComponent(componentName)

    if (variant?.includes('padding') || variant?.includes('margin') || variant?.includes('gap')) {
      const [variantName, value] = variant?.split(':')

      const spacingFn = this.commonVariantsStyles[variantName] as SpacingFunction

      return createStyles({
        [rootElement]: spacingFn(Number(value))
      })
    } else if (variant?.includes('backgroundColor') || variant?.includes('color') || variant?.includes('borderColor')) {
      const [variantName, value] = variant?.split(':')

      const colorFn = this.commonVariantsStyles[variantName] as any

      return createStyles({
        [rootElement]: colorFn(value)
      })
    } else {
      return createStyles({
        [rootElement]: this.commonVariantsStyles[variant]
      })
    }
  }

  computeVariantStyle(componentName: string, variants: string[]): [ICSS, string] {
    const key = this.keyForVariants(componentName, variants)

    if (this.variantStyles[key]) {
      return [this.variantStyles[key], key]
    }

    const stylesheet = this.stylesheets[componentName]

    if (!stylesheet) {
      throw new Error(`No variants registered for ${componentName}`)
    }

    const variantStyles = variants.map((variant) => {
      if (!!stylesheet[variant]) {
        return stylesheet[variant]
      } else {
        return this.computeCommonVariantStyle(componentName, variant)
      }
    })

    console.log(variantStyles)

    // @ts-ignore
    const mergedComposition = deepmerge({ all: true })(...variantStyles)

    this.variantStyles[key] = Object.fromEntries(
      Object.entries(mergedComposition).map(([key, value]) => {
        return [
          key,
          this.createStyle(value),
        ]
      }),
    )

    return [this.variantStyles[key], key]

  }

  isCompositionStyle(component: AnyStyledComponent, style: any) {
    return component.elements.some((element) => {
      return typeof style[element] === 'object'
    })
  }

  isResponsiveStyle(component: AnyStyledComponent, style: any) {
    // TO-DO
  }

  getDefaultVariantStyle(componentName: string, defaultVariantStyleName: string = 'default') {
    const stylesheet = this.stylesheets[componentName]

    if (!stylesheet) {
      throw new Error(`No variants registered for ${componentName}`)
    }

    const defaultStyle = stylesheet?.[defaultVariantStyleName]

    if (!!defaultStyle) {
      return defaultStyle
    }
  }

  mergeStylesWithCache<T = unknown>(styles: ICSS[], key: string): T {
    const cacheStyles: (styles: ICSS[], key: string) => T = trieMemoize(
      [WeakMap, Map],
      (styles: ICSS[], key: string) => this.mergeStyles(styles, key)
    )

    return cacheStyles?.(styles, key)
  }

  getRegisteredComponent(componentName: string) {
    const registeredComponent = this.components[componentName]

    if (!registeredComponent) {
      throw new Error(`Component ${componentName} not registered`)
    }

    const rootElement = registeredComponent?.rootElement ?? 'wrapper'

    return {
      rootElement,
      registeredComponent,
    }
  }

  styleFor<T = unknown>(componentName:string, style: StyleProp<T>): T {
    const isStyleArray = Array.isArray(style)
  
    const { rootElement, registeredComponent } = this.getRegisteredComponent(componentName)
    const defaultStyle = this.getDefaultVariantStyle(componentName)

    if (!style) {
      return this.mergeStylesWithCache([defaultStyle], this.hashStyle(defaultStyle, ['default']))
    }

    const isStyleObject = typeof style === 'object' && !isStyleArray

    if (typeof style === 'string') {
      const [computedStyle, key] = this.computeVariantStyle(componentName, [style])

      return this.mergeStylesWithCache([
        defaultStyle,
        computedStyle,
      ], key)
    }

    if (isStyleObject) {
      const isCompositionStyle = this.isCompositionStyle(registeredComponent, style)

      return this.mergeStylesWithCache(
        [defaultStyle, isCompositionStyle ? style : { [rootElement]: style }],
        this.hashStyle(style, []),
      )
    }

    if (isStyleArray) {
      let variants:string[] = []
      const styles:ICSS[] = [defaultStyle]
      let idx = 0
      const variantKeys:string[] = []

      for (const s of style) {
        if (typeof s === 'string') {
          variants.push(s)
        }

        if (typeof s === 'object') {
          if (variants.length > 0) {
            const [computedStyle, key] = this.computeVariantStyle(componentName, variants)
            styles.push(computedStyle)
            variantKeys.push(key)

            variants = []
          }
          const isCompositionStyle = this.isCompositionStyle(registeredComponent, s)
          styles.push(isCompositionStyle ? s : { [rootElement]: s })
        }

        if (idx === style.length - 1 && variants.length > 0) {
          const [computedStyle, key] = this.computeVariantStyle(componentName, variants)
          variantKeys.push(key)
          styles.push(computedStyle)

        }

        idx++
      }

      return this.mergeStylesWithCache(styles, this.hashStyle(style, variantKeys))
    }

    console.warn('Invalid style prop for ', componentName, style)

    return {} as T
  }

  registerCommonVariants() {
    const spacing: SpacingMap = themeStore.getState().current?.['spacing']

    const spacingVariants = objectPickBy(spacing, (_, key) => key?.includes('padding') || key?.includes('margin') || key?.includes('gap'))

    const dynamicVariants = createDynamicPresets()

    this.commonVariantsStyles = {
      ...defaultPresets,
      ...dynamicVariants,
      ...spacingVariants,
    }
  }

  registerVariants(componentName:string, variants: VariantStyleSheet) {
    if (this.stylesheets[componentName]) {
      throw new Error(`Variants for ${componentName} already registered`)
    }

    this.registerCommonVariants()

    this.stylesheets[componentName] = variants
  }

  registerComponent(component: AnyStyledComponent) {
    this.components[component.styleRegistryName] = component
  }

  /**
    * These should be overriden by the end-user to support
    * custom style merging logic, such as StyleSheet.flatten
    */
  mergeStyles<T>(styles: ICSS[], key: string) : T {
    throw new Error('mergeStyles: Not implemented')
  }

  createStyle(css: ICSS): ICSS {
    throw new Error('createStyle: Not implemented')
  }

  hashStyle(style: StyleProp, keys: string[]):string {
    throw new Error('HashStyle: Not implemented')
  }

  wipeCache() {
    this.variantStyles = {}
    this.styles = {}
  }
}
