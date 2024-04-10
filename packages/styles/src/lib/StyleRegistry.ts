import { AnyRecord, AnyStyledComponent, ICSS, InsetMap, ITheme, SpacingMap, StyleProp, VariantStyleSheet } from '../types'
import { ThemeStore, themeStore } from './themeStore'
import deepmerge from '@fastify/deepmerge'
import trieMemoize from "trie-memoize"
import { MultiplierFunction } from './spacing'
import { createStyles } from './createStyles'
import { defaultPresets } from './presets'
import { createDynamicPresets } from './dynamicPresets'
import { isEmptyObject, isSpacingKey, objectPickBy } from './utils'
import { hashKey, STORES_PERSIST_VERSION, StylesStore, stylesStore } from './cache'
import { StyleCache } from './StyleCache'

export class CodeleapStyleRegistry {
  stylesheets: Record<string, VariantStyleSheet> = {}

  variantStyles: Record<string, ICSS> = {}

  commonVariantsStyles: Record<string, ICSS | MultiplierFunction> = {}

  styles: Record<string, ICSS> = {}

  commonStyles: Record<string, ICSS> = {}

  responsiveStyles: Record<string, ICSS> = {}

  compositionStyles: Record<string, { compositionStyles: any[]; variantKeys: string[] }> = {}

  components: Record<string, AnyStyledComponent> = {}

  theme: ThemeStore

  store: StylesStore

  private cache = new StyleCache()

  private baseKey: string

  constructor() {
    this.registryStoredCache()

    this.theme = themeStore.getState()

    this.registerCommonVariants()

    this.registerBaseKey()

    // this.cache.registerCacheWiper()
  }

  private async registryStoredCache() {
    const hasHydrated = stylesStore.persist.hasHydrated()

    if (hasHydrated) {
      this.store = stylesStore.getState()
    } else {
      await stylesStore.persist.rehydrate()
      this.store = stylesStore.getState()
    }

    const cachedVariantStyles = this.store.variantStyles

    console.log('CV cachedVariantStyles', cachedVariantStyles)

    if (!!cachedVariantStyles && isEmptyObject(this.variantStyles)) {
      this.variantStyles = cachedVariantStyles
    }

    const cachedStyles = this.store.styles

    console.log('CV cachedStyles', cachedStyles)

    if (!!cachedStyles && isEmptyObject(this.styles)) {
      this.styles = cachedStyles
    }
  }

  private getBaseKey() {
    const currentColorScheme = this.theme.current['currentColorScheme'] ?? this.theme.colorScheme ?? 'default'

    const key = [
      currentColorScheme,
      this.theme.current,
      this.commonVariantsStyles,
      STORES_PERSIST_VERSION,
    ]

    // console.log('BASE KEY', key)

    return hashKey(key)
  }

  private registerBaseKey() {
    this.baseKey = this.getBaseKey()

    return this.baseKey
  }

  keyForStyles(componentName: string, styles: any) {
    const stylesheet = this.stylesheets[componentName]

    const key = [
      componentName,
      stylesheet,
      styles,
      this.baseKey,
    ]

    // console.log('KEY STYLE ' + componentName, key)

    return hashKey(key)
  }

  keyForVariants(componentName: string, variants: string[], component: string) {
    const stylesheet = this.stylesheets[componentName]

    const key = [
      componentName,
      component,
      stylesheet,
      this.baseKey,
    ].concat(variants)

    // console.log('KEY VARIANT ' + componentName, key)

    return hashKey(key)
  }

  keyForCommonStyles(variant: string) {
    const key = [
      variant,
      this.baseKey,
    ]

    // console.log('KEY COMMON STYLE ' + variant, key)

    return hashKey(key)
  }

  keyForCompositionStyles(componentName: string, composition: Record<string, any>, style: any) {
    const key = [
      componentName,
      composition,
      ...(Array.isArray(style) ? style : [style]),
      this.baseKey,
    ]

    // console.log('KEY COMPOSITION STYLE ' + composition, key)

    return hashKey(key)
  }

  keyForCreatedStyles(styles: Record<string, any>) {
    const key = [
      styles,
      this.baseKey,
    ]

    return hashKey(key)
  }

  computeCommonVariantStyle(componentName: string, variant: string, component = null) {
    const key = this.keyForCommonStyles(variant)

    if (!!this.commonStyles[key]) {
      return this.commonStyles[key]
    }

    const { rootElement } = this.getRegisteredComponent(componentName)
    const theme = this.theme.current

    let mediaQuery = null

    let [variantName, value] = variant?.includes(':') ? variant?.split(':') : [variant, null]

    // @ts-ignore
    if (!!theme?.breakpoints[variantName]) {
      const [breakpoint, _variantName, _value] = variant?.split(':')?.length == 2 ? [...variant?.split(':'), null] : variant?.split(':')

      // @ts-ignore
      mediaQuery = theme.media.down(breakpoint)
      value = _value
      variantName = _variantName
    }

    let variantStyle = this.commonVariantsStyles[variantName] ?? this.commonVariantsStyles[variant]

    let style = null

    if (typeof variantStyle == 'function') {
      style = isSpacingKey(variantName) ? variantStyle(value) : variantStyle(theme, value)
    } else {
      style = variantStyle
    }

    if (!!mediaQuery) {
      const commonStyles = createStyles({
        [component ?? rootElement]: {
          [mediaQuery]: style
        }
      })

      this.commonStyles[key] = commonStyles

      return commonStyles
    }

    const commonStyles = createStyles({
      [component ?? rootElement]: style
    })

    this.commonStyles[key] = commonStyles

    return commonStyles
  }

