import { AppTheme, ColorMap, IAppVariants, ITheme, Theme } from '../types'
import { map, computed, atom } from 'nanostores'

export type ThemeState = {
  theme: AppTheme<Theme> | null
  colorScheme: string | null
}

class ThemeStore {
  private readonly alternateColorsSchemeStore = map<{ [key: string]: ColorMap }>({})

  public readonly colorSchemeStore = atom<string | null>(null)

  public readonly themeStore = map<ITheme | null>(null)

  public readonly variantsStore = map<IAppVariants>({})

  get theme() {
    return this.themeStore.get()
  }

  get themeTyped() {
    return this.themeStore.get() as unknown as AppTheme<Theme>
  }

  get colorScheme() {
    return this.colorSchemeStore.get()
  }

  get variants() {
    return this.variantsStore.get()
  }

  get alternateColorsScheme() {
    return this.alternateColorsSchemeStore.get() ?? {}
  }

  setVariants<T>(variants: T) {
    this.variantsStore.set(variants as unknown as IAppVariants)
  }

  setColorScheme(colorScheme: string) {
    this.colorSchemeStore.set(colorScheme)
  }

  setTheme(theme: ITheme) {
    this.themeStore.set(theme)
  }

  setAlternateColorsScheme(colors: { [key: string]: ColorMap }) {
    this.alternateColorsSchemeStore.set(colors)
  }

  // utils

  private getBaseSchemeColors(): ColorMap {
    const alternateColors = this.alternateColorsScheme ?? {}
    const colorSchemeKeys = Object.keys(alternateColors)

    if (colorSchemeKeys.length === 0) {
      return {}
    }

    return alternateColors[colorSchemeKeys[0]] ?? {}
  }

  injectColorScheme(name: string, colors: ColorMap) {
    const baseSchemeColors = this.getBaseSchemeColors()
    const currentAlternateColors = this.alternateColorsScheme ?? {}

    const alternateColors = {
      ...currentAlternateColors,

      [name]: {
        ...baseSchemeColors,
        ...colors,
      },
    }

    this.setAlternateColorsScheme(alternateColors)

    return alternateColors
  }

  ejectColorScheme(name:string) {
    const currentAlternateColors = this.alternateColorsScheme ?? {}

    if (name in currentAlternateColors) {
      delete currentAlternateColors[name]
    }

    this.setAlternateColorsScheme(currentAlternateColors)

    return currentAlternateColors
  }
}

export const themeStore = new ThemeStore()

export const themeStoreComputed = computed([
  themeStore.themeStore,
  themeStore.colorSchemeStore,
], (theme, colorScheme) => ({
  theme: theme as unknown as AppTheme<Theme>,
  colorScheme,
}))
