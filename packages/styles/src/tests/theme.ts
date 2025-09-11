
import measures from './measures'
import baseColors from './colors/baseColors'
import lightMode from './colors/lightMode'
import darkMode from './colors/darkMode'
import { createTheme } from '../lib'
import { validateTheme } from '../theme'

export const mockTheme = () => {
  return createTheme(
    validateTheme({
      baseColors,
      colors: lightMode,
      alternateColors: {
        dark: { ...lightMode, ...darkMode },
      },
      baseSpacing: 8,
      radius: measures.radius,
      stroke: measures.stroke,
      size: measures.size,
      effects: {},
      typography: {
        fonts: {
          Inter: {
            normal: {
              '100': 'Inter-Thin',
              '200': 'Inter-ExtraLight',
              '300': 'Inter-Light',
              '400': 'Inter-Regular',
              '500': 'Inter-Medium',
              '600': 'Inter-SemiBold',
              '700': 'Inter-Bold',
              '800': 'Inter-ExtraBold',
            },
          },
        },
        defaults: {
          fontWeight: '400',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontSize: 16,
          lineHeight: 24,
          letterSpacing: 0.5,
        } as unknown,
      },
      icons: {},
      presets: {},
      values: {},
      isBrowser: true,
    }),
    {
      set: (name, colorSchema) => {},
      get: (name) => null,
    },
  )
}

export type MockedTheme = ReturnType<typeof mockTheme>