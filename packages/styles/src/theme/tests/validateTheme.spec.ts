import { describe, expect, test } from 'bun:test'
import { validateTheme } from '../validateTheme'

describe('validateTheme', () => {
  test('should merge baseColors into colors', () => {
    const theme: any = {
      baseColors: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      colors: {
        background: '#f0f0f0',
        text: '#333333',
      },
    }

    const result = validateTheme(theme)

    expect(result.colors).toEqual({
      primary: '#000000',
      secondary: '#ffffff',
      background: '#f0f0f0',
      text: '#333333',
    })
  })

  test('should validate and merge alternate color schemes', () => {
    const theme: any = {
      baseColors: {
        primary: '#000000',
        secondary: '#ffffff',
      },
      colors: {
        background: '#f0f0f0',
        text: '#333333',
      },
      alternateColors: {
        dark: {
          background: '#1a1a1a',
          text: '#ffffff',
        },
      },
    }

    const result = validateTheme(theme)

    expect(result.alternateColors.dark).toEqual({
      primary: '#000000',
      secondary: '#ffffff',
      background: '#1a1a1a',
      text: '#ffffff',
    })
  })

  test('should throw error when alternate scheme is missing required colors', () => {
    const theme: any = {
      baseColors: {
        primary: '#000000',
      },
      colors: {
        background: '#f0f0f0',
        text: '#333333',
      },
      alternateColors: {
        dark: {
          background: '#1a1a1a',
          // Missing 'text' color
        },
      },
    }

    expect(() => validateTheme(theme)).toThrow(
      'Alternate color scheme dark is missing color text'
    )
  })

  test('should handle theme without alternateColors', () => {
    const theme: any = {
      baseColors: {
        primary: '#000000',
      },
      colors: {
        background: '#f0f0f0',
      },
    }

    const result = validateTheme(theme)

    expect(result.colors).toEqual({
      primary: '#000000',
      background: '#f0f0f0',
    })
    expect(result.alternateColors).toEqual({})
  })

  test('should handle empty baseColors', () => {
    const theme: any = {
      baseColors: {},
      colors: {
        background: '#f0f0f0',
        text: '#333333',
      },
      alternateColors: {
        dark: {
          background: '#1a1a1a',
          text: '#ffffff',
        },
      },
    }

    const result = validateTheme(theme)

    expect(result.colors).toEqual({
      background: '#f0f0f0',
      text: '#333333',
    })
    expect(result.alternateColors.dark).toEqual({
      background: '#1a1a1a',
      text: '#ffffff',
    })
  })

  test('should handle multiple alternate color schemes', () => {
    const theme: any = {
      baseColors: {
        primary: '#000000',
      },
      colors: {
        background: '#f0f0f0',
        text: '#333333',
      },
      alternateColors: {
        dark: {
          background: '#1a1a1a',
          text: '#ffffff',
        },
        light: {
          background: '#ffffff',
          text: '#000000',
        },
      },
    }

    const result = validateTheme(theme)

    expect(Object.keys(result.alternateColors)).toEqual(['dark', 'light'])
    expect(result.alternateColors.dark).toEqual({
      primary: '#000000',
      background: '#1a1a1a',
      text: '#ffffff',
    })
    expect(result.alternateColors.light).toEqual({
      primary: '#000000',
      background: '#ffffff',
      text: '#000000',
    })
  })

  test('should preserve all original theme properties', () => {
    const theme: any = {
      baseColors: { primary: '#000000' },
      colors: { background: '#f0f0f0' },
      alternateColors: { dark: { background: '#1a1a1a' } },
      name: 'test-theme',
      fontSize: { sm: '12px', md: '16px' },
    }

    const result = validateTheme(theme)

    expect(result.name).toBe('test-theme')
    expect(result.fontSize).toEqual({ sm: '12px', md: '16px' })
  })
})
