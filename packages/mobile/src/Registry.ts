import { AnyFunction, CodeleapStyleRegistry, GenericStyledComponent, ICSS, de, deepmerge } from '@codeleap/styles'
import { ReactQuery } from '@codeleap/common'
import { StyleSheet } from 'react-native'

let instance: MobileStyleRegistry

const components:CodeleapStyleRegistry['components'][string][] = []

export class MobileStyleRegistry extends CodeleapStyleRegistry {

  constructor() {
    super()
    components.forEach((component) => {
      this.registerComponent(component)
    })
    if (!instance) {
      instance = this
    }
    return instance
  }

  hashStyle(style: any): string {
    console.log('hashStyle', style)
    return ReactQuery.hashQueryKey([style])
  }

  createStyle(css: ICSS): ICSS {
    console.log('createStyle', css)
    return StyleSheet.create({
      a: css,
    }).a
  }

  mergeStyles(styles: ICSS[], key: string): ICSS {
    console.log('mergeStyles', JSON.stringify(styles), key)

    if (!this.styles[key]) {
      const mergedStyles = deepmerge({ all: true })(...styles)

      this.styles[key] = mergedStyles

    }

    return this.styles[key]
  }

  static get current() {
    return instance
  }

  static registerComponent(component: GenericStyledComponent<AnyFunction, any>) {
    components.push(component)
    if (instance) {
      instance.registerComponent(component)
    }
  }
}
