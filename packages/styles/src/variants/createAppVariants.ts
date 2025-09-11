import { ICSS, ITheme } from '../types'
import { themeStore } from '../theme'

type AppVariantsMap = {
  [x: string]: ICSS | ((theme: ITheme) => ICSS)
}

export function createAppVariants<T extends AppVariantsMap>(variants: T) {
  themeStore.setVariants(variants)

  return variants
}
