import { AnyStyledComponent, CodeleapStyleRegistry, ICSS, StylePersistor } from '@codeleap/styles'

const persistor = new StylePersistor({
  set(key, value) {
    if (typeof window === 'undefined') return null
    return localStorage?.setItem(key, value)
  },
  get(key) {
    if (typeof window === 'undefined') return null
    return localStorage?.getItem(key)
  },
  del(key) {
    if (typeof window === 'undefined') return null
    return localStorage?.removeItem(key)
  },
})

let instance: WebStyleRegistry

const components: CodeleapStyleRegistry['components'][string][] = []

export class WebStyleRegistry extends CodeleapStyleRegistry {
  constructor() {
    super(persistor)

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
