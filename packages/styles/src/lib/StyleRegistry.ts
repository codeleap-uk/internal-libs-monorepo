import { AnyFunction, AnyStyledComponent, AppTheme, ICSS, SpacingMap, StyleProp, Theme, VariantStyleSheet } from '../types'
import { themeStore } from './themeStore'
import deepmerge from '@fastify/deepmerge'
import trieMemoize from "trie-memoize"
import { SpacingFunction } from './spacing'
import { createStyles } from './createStyles'
import { defaultPresets } from './presets'
import { createDynamicPresets, VariantFunction } from './dynamicPresets'
import { objectPickBy } from './utils'

export class CodeleapStyleRegistry {
  stylesheets: Record<string, VariantStyleSheet> = {}

  variantStyles: Record<string, ICSS> = {}

  commonVariantsStyles: Record<string, ICSS | SpacingFunction> = {}

  styles: Record<string, ICSS> = {}

  components: Record<string, AnyStyledComponent> = {}

  constructor() {}

  keyForVariants(componentName: string, variants:string[]) {
    const currentColorScheme = themeStore.getState().current['currentColorScheme'] ?? themeStore.getState().colorScheme ?? 'default'

    return [
      componentName,
      currentColorScheme,
      ...variants.filter(Boolean),
    ].join('-')
  }

  computeCommonVariantStyle(componentName: string, variant: string, component = null) {
    const { rootElement } = this.getRegisteredComponent(componentName)
    const theme = themeStore.getState().current // TODO pass to variantStyle function and access for AppVariants and DynamicVariants

    const [variantName, value] = variant?.includes(':') ? variant?.split(':') : [variant, null]

    const variantStyle = this.commonVariantsStyles[variantName] ?? this.commonVariantsStyles[variant]

    return createStyles({
      [component ?? rootElement]: typeof variantStyle == 'function' ? variantStyle(value) : variantStyle
    })
  }

  computeVariantStyle(componentName: string, variants: string[], component = null): [ICSS, string] {
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
        return this.computeCommonVariantStyle(componentName, variant, component)
      }
    })?.filter(variantStyle => !!variantStyle)

    console.log('computeVariantStyle -> variantStyles', variantStyles)

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
    const composition = {}
    let isComposition = false

    component.elements.forEach((element) => {
      const hasElement = typeof style[element] === 'object' || Array.isArray(style[element])
      
      if (hasElement) {
        isComposition = true
        composition[element] = style[element]
      }
    })

    return {
      isComposition,
      composition,
    }
  }

  isResponsiveStyle(component: AnyStyledComponent, style: any) {
    // TO-DO
  }

  getDefaultVariantStyle(componentName: string, defaultVariantStyleName: string = 'default') {
    const stylesheet = this.stylesheets[componentName]

    if (!stylesheet) {
      throw new Error(`DefaultVariant: No variants registered for ${componentName}`)
    }

    const defaultStyle = stylesheet?.[defaultVariantStyleName]

    if (!!defaultStyle) {
      return defaultStyle
    } else {
      return {}
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

  getCompositionStyle(componentName: string, composition: Record<string, any>, style: any) {
    const styles = []
    const variantKeys: string[] = []

    for (const component in composition) {
      console.log(component)
      const componentStyles = composition[component]

      if (Array.isArray(componentStyles)) {
        const componentVariants = []

        for (const style of componentStyles) {
          if (typeof style == 'string') {
            componentVariants.push(style)
          } else if (typeof style == 'object') {
            styles.push({ [component]: style })
          }
        }

        if (componentVariants?.length >= 1) {
          console.log(componentVariants)

          const [computedStyle, key] = this.computeVariantStyle(
            componentName, 
            componentVariants,
            component,
          )

          variantKeys.push(key)
          styles.push(computedStyle)
        }
      } else {
        styles.push({ [component]: componentStyles })
      }

      delete style[component]
    }

    return {
      compositionStyles: styles,
      variantKeys,
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
      const { isComposition, composition } = this.isCompositionStyle(registeredComponent, style)
      

      if (isComposition) {
        const { compositionStyles, variantKeys } = this.getCompositionStyle(componentName, composition, style)

        const styles = [defaultStyle, ...compositionStyles]

        styles.push({ [rootElement]: style })

        console.log('styles', styles)

        return this.mergeStylesWithCache(styles, this.hashStyle(style, variantKeys))
      } else {
        return this.mergeStylesWithCache(
          [defaultStyle, { [rootElement]: style }],
          this.hashStyle(style, []),
        )
      }
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
          const { isComposition, composition } = this.isCompositionStyle(registeredComponent, s)

          if (isComposition) {
            const { 
              compositionStyles, 
              variantKeys: compositionVariantKeys 
            } = this.getCompositionStyle(componentName, composition, s)
            
            styles.push(...compositionStyles)
            variantKeys.push(...compositionVariantKeys)
          }

          styles.push({ [rootElement]: s })
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

    const appVariants = themeStore.getState().current?.['variants']

    const spacingVariants = objectPickBy(spacing, (_, key) => key?.includes('padding') || key?.includes('margin') || key?.includes('gap'))

    const dynamicVariants = createDynamicPresets()

    this.commonVariantsStyles = {
      ...appVariants,
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
