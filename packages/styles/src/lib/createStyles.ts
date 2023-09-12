import { ICSS, ITheme } from '../types'

type DefaultStyleShape = {
  [key:string] : ICSS
}

export function createStyles<Composition extends Record<any, any> = DefaultStyleShape>(
  styles: Composition | ((theme: ITheme) => Composition),
) {
  if (typeof styles === 'function') {
    return styles({})
  }

  return styles
}
