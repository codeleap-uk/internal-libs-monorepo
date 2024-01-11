import { AnyStyledComponent, CodeleapStyleRegistry, ICSS, deepmerge } from '@codeleap/styles'
import { ReactQuery } from '@codeleap/common'

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

  hashStyle(style: any, keys: string[]): string {
    return ReactQuery.hashQueryKey([...keys, style])
  }

  createStyle(css: ICSS): ICSS {
    return css
  }

  mergeStyles<T = ICSS>(styles: ICSS[], key: string): T {
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
