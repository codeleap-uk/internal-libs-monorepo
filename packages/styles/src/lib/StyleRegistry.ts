/* eslint-disable dot-notation */
import { AnyRecord, AnyStyledComponent, ICSS, ITheme, StyleAggregator, StyleProp, VariantStyleSheet } from '../types'
import { ThemeStore, themeStore } from './themeStore'
import deepmerge from '@fastify/deepmerge'
import { MultiplierFunction } from './spacing'
import { defaultVariants } from './defaultVariants'
import { dynamicVariants } from './dynamicVariants'
import { ignoredStyleKeys, isSpacingKey } from './utils'
import { StyleCache } from './StyleCache'
import { minifier } from './minifier'
import { StateStorage } from 'zustand/middleware'

export class CodeleapStyleRegistry {
  stylesheets: Record<string, VariantStyleSheet> = {}

  commonVariants: Record<string, ICSS | MultiplierFunction> = {}

  aggregators: Record<string, StyleAggregator> = {}

  components: Record<string, AnyStyledComponent> = {}

  private theme: ThemeStore

  private styleCache: StyleCache

  constructor(storage: StateStorage) {
    this.styleCache = new StyleCache(storage)

    this.theme = themeStore.getState()

    this.registerCommonVariants()

    const currentColorScheme = this.theme?.current?.['currentColorScheme']?.() ?? this.theme?.colorScheme ?? 'default'

    this.styleCache.registerBaseKey([currentColorScheme, this.theme.current, this.commonVariants])
  }

  computeCommonVariantStyle(componentName: string, variant: string, component = null) {
    const cache = this.styleCache.keyFor('common', variant)

    if (!!cache.value) {
      return {
        [component]: this.createStyle(cache.value),
      }
    }

    const theme = this.theme.current

    let mediaQuery = null

    let [variantName, value] = variant?.includes(':') ? variant?.split(':') : [variant, null]

    // @ts-expect-error
    if (!!theme?.breakpoints[variantName]) {
      const [breakpoint, _variantName, _value] = variant?.split(':')?.length == 2 ? [...variant?.split(':'), null] : variant?.split(':')

      // @ts-expect-error
      mediaQuery = theme.media.down(breakpoint)
      value = _value
      variantName = _variantName
    }

    const variantStyle = this.commonVariants[variantName] ?? this.commonVariants[variant]

    let style = null

    if (typeof variantStyle == 'function') {
      style = isSpacingKey(variantName) ? variantStyle(value) : variantStyle(theme, value)
    } else {
      style = variantStyle
    }

    if (!style) return null

    if (!!mediaQuery) {
      style = {
        [mediaQuery]: style,
      }
    }

    const commonStyles = {
      [component]: this.createStyle(style),
    }

    this.styleCache.cacheFor('common', cache.key, style)

    return commonStyles
  }

  computeVariantStyle(componentName: string, variants: string[], _component = null): ICSS {
    const { rootElement } = this.getRegisteredComponent(componentName)

    const component = _component ?? rootElement

    const stylesheet = minifier.decompress(this.stylesheets[componentName])
    const aggregator = this.aggregators[componentName]

    const cache = this.styleCache.keyFor('variants', { componentName, component, stylesheet, variants, aggregator })

    if (!!cache.value) {
      return cache.value
    }

    const theme = this.theme.current

    const variantStyles = variants.map((variant) => {
      if (!!stylesheet[variant]) {

        return stylesheet[variant]
      }

      const [breakpoint, variantName] = variant?.includes(':') ? variant?.split(':') : []

      // @ts-ignore
      if (!!theme?.breakpoints[breakpoint] && !!stylesheet[variantName]) {
        // @ts-ignore
        const mediaQuery = theme.media.down(breakpoint)

        return {
          [component]: this.createStyle({
            [mediaQuery]: stylesheet[variantName][component],
          }),
        }
      }

      return this.computeCommonVariantStyle(componentName, variant, component)
    }).filter(variantStyle => !!variantStyle)

    let variantStyle = deepmerge({ all: true })(...variantStyles)

    if (!!aggregator) {
      variantStyle = aggregator(theme, variantStyle)
    }

    this.styleCache.cacheFor('variants', cache.key, variantStyle)

    return variantStyle
  }

  isCompositionStyle(component: AnyStyledComponent, style: any) {
    const composition = {}

    if (!style) {
      return {
        isComposition: false,
        composition,
      }
    }

    const styleKeys = Object.keys(style)

    let elements = []

    for (const element of component?.elements) {
      const componentElements = styleKeys?.filter(k => k?.startsWith(element) && !ignoredStyleKeys?.includes(k))

      if (componentElements?.length >= 1) {
        elements = [...elements, ...componentElements]
      }
    }

    for (const element of elements) {
      composition[element] = style[element]
    }

    return {
      isComposition: elements?.length >= 1,
      composition,
    }
  }

  isResponsiveStyle(style: any) {
    const responsiveStyleKey = 'breakpoints'

    if (!style) {
      return {
        responsiveStyleKey,
        isResponsive: false,
      }
    }

    return {
      responsiveStyleKey,
      isResponsive: !!style[responsiveStyleKey],
    }
  }

