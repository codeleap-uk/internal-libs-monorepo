import { AnyStyledComponent, CodeleapStyleRegistry, ICSS, StylePersistor } from '@codeleap/styles'
import { StyleSheet } from 'react-native'
import { MMKV } from 'react-native-mmkv'

const mmkvStorage = new MMKV()

const persistor = new StylePersistor({
  set(key, value) {
    return mmkvStorage?.set(key, value)
  },
  get(key) {
    return mmkvStorage?.getString(key)
  },
  del(key) {
    return mmkvStorage?.delete(key)
  },
})

let instance: MobileStyleRegistry

const components: CodeleapStyleRegistry['components'][string][] = []

export class MobileStyleRegistry extends CodeleapStyleRegistry {
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
