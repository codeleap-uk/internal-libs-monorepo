import { AnyStyledComponent, CodeleapStyleRegistry, ICSS } from '@codeleap/styles'
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

  createStyle(css: ICSS): ICSS {
    return StyleSheet.create({ s: css }).s
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