  computeVariantStyle(componentName: string, variants: string[], component = null): [ICSS, string] {
    const { rootElement } = this.getRegisteredComponent(componentName)
    const key = this.keyForVariants(componentName, variants, component ?? rootElement)

    if (this.variantStyles[key]) {
      // console.log('USING HASH KEY', componentName)
      return [this.variantStyles[key], key]
    }

    const stylesheet = this.stylesheets[componentName]

    if (!stylesheet) {
      throw new Error(`No variants registered for ${componentName}`)
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

        return createStyles({
          [component ?? rootElement]: {
            [mediaQuery]: stylesheet[variantName][component ?? rootElement]
          }
        })
      } else {
        return this.computeCommonVariantStyle(componentName, variant, component)
      }
    })?.filter(variantStyle => !!variantStyle)

    // console.log('computeVariantStyle -> variantStyles', variantStyles)

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

    this.store.cacheVariantStyle(key, this.variantStyles[key])

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
    const responsiveStyleKey = 'breakpoints'
    const responsiveStyles = style[responsiveStyleKey]

    return {
      responsiveStyleKey,
      isResponsive: !!responsiveStyles,
    }
  }

  getDefaultVariantStyle(componentName: string, defaultVariantStyleName: string = 'default') {
    const stylesheet = this.stylesheets[componentName]

    const defaultStyle = stylesheet?.[defaultVariantStyleName]

    if (!!defaultStyle) {
      return defaultStyle
    } else {
      return {}
    }
  }

  mergeStylesWithCache<T = unknown>(styles: ICSS[], key: string): T {
    const mergedStyles = deepmerge({ all: true })(...styles)

    this.styles[key] = mergedStyles

    this.store.cacheStyles(key, mergedStyles as ICSS[])

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
    const styles = {}

    const responsiveStyles = style[responsiveStyleKey]

    if (!responsiveStyles) {
      return {
        responsiveStyles: {}
      }
    }

    const key = this.keyForStyles(componentName, responsiveStyles)

    if (!!this.responsiveStyles[key]) {
      return {
        responsiveStyles: this.responsiveStyles[key]
      }
    }

    for (const responsiveStyle in responsiveStyles) {
      const mediaQuery = this.getMediaQuery(responsiveStyle)

      const breakpointStyle = responsiveStyles[responsiveStyle]

      const componentStyles = this.styleFor(componentName, breakpointStyle, false)

      // @ts-ignore
      for (const composition in componentStyles) {
        styles[composition] = {
          [mediaQuery]: componentStyles[composition]
        }
      }
    }

    this.responsiveStyles[key] = styles

    return {
      responsiveStyles: styles
    }
  }

  getStyles(componentName: string, style: any, component?: any, predicateObj?: (style: any) => any) {
    let styles = {}

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
        const [computedStyle] = this.computeVariantStyle(
          componentName,
          variants,
          component,
        )

        styles = deepmerge({ all: true })(styles, computedStyle[component])
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
    const { isResponsive, responsiveStyleKey } = this.isResponsiveStyle(null, style)

    if (isResponsive) {
      let responsiveStyles = {}

      for (const responsiveStyle in style[responsiveStyleKey]) {
        const mediaQuery = this.getMediaQuery(responsiveStyle)

        const breakpointStyle = style[responsiveStyleKey][responsiveStyle]

        responsiveStyles = deepmerge({ all: true })(responsiveStyles, {
          [mediaQuery]: this.getStyles(componentName, breakpointStyle, component)
        })
      }

      delete style[responsiveStyleKey]

      return deepmerge({ all: true })(style, responsiveStyles)
    } else {
      return style
    }
  }

  getCompositionStyle(componentName: string, composition: Record<string, any>, style: any) {
    const key = this.keyForCompositionStyles(componentName, composition, style)

    if (this.compositionStyles[key]) {
      return this.compositionStyles[key]
    }

    const styles = []

    for (const component in composition) {
      const componentStyles = composition[component]

      const componentStyle = this.getStyles(
        componentName,
        componentStyles,
        component,
        s => this.getStyleWithResponsive(componentName, s, component)
      )

      styles.push({ [component]: componentStyle })

      delete style[component]
    }

    const compositionStyle = {
      compositionStyles: styles,
      variantKeys: [],
    }

    this.compositionStyles[key] = compositionStyle

    return compositionStyle
  }

  styleFor<T = unknown>(componentName: string, style: StyleProp<T>, mergeWithDefaultStyle: boolean = true): T {
    const styleHashKey = this.keyForStyles(componentName, style)

    if (!!this.styles[styleHashKey]) {
      // console.log('CACHED STYLE', this.styles[styleHashKey])
      return this.styles[styleHashKey] as T
    }

    const isStyleArray = Array.isArray(style)

    const { rootElement, registeredComponent } = this.getRegisteredComponent(componentName)
    const defaultStyle = mergeWithDefaultStyle ? this.getDefaultVariantStyle(componentName) : {}

    if (!style) {
      return this.mergeStylesWithCache(
        [defaultStyle],
        styleHashKey
      )
    }

    const isStyleObject = typeof style === 'object' && !isStyleArray

    if (typeof style === 'string') {
      const [computedStyle, key] = this.computeVariantStyle(componentName, [style])

      return this.mergeStylesWithCache(
        [defaultStyle, computedStyle],
        styleHashKey
      )
    }

    if (isStyleObject) {
      const { isComposition, composition } = this.isCompositionStyle(registeredComponent, style)

      const { isResponsive, responsiveStyleKey } = this.isResponsiveStyle(registeredComponent, style)

      const { responsiveStyles } = this.getResponsiveStyle(componentName, responsiveStyleKey, style)

      if (isResponsive) {
        delete style[responsiveStyleKey]
      }

      if (isComposition) {
        const { compositionStyles } = this.getCompositionStyle(componentName, composition, style)

        const styles = [defaultStyle, responsiveStyles, ...compositionStyles]

        styles.push({ [rootElement]: style })

        // console.log('styles', styles)

        return this.mergeStylesWithCache(
          styles,
          styleHashKey
        )
      } else {
        return this.mergeStylesWithCache(
          [defaultStyle, responsiveStyles, { [rootElement]: style }],
          styleHashKey
        )
      }
    }

    if (isStyleArray) {
      let variants: string[] = []
      const styles: ICSS[] = [defaultStyle]
      let idx = 0
      const variantKeys: string[] = []

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

          const { isResponsive, responsiveStyleKey } = this.isResponsiveStyle(registeredComponent, s)

          if (isResponsive) {
            const { responsiveStyles } = this.getResponsiveStyle(componentName, responsiveStyleKey, s)

            styles.push(responsiveStyles)

            delete s[responsiveStyleKey]
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

      return this.mergeStylesWithCache(
        styles,
        styleHashKey
      )
    }

    console.warn('Invalid style prop for ', componentName, style)

    return {} as T
  }

  registerCommonVariants() {
    const spacing: SpacingMap = this.theme.current?.['spacing']

    const inset: InsetMap = this.theme.current?.['inset']

    const appVariants = this.theme.variants

    const spacingVariants = objectPickBy(spacing, (_, key) => isSpacingKey(key))

    const insetVariants = objectPickBy(inset, (_, key) => ['top', 'left', 'right', 'bottom'].includes(key))

    const dynamicVariants = createDynamicPresets()

    const variantsStyles = deepmerge({ all: true })(
      defaultPresets,
      appVariants,
      dynamicVariants,
      spacingVariants,
      insetVariants
    )

    this.commonVariantsStyles = variantsStyles
  }

  registerVariants(componentName: string, variants: VariantStyleSheet) {
    if (this.stylesheets[componentName]) {
      throw new Error(`Variants for ${componentName} already registered`)
    }

    this.stylesheets[componentName] = variants
  }

  registerComponent(component: AnyStyledComponent) {
    this.components[component.styleRegistryName] = component
  }

  /**
    * These should be overwritten by the end-user to support
    * custom style merging logic, such as StyleSheet.flatten
    */
  createStyle(css: ICSS): ICSS {
    throw new Error('createStyle: Not implemented')
  }

  wipeCache() {
    this.variantStyles = {}
    this.styles = {}
    this.responsiveStyles = {}
    this.commonStyles = {}
    this.compositionStyles = {}
    this.store.wipeCache()
  }

  update() {
    this.theme = themeStore.getState()
    this.store = stylesStore.getState()
    this.registerBaseKey()
  }

  private cacheCreatedStyles = {}

  createStyles<K extends string = string>(styles: Record<K, StyleProp<AnyRecord, ''>> | ((theme: ITheme) => Record<K, StyleProp<AnyRecord, ''>>)): Record<K, ICSS> {
    const stylesObj = typeof styles === 'function' ? styles(this.theme.current) : styles

    const key = this.keyForCreatedStyles(stylesObj)

    if (!!this.cacheCreatedStyles[key]) {
      return this.cacheCreatedStyles[key]
    }

    const createdStyles = {} as Record<K, any>

    for (const key in stylesObj) {
      const style = stylesObj[key]
      const styled = this.styleFor('MyComponent', style, false)

      createdStyles[key] = styled?.wrapper ?? style
    }

    this.cacheCreatedStyles[key] = createdStyles

    return createdStyles
  }
}
