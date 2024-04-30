import { ICSS, ITheme } from '../types'
import { themeStore } from './themeStore'

type StylesShape<K extends string> = Partial<Record<K, ICSS>>

export function createStyles<K extends string>(
  styles: StylesShape<K> | ((theme: ITheme) => StylesShape<K>),
) {

  const compute = () => {
    let styleObj = {} as StylesShape<K>
    const current = themeStore.getState().current

    if (typeof styles === 'function') {
      styleObj = styles(current)
    } else {
      styleObj = styles
    }

    return styleObj
  }
  
  // We use a proxy here so that the color scheme is recomputed every time the
  // theme changes. This is necessary because the theme is a singleton which does not cause
  // a re-render when it changes. The end-user will only have to worry about remounting the root component
  // when the theme changes in order to get the new color scheme due to this proxy.
  return new Proxy(compute() as StylesShape<K>, {
    get(target, prop) {
      return compute()[prop as string]
    },
  })
}
