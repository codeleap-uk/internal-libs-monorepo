import { AnyFunction, AnyStyledComponent, CodeleapStyleRegistry, GenericStyledComponent, ICSS, deepmerge } from '@codeleap/styles'
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
      // eslint-disable-next-line consistent-this
      instance = this
    }
    return instance
  }

  hashStyle(style: any, keys: string[]): string {

    return ReactQuery.hashQueryKey([...keys, style])
  }

  createStyle(css: ICSS): ICSS {

    return StyleSheet.create({
      a: css,
    }).a
  }

  mergeStyles<T = ICSS>(styles: ICSS[], key: string): T {
    console.log('mergeStyles', key, typeof key)
    if (!this.styles[key]) {
      const mergedStyles = deepmerge({ all: true })(...styles)

      this.styles[key] = mergedStyles

    }

    return this.styles[key] as T
  }

  static get current() {
    return instance
  }

  static registerComponent(component: AnyStyledComponent) {
    components.push(component)
    if (instance) {
      instance.registerComponent(component)
    }
  }
}
