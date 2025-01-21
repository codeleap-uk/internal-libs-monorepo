import { ICSS, ITheme, AnyRecord } from '../types'
import { themeStore } from './themeStore'

type StylesShape<K extends string, P extends AnyRecord> = Partial<Record<K, ICSS & Partial<P>>>

export function createStyles<K extends string, P extends AnyRecord = AnyRecord>(
  styles: StylesShape<K, P> | ((theme: ITheme) => StylesShape<K, P>),
) {

  const compute = () => {
    let styleObj = {} as StylesShape<K, P>
    const current = themeStore.getState().current

    if (typeof styles === 'function') {
      styleObj = !current ? {} : styles(current)
    } else {
      styleObj = styles
    }

    return styleObj
  }
  
  // We use a proxy here so that the color scheme is recomputed every time the
  // theme changes. This is necessary because the theme is a singleton which does not cause
  // a re-render when it changes. The end-user will only have to worry about remounting the root component
  // when the theme changes in order to get the new color scheme due to this proxy.
  return new Proxy(compute() as StylesShape<K, P>, {
    get(target, prop) {
      return compute()[prop as string]
    },
  })
}
