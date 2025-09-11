import { AppTheme, ColorMap, IAppVariants, ITheme, Theme } from '../types'
import { map, computed, atom } from 'nanostores'

/**
 * Theme state interface containing theme and color scheme information.
 */
export type ThemeState = {
  theme: AppTheme<Theme> | null
  colorScheme: string | null
}

/**
 * Global theme store that manages application theme, color schemes, and variants.
 * Uses nanostores for reactive state management.
 */
export class ThemeStore {
  private readonly alternateColorsSchemeStore = map<{ [key: string]: ColorMap }>({})

  public readonly colorSchemeStore = atom<string | null>(null)

  public readonly themeStore = map<ITheme | null>(null)

  public readonly variantsStore = map<IAppVariants>({})

  /**
   * Gets the current theme.
   * @returns {ITheme | null} Current theme or null if not set
   */
  get theme() {
    return this.themeStore.get()
  }

  /**
   * Gets the current theme with typed interface.
   * @returns {AppTheme<Theme>} Current theme cast to AppTheme type
   */
  get themeTyped() {
    return this.themeStore.get() as unknown as AppTheme<Theme>
  }

  /**
   * Gets the current color scheme name.
   * @returns {string | null} Current color scheme name or null if not set
   */
  get colorScheme() {
    return this.colorSchemeStore.get()
  }

  /**
   * Gets the current variants configuration.
   * @returns {IAppVariants} Current variants object
   */
  get variants() {
    return this.variantsStore.get()
  }

  /**
   * Gets all alternate color schemes.
   * @returns {{ [key: string]: ColorMap }} Object containing all alternate color schemes
   */
  get alternateColorsScheme() {
    return this.alternateColorsSchemeStore.get() ?? {}
  }

  /**
   * Sets the variants configuration.
   * @template T
   * @param {T} variants - Variants configuration to set
   */
  setVariants<T>(variants: T) {
    this.variantsStore.set(variants as unknown as IAppVariants)
  }

  /**
   * Sets the current color scheme.
   * @param {string} colorScheme - Color scheme name to set
   */
  setColorScheme(colorScheme: string) {
    this.colorSchemeStore.set(colorScheme)
  }

  /**
   * Sets the current theme.
   * @param {ITheme} theme - Theme object to set
   */
  setTheme(theme: ITheme) {
    this.themeStore.set(theme)
  }

  /**
   * Sets all alternate color schemes.
   * @param {{ [key: string]: ColorMap }} colors - Object containing color schemes
   */
  setAlternateColorsScheme(colors: { [key: string]: ColorMap }) {
    this.alternateColorsSchemeStore.set(colors)
  }

  /**
   * Gets the base color scheme colors (first available scheme).
   * @private
   * @returns {ColorMap} Base color scheme colors
   */
  private getBaseSchemeColors(): ColorMap {
    const alternateColors = this.alternateColorsScheme ?? {}
    const colorSchemeKeys = Object.keys(alternateColors)

    if (colorSchemeKeys.length === 0) {
      return {}
    }

    return alternateColors[colorSchemeKeys[0]] ?? {}
  }

  /**
   * Injects a new color scheme, merging with base scheme colors.
   * @param {string} name - Name of the color scheme
   * @param {ColorMap} colors - Color map to inject
   * @returns {{ [key: string]: ColorMap }} Updated alternate colors object
   */
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

  /**
   * Removes a color scheme by name.
   * @param {string} name - Name of the color scheme to remove
   * @returns {{ [key: string]: ColorMap }} Updated alternate colors object
   */
  ejectColorScheme(name:string) {
    const currentAlternateColors = this.alternateColorsScheme ?? {}

    if (name in currentAlternateColors) {
      delete currentAlternateColors[name]
    }

    this.setAlternateColorsScheme(currentAlternateColors)

    return currentAlternateColors
  }
}

/**
 * Global theme store instance.
 */
export const themeStore = new ThemeStore()

/**
 * Computed store that combines theme and color scheme for reactive updates.
 * @returns {ThemeState} Combined theme state with theme and colorScheme
 */
export const themeStoreComputed = computed([
  themeStore.themeStore,
  themeStore.colorSchemeStore,
], (theme, colorScheme) => ({
  theme: theme as unknown as AppTheme<Theme>,
  colorScheme,
}))
