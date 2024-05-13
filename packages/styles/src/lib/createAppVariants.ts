import { ICSS, ITheme } from '../types'
import { themeStore } from './themeStore'

type AppVariantsMap = {
  [x: string]: ICSS | ((theme: ITheme) => ICSS)
}

export function createAppVariants<T extends AppVariantsMap>(variants: T) {
  themeStore.setState({ variants })

  return variants
}
