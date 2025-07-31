import { AppTheme, ColorMap, IAppVariants, ITheme, Theme } from '../types'
import { map, computed } from 'nanostores'

export type ThemeState = {
  theme: AppTheme<Theme> | null
}

class ThemeStore {
  private alternateColorsSchemeStore: { [key: string]: ColorMap } = {}

  public colorSchemeStore: string = null

  public themeStore = map<ITheme | null>(null)

  public variantsStore: IAppVariants = {} as IAppVariants

  get theme() {
    return this.themeStore.get()
  }

  get themeTyped() {
    return this.themeStore.get() as unknown as AppTheme<Theme>
  }

  get colorScheme() {
    return this.colorSchemeStore
  }

  get variants() {
    return this.variantsStore
  }

  get alternateColorsScheme() {
    return this.alternateColorsSchemeStore ?? {}
  }

  setVariants<T>(variants: T) {
    this.variantsStore = variants as unknown as IAppVariants
  }

  setColorScheme(colorScheme: string) {
    this.colorSchemeStore = colorScheme
  }

  setTheme(theme: ITheme) {
    this.themeStore.set(theme)
  }

  setAlternateColorsScheme(colors: { [key: string]: ColorMap }) {
    this.alternateColorsSchemeStore = colors
  }

  // utils

  private getBaseColorScheme(): ColorMap {
    const alternateColors = this.alternateColorsScheme ?? {}
    const colorSchemeKeys = Object.keys(alternateColors)
    
    if (colorSchemeKeys.length === 0) {
      return {}
    }
    
    return alternateColors[colorSchemeKeys[0]] ?? {}
  }

  injectColorScheme(name: string, colors: ColorMap) {
    const baseColors = this.getBaseColorScheme()
    const currentAlternateColors = this.alternateColorsScheme ?? {}

    const alternateColors = {
      ...currentAlternateColors,

      [name]: {
        ...baseColors,
        ...colors,
      }
    }
    
    this.setAlternateColorsScheme(alternateColors)

    return alternateColors
  }
}

export const themeStore = new ThemeStore()

export const themeStoreComputed = computed([
  themeStore['themeStore'], 
], (theme) => ({
  theme: theme as unknown as AppTheme<Theme>,
}))