  getDefaultVariantStyle(componentName: string, defaultVariantStyleName = 'default') {
    const stylesheet = minifier.decompress(this.stylesheets[componentName])

    const defaultStyle = stylesheet?.[defaultVariantStyleName]

    if (!!defaultStyle) {
      return defaultStyle
    } else {
      return {}
    }
  }

  mergeStylesWithCache<T = unknown>(styles: ICSS[], key: string): T {
    const mergedStyles = deepmerge({ all: true })(...styles)

    this.styleCache.cacheFor('components', key, mergedStyles)

    return mergedStyles as T
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

  getResponsiveStyle(componentName: string, responsiveStyleKey: string, style: object) {
    const responsiveStyles = style[responsiveStyleKey]

    if (!responsiveStyles) return {}

    const stylesheet = minifier.decompress(this.stylesheets[componentName])

    const cache = this.styleCache.keyFor('responsive', { componentName, responsiveStyles, stylesheet })

    if (!!cache.value) {
      return cache.value
    }

    const styles = {}

    for (const responsiveStyle in responsiveStyles) {
      const mediaQuery = this.getMediaQuery(responsiveStyle)

      const breakpointStyle = responsiveStyles[responsiveStyle]

      const componentStyles = this.styleFor(componentName, breakpointStyle, false)

      // @ts-ignore
      for (const composition in componentStyles) {
        styles[composition] = {
          [mediaQuery]: componentStyles[composition],
        }
      }
    }

    this.styleCache.cacheFor('responsive', cache.key, styles)

    return styles
  }

  getStyles(componentName: string, _style: any, component?: any, predicateObj?: (style: any) => any) {
    let styles = {}

    const style = typeof _style == 'string' ? [_style] : _style

    if (Array.isArray(style)) {
      const variants = []

      for (const s of style) {
        if (typeof s === 'string') {
          variants.push(s)
        } else {
          styles = deepmerge({ all: true })(styles, !!predicateObj ? predicateObj(s) : s)
        }
      }

      if (variants?.length >= 1) {
        const computedVariantStyle = this.computeVariantStyle(
          componentName,
          variants,
          component,
        )

        styles = deepmerge({ all: true })(styles, computedVariantStyle[component])
      }
    } else if (typeof style === 'object') {
      styles = !!predicateObj ? predicateObj(style) : style
    }

    return styles
  }

  private getMediaQuery(responsiveKey: string) {
    const [breakpoint, query] = responsiveKey?.includes(':') ? responsiveKey?.split(':') : [responsiveKey, 'down']

    // @ts-expect-error - media not has type
    const mediaQuery = this.theme.current.media?.[query]?.(breakpoint)

    return mediaQuery
  }

  getStyleWithResponsive(componentName: string, style: any, component?: any) {
    if (!style) return style

    const { isResponsive, responsiveStyleKey } = this.isResponsiveStyle(style)

    if (isResponsive) {
      let responsiveStyles = {}

      for (const responsiveStyle in style[responsiveStyleKey]) {
        const mediaQuery = this.getMediaQuery(responsiveStyle)

        const breakpointStyle = style[responsiveStyleKey][responsiveStyle]

        responsiveStyles = deepmerge({ all: true })(responsiveStyles, {
          [mediaQuery]: this.getStyles(componentName, breakpointStyle, component),
        })
      }

      delete style[responsiveStyleKey]

      return deepmerge({ all: true })(style, responsiveStyles)
    } else {
      return style
    }
  }

  getCompositionStyle(componentName: string, composition: Record<string, any>, style: any) {
    const cache = this.styleCache.keyFor('compositions', { componentName, composition, style })

    if (!!cache.value) {
      return cache.value
    }

    const styles = []

    for (const component in composition) {
      const componentStyles = composition[component]

      const componentStyle = this.getStyles(
        componentName,
        componentStyles,
        component,
        s => this.getStyleWithResponsive(componentName, s, component),
      )

      styles.push({ [component]: componentStyle })

      delete style[component]
    }

    this.styleCache.cacheFor('compositions', cache.key, styles)

    return styles
  }

  styleFor<T = unknown>(componentName: string, componentStyle: StyleProp<T>, mergeWithDefaultStyle = true): T {
    const cache = this.styleCache.keyFor('components', { componentName, componentStyle, stylesheet: this.stylesheets[componentName] })

    if (!!cache.value) {
      return cache.value as T
    }

    const style = this.copyStyle(componentStyle)

    const isStyleArray = Array.isArray(style)

    const { rootElement, registeredComponent } = this.getRegisteredComponent(componentName)
    const defaultStyle = mergeWithDefaultStyle ? this.getDefaultVariantStyle(componentName) : {}

    if (!style) {
      return this.mergeStylesWithCache([defaultStyle], cache.key)
    }

    const isStyleObject = typeof style === 'object' && !isStyleArray

    if (typeof style === 'string') {
      const computedVariantStyle = this.computeVariantStyle(componentName, [style])

      return this.mergeStylesWithCache(
        [defaultStyle, computedVariantStyle],
        cache.key,
      )
    }

    if (isStyleObject) {
      const { isComposition, composition } = this.isCompositionStyle(registeredComponent, style)

      const { isResponsive, responsiveStyleKey } = this.isResponsiveStyle(style)

      const responsiveStyles = this.getResponsiveStyle(componentName, responsiveStyleKey, style)

      if (isResponsive) {
        delete style[responsiveStyleKey]
      }

      if (isComposition) {
        const compositionStyles = this.getCompositionStyle(componentName, composition, style)

        const styles = [defaultStyle, responsiveStyles, ...compositionStyles]

        styles.push({ [rootElement]: style })

        return this.mergeStylesWithCache(styles, cache.key)
      } else {
        return this.mergeStylesWithCache(
          [defaultStyle, responsiveStyles, { [rootElement]: style }],
          cache.key,
        )
      }
    }

    if (isStyleArray) {
      const filteredStyle = (style as Array<any>)?.filter(s => !!s)

      let variants: string[] = []
      const styles: ICSS[] = [defaultStyle]
      let idx = 0

      for (const s of filteredStyle) {

        if (typeof s === 'string') {

          variants.push(s)
        }

        const isObj = typeof s === 'object'

        if (variants.length > 0 && (idx === filteredStyle.length - 1 || isObj)) {
          const computedVariantStyle = this.computeVariantStyle(componentName, variants)

          styles.push(computedVariantStyle)

          variants = []
        }

        if (isObj) {
          const { isComposition, composition } = this.isCompositionStyle(registeredComponent, s)
          const { isResponsive, responsiveStyleKey } = this.isResponsiveStyle(s)

          if (Array.isArray(s)) {
            const styleComposition = this.styleFor(componentName, s, false)

            styles.push(styleComposition)
          } else if (isComposition) {
            const compositionStyles = this.getCompositionStyle(componentName, composition, s)

            styles.push(...compositionStyles)
          } else if (isResponsive) {
            const responsiveStyles = this.getResponsiveStyle(componentName, responsiveStyleKey, s)

            styles.push(responsiveStyles)

            delete s[responsiveStyleKey]
          } else {

            styles.push({ [rootElement]: s })
          }

        }

        idx++
      }

      return this.mergeStylesWithCache(styles, cache.key)
    }

    console.warn('Invalid style prop for ', componentName, style)

    return {} as T
  }

  registerCommonVariants() {
    const spacingVariants = this.theme.current?.['spacing']

    const insetVariants = this.theme.current?.['inset']

    const appVariants = this.theme.variants

    const commonVariants = deepmerge({ all: true })(
      defaultVariants,
      appVariants,
      dynamicVariants,
      spacingVariants,
      insetVariants,
    )

    this.commonVariants = commonVariants
  }

  registerVariants<Composition extends string = any>(componentName: string, variants: VariantStyleSheet, aggregator?: StyleAggregator<Composition>) {
    if (this.stylesheets[componentName]) {
      throw new Error(`Variants for ${componentName} already registered`)
    }
    this.aggregators[componentName] = aggregator

    this.stylesheets[componentName] = minifier.compress(variants)
  }

  registerComponent(component: AnyStyledComponent) {
    const componentData = {
      styleRegistryName: component?.styleRegistryName,
      elements: component?.elements,
      rootElement: component?.rootElement,
    }

    this.components[component.styleRegistryName] = componentData as any
  }

  /**
    * These should be overwritten by the end-user to support
    * custom style merging logic, such as StyleSheet.flatten
    */
  createStyle(css: ICSS): ICSS {
    throw new Error('createStyle: Not implemented')
  }

  update() {
    this.theme = themeStore.getState()

    const currentColorScheme = this.theme?.current?.['currentColorScheme']?.() ?? this.theme?.colorScheme ?? 'default'

    this.styleCache.registerBaseKey([currentColorScheme, this.theme.current, this.commonVariants])
  }

  private copyStyle(style: any) {
    let copiedStyle = null

    if (Array.isArray(style)) {
      copiedStyle = [...style]
    } else if (typeof style == 'object') {
      copiedStyle = { ...style }
    } else {
      copiedStyle = style
    }

    return copiedStyle
  }

  createStyles<K extends string = string>(styles: Record<K, StyleProp<AnyRecord, ''>> | ((theme: ITheme) => Record<K, StyleProp<AnyRecord, ''>>)): Record<K, ICSS> {
    const compute = () => {
      const current = themeStore.getState().current

      const stylesObj = typeof styles === 'function' ? styles(current) : styles

      const cache = this.styleCache.keyFor('styles', stylesObj)

      if (!!cache.value) {
        return cache.value
      }

      const createdStyles = {} as Record<K, any>

      for (const key in stylesObj) {
        const style = this.styleFor('MyComponent', stylesObj[key], false)

        createdStyles[key] = style?.wrapper ?? style
      }

      this.styleCache.cacheFor('styles', cache.key, createdStyles)

      return createdStyles
    }

    return new Proxy(compute(), {
      get(target, prop) {
        return compute()[prop as string]
      },
    })
  }
}
