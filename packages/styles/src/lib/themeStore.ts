import { AppTheme, ColorMap, IAppVariants, ITheme, Theme } from '../types'
import { map, atom, computed } from 'nanostores'

export type ThemeState = {
  theme: AppTheme<Theme> | null
  colorScheme: string | null
  variants: IAppVariants
}

class ThemeStore {
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

  setVariants<T>(variants: T) {
    this.variantsStore.set(variants as unknown as IAppVariants)
  }

  setColorScheme(colorScheme: string) {
    this.colorSchemeStore.set(colorScheme)
  }

  setTheme(theme: ITheme) {
    this.themeStore.set(theme)
  }

  injectColorScheme(name: string, colors: ColorMap) {
    const currentTheme = this.themeStore.get() as AppTheme<Theme>

    const alternateColors = {
      ...(currentTheme?.['alternateColors'] ?? {})
    }

    alternateColors[name] = colors

    this.setTheme({
      ...currentTheme,
      alternateColors,
    })
  }
}

export const themeStore = new ThemeStore()

export const themeStoreComputed = computed([
  themeStore['themeStore'], 
  themeStore['colorSchemeStore'], 
  themeStore['variantsStore']
], (theme, colorScheme, variants) => ({
  theme: theme as unknown as AppTheme<Theme>,
  colorScheme,
  variants
}))