import { describe, expect, test, beforeEach } from 'bun:test'
import { createDynamicVariants } from '../dynamicVariants'
import { IColors, IBorderRadius, IEffects } from '../../types'

const mockTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000'
  } as IColors,
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  } as IBorderRadius,
  effects: {
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  } as IEffects,
  isBrowser: true
}

describe('createDynamicVariants', () => {
  let dynamicVariants: any

  beforeEach(() => {
    dynamicVariants = createDynamicVariants()
  })

  test('should create color variants', () => {
    expect(dynamicVariants.backgroundColor).toBeDefined()
    expect(dynamicVariants.color).toBeDefined()

    const bgResult = dynamicVariants.backgroundColor(mockTheme, 'primary')
    expect(bgResult).toEqual({ backgroundColor: '#007bff' })

    const colorResult = dynamicVariants.color(mockTheme, 'secondary')
    expect(colorResult).toEqual({ color: '#6c757d' })
  })

  test('should create border property variants', () => {
    expect(dynamicVariants.borderColor).toBeDefined()
    const borderColorResult = dynamicVariants.borderColor(mockTheme, 'success')
    expect(borderColorResult).toEqual({ borderColor: '#28a745' })

    expect(dynamicVariants.borderWidth).toBeDefined()
    const borderWidthResult = dynamicVariants.borderWidth(mockTheme, 'md')
    expect(borderWidthResult).toEqual({ borderWidth: '0.375rem' })

    expect(dynamicVariants.borderRadius).toBeDefined()
    const borderRadiusResult = dynamicVariants.borderRadius(mockTheme, 'lg')
    expect(borderRadiusResult).toEqual({ borderRadius: '0.5rem' })
  })

  test('should create directional border variants', () => {
    expect(dynamicVariants.borderTopColor).toBeDefined()
    expect(dynamicVariants.borderRightColor).toBeDefined()
    expect(dynamicVariants.borderBottomColor).toBeDefined()
    expect(dynamicVariants.borderLeftColor).toBeDefined()

    const topColorResult = dynamicVariants.borderTopColor(mockTheme, 'danger')
    expect(topColorResult).toEqual({ borderTopColor: '#dc3545' })

    const leftWidthResult = dynamicVariants.borderLeftWidth(mockTheme, 'sm')
    expect(leftWidthResult).toEqual({ borderLeftWidth: '0.125rem' })
  })

  test('should create combined border radius variants', () => {
    expect(dynamicVariants.borderTopLeftRadius).toBeDefined()
    expect(dynamicVariants.borderTopRightRadius).toBeDefined()
    expect(dynamicVariants.borderBottomLeftRadius).toBeDefined()
    expect(dynamicVariants.borderBottomRightRadius).toBeDefined()

    const topLeftResult = dynamicVariants.borderTopLeftRadius(mockTheme, 'xl')
    expect(topLeftResult).toEqual({ borderTopLeftRadius: '0.75rem' })

    const bottomRightResult = dynamicVariants.borderBottomRightRadius(mockTheme, '2xl')
    expect(bottomRightResult).toEqual({ borderBottomRightRadius: '1rem' })
  })

  test('should create cursor variant', () => {
    expect(dynamicVariants.cursor).toBeDefined()

    const pointerResult = dynamicVariants.cursor(mockTheme, 'pointer')
    expect(pointerResult).toEqual({ cursor: 'pointer' })

    const notAllowedResult = dynamicVariants.cursor(mockTheme, 'not-allowed')
    expect(notAllowedResult).toEqual({ cursor: 'not-allowed' })

    const emptyResult = dynamicVariants.cursor(mockTheme, '')
    expect(emptyResult).toEqual({ cursor: '' })
  })

  test('should create bg shortcut variant', () => {
    expect(dynamicVariants.bg).toBeDefined()

    const bgResult = dynamicVariants.bg(mockTheme, 'warning')
    expect(bgResult).toEqual({ backgroundColor: '#ffc107' })
  })

  test('should create br shortcut variant', () => {
    expect(dynamicVariants.br).toBeDefined()

    const brResult = dynamicVariants.br(mockTheme, 'full')
    expect(brResult).toEqual({ borderRadius: '9999px' })
  })

  test('should create effect variant', () => {
    expect(dynamicVariants.effect).toBeDefined()

    const effectResult = dynamicVariants.effect(mockTheme, 'shadowMd')
    expect(effectResult).toEqual('0 4px 6px -1px rgba(0, 0, 0, 0.1)')
  })

  test('should create scale variant', () => {
    expect(dynamicVariants.scale).toBeDefined()

    // Test in browser environment
    const scaleResult = dynamicVariants.scale(mockTheme, 1.5)
    expect(scaleResult).toEqual({ transform: 'scale(1.5)' })

    // Test in non-browser environment
    const serverTheme = { ...mockTheme, isBrowser: false }
    const serverScaleResult = dynamicVariants.scale(serverTheme, 0.8)
    expect(serverScaleResult).toEqual({ transform: [{ scale: 0.8 }] })
  })

  test('should handle numeric values for scale', () => {
    const scaleResult = dynamicVariants.scale(mockTheme, 2)
    expect(scaleResult).toEqual({ transform: 'scale(2)' })

    const decimalResult = dynamicVariants.scale(mockTheme, 1.25)
    expect(decimalResult).toEqual({ transform: 'scale(1.25)' })
  })

  test('should handle empty string for cursor', () => {
    const result = dynamicVariants.cursor(mockTheme, '')
    expect(result).toEqual({ cursor: '' })
  })

  test('should return all expected variant functions', () => {
    const expectedVariants = [
      'backgroundColor',
      'color',
      'borderColor',
      'borderWidth',
      'borderRadius',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'borderTopRadius',
      'borderRightRadius',
      'borderBottomRadius',
      'borderLeftRadius',
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomLeftRadius',
      'borderBottomRightRadius',
      'cursor',
      'bg',
      'effect',
      'scale',
      'br'
    ]

    expectedVariants.forEach(variant => {
      expect(dynamicVariants[variant]).toBeDefined()
      expect(typeof dynamicVariants[variant]).toBe('function')
    })
  })

  test('should handle non-existent color gracefully', () => {
    const result = dynamicVariants.backgroundColor(mockTheme, 'nonexistent')
    expect(result).toHaveProperty('backgroundColor')
  })
})
