import { AnyFunction, AnyStyledComponent, GenericStyledComponent, ICSS, StyleProp, VariantStyleSheet } from '../types'
import { themeStore } from './themeStore'
import deepmerge from '@fastify/deepmerge'

export class CodeleapStyleRegistry {
  stylesheets: Record<string, VariantStyleSheet> = {}

  variantStyles: Record<string, ICSS> = {}

  styles: Record<string, ICSS> = {}

  components: Record<string, AnyStyledComponent> = {}

  constructor() {}

  keyForVariants(componentName: string, variants:string[]) {
    const currentColorScheme = themeStore.getState().colorScheme

    return [
      componentName,
      currentColorScheme,
      ...variants,
    ].join('-')
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
    console.log('stylesheet', stylesheet)
    console.log('variants', variants)
    const variantStyles = variants.map((variant) => {
      return stylesheet[variant]
    })
    console.log('variantStyles', variantStyles)
    // @ts-ignore
    const mergedComposition = deepmerge({ all: true })(...variantStyles)

    console.log('mergedComposition', mergedComposition)

    this.variantStyles[key] = Object.fromEntries(
      Object.entries(mergedComposition).map(([key, value]) => {
        return [
          key,
          this.createStyle(value),
        ]
      }),
    )

    console.log('this.variantStyles[key]', this.variantStyles[key])

    return [this.variantStyles[key], key]

  }

  isCompositionStyle(component: AnyStyledComponent, style: any) {
    return component.elements.some((element) => {
      return typeof style[element] === 'object'
    })
  }

  styleFor(componentName:string, style: StyleProp) {
    const isStyleArray = Array.isArray(style)
    const registeredComponent = this.components[componentName]

    if (!registeredComponent) {
      throw new Error(`Component ${componentName} not registered`)
    }

    const isStyleObject = typeof style === 'object' && !isStyleArray

    if (typeof style === 'string') {
      const [computedStyle, key] = this.computeVariantStyle(componentName, [style])

      return this.mergeStyles([
        computedStyle,
      ], key)
    }

    if (isStyleObject) {
      const isCompositionStyle = this.isCompositionStyle(registeredComponent, style)

      return this.mergeStyles(
        [isCompositionStyle ? style : { [registeredComponent.rootElement]: style }],
        this.hashStyle(style),
      )
    }

    if (isStyleArray) {
      let variants:string[] = []
      const styles:ICSS[] = []
      let idx = 0

      for (const s of style) {
        if (typeof s === 'string') {
          variants.push(s)
        }

        if (typeof s === 'object') {
          if (variants.length > 0) {
            const [computedStyle, key] = this.computeVariantStyle(componentName, variants)
            styles.push(computedStyle)

            variants = []
          }
          const isCompositionStyle = this.isCompositionStyle(registeredComponent, s)
          styles.push(isCompositionStyle ? s : { [registeredComponent.rootElement]: s })
        }

        if (idx === style.length - 1 && variants.length > 0) {
          const [computedStyle, key] = this.computeVariantStyle(componentName, variants)

          styles.push(computedStyle)

        }

        idx++
      }

      return this.mergeStyles(styles, this.hashStyle(style))
    }

    console.warn('Invalid style prop for ', componentName, style)

    return {}
  }

  registerVariants(componentName:string, variants: VariantStyleSheet) {
    if (this.stylesheets[componentName]) {
      throw new Error(`Variants for ${componentName} already registered`)
    }

    this.stylesheets[componentName] = variants
  }

  registerComponent(component: AnyStyledComponent) {
    this.components[component.styleRegistryName] = component
  }

  /**
    * These should be overriden by the end-user to support
    * custom style merging logic, such as StyleSheet.flatten
    */
  mergeStyles(styles: ICSS[], key: string) {
    throw new Error('mergeStyles: Not implemented')
  }

  createStyle(css: ICSS): ICSS {
    throw new Error('createStyle: Not implemented')
  }

  hashStyle(style: StyleProp):string {
    throw new Error('HashStyle: Not implemented')
  }

}
