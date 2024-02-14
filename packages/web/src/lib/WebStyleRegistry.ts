import { AnyStyledComponent, CodeleapStyleRegistry, ICSS } from '@codeleap/styles'

let instance: WebStyleRegistry

const components: CodeleapStyleRegistry['components'][string][] = []

export class WebStyleRegistry extends CodeleapStyleRegistry {

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
    return css
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
