import { AnyRecord, ICSS, ITheme } from '../types'
import { themeStore } from './themeStore'

type Value = AnyRecord

type StylesShape<K extends string, V extends Value> = Partial<Record<K, ICSS & Partial<Omit<V, keyof ICSS>>>>

export function createStyles<K extends string, V extends Value = {}>(
  styles: StylesShape<K, V> | ((theme: ITheme) => StylesShape<K, V>),
) {
  const compute = () => {
    const current = themeStore.getState().current

    if (typeof styles === 'function') {
      return !current ? {} as StylesShape<K, V> : styles(current)
    } else {
      return styles
    }
  }
  
  // We use a proxy here so that the color scheme is recomputed every time the
  // theme changes. This is necessary because the theme is a singleton which does not cause
  // a re-render when it changes. The end-user will only have to worry about remounting the root component
  // when the theme changes in order to get the new color scheme due to this proxy.
  return new Proxy(compute() as StylesShape<K, V>, {
    get(target, prop) {
      return compute()[prop as string]
    },
  })
}
