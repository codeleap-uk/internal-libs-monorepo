import { createTheme, validateTheme } from '@codeleap/styles'
import { dark, light } from './colors'
import { LocalStorage } from '../localStorage'
import { textStyles } from './text'
import { effects } from './effects'
import { Icons } from '../assets/icons'

const themeSpacing = 8

export const theme = createTheme(
  validateTheme({
    colors: light,
    alternateColors: {
      dark,
    },
    baseSpacing: themeSpacing,
    borderRadius: {
      tiny: 4,
      small: 8,
      medium: 24,
      rounded: 999999,
    },
    typography: {
      base: {
        fontFamily: 'Roboto',
        styles: textStyles,
      },
      quotes: {
        fontFamily: 'Roboto',
        styles: textStyles,
      },
    },
    icons: Icons,
    presets: {
      safeHorizontalPaddings: () => ({
        desktopHuge: 20 * themeSpacing,
        desktopLarge: 18 * themeSpacing,
        desktop: 16 * themeSpacing,
        laptop: 12 * themeSpacing,
        tablet: 8 * themeSpacing,
        tabletSmall: 4 * themeSpacing,
        mobile: 2 * themeSpacing,
      }),
      debugger: function (color: 'blue' | 'red' | 'yellow' | 'green' | 'purple' = 'red', background = false) {
        const hex = color === 'purple' ? '#9400D3' : color

        return {
          borderWidth: 1,
          borderColor: hex,
          color: hex,
          ...(background ? { backgroundColor: hex } : {}),
        }
      },
    },
    effects,
    breakpoints: {
      mobile: 600,
      tabletSmall: 900,
      tablet: 1050,
      laptop: 1200,
      desktop: 1400,
      desktopLarge: 1800,
      desktopHuge: 2559,
    },
    values: {
      height: 10,
      width: 10,
      pixel: 1,
      innerSpacing: { X: 2, Y: 2, value: 16 },
      outerSpacing: { X: 2, Y: 2, value: 16 },
      gap: 2,
      smallGap: 1,
      itemHeight: {
        default: 48,
        small: 32,
        tiny: 20,
      },
      iconSize: {
        1: 16,
        2: 20,
        3: 24,
        4: 32,
        5: 48,
        6: 64,
      },
      headerHeight: 60,
      borderWidth: {
        small: 1,
        medium: 2,
      },
      maxContentWidth: 1280,
    },
  }),
  {
    set: (colorSchema) => LocalStorage.setItem('COLOR_SCHEME', colorSchema),
    get: () => LocalStorage.getItem('COLOR_SCHEME'),
  },
)

export type AppThemeType = typeof theme
