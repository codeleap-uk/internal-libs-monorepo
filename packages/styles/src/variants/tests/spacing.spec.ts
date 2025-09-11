import { describe, expect, test } from 'bun:test'
import { spacingFactory } from '../spacing'
import { ICSS } from '../../types'

describe('spacing', () => {
  const base = 8
  const property = 'margin'

  test('should create basic spacing function', () => {
    const margin = spacingFactory(base, property, false)
    
    expect(margin.margin).toBeDefined()
    expect(typeof margin.margin).toBe('function')
    
    const result = margin.margin(2) as ICSS
    expect(result).toEqual({ 
      marginTop: 16,
      marginRight: 16,
      marginBottom: 16,
      marginLeft: 16
    })
  })

  test('should handle string numbers', () => {
    const margin = spacingFactory(base, property, false)
    
    const result = margin.margin('2') as ICSS
    expect(result).toEqual({ 
      marginTop: 16,
      marginRight: 16,
      marginBottom: 16,
      marginLeft: 16
    })
  })

  test('should create all spacing variants', () => {
    const margin = spacingFactory(base, property, false)
    
    // Test all long form variants
    expect(margin.marginTop(2)).toEqual({ marginTop: 16 })
    expect(margin.marginRight(2)).toEqual({ marginRight: 16 })
    expect(margin.marginBottom(2)).toEqual({ marginBottom: 16 })
    expect(margin.marginLeft(2)).toEqual({ marginLeft: 16 })
  })

  test('should work with short form notation', () => {
    const margin = spacingFactory(base, 'm', true)
    
    // Test short form variants
    expect(margin.mt(2)).toEqual({ marginTop: 16 })
    expect(margin.mr(2)).toEqual({ marginRight: 16 })
    expect(margin.mb(2)).toEqual({ marginBottom: 16 })
    expect(margin.ml(2)).toEqual({ marginLeft: 16 })
    expect(margin.mx(2)).toEqual({ marginLeft: 16, marginRight: 16 })
    expect(margin.my(2)).toEqual({ marginTop: 16, marginBottom: 16 })
    expect(margin.m(2)).toEqual({ marginTop: 16, marginBottom: 16, marginLeft: 16, marginRight: 16 })
  })

  test('should handle horizontal and vertical shortcuts', () => {
    const margin = spacingFactory(base, 'm', true)
    
    const horizontalResult = margin.mx(2) as ICSS
    expect(horizontalResult).toEqual({
      marginLeft: 16,
      marginRight: 16
    })
    
    const verticalResult = margin.my(2) as ICSS
    expect(verticalResult).toEqual({
      marginTop: 16,
      marginBottom: 16
    })
  })

  test('should handle "auto" values', () => {
    const margin = spacingFactory(base, property, false)
    
    const result = margin.margin('auto') as ICSS
    expect(result).toEqual({ 
      marginTop: 'auto',
      marginRight: 'auto',
      marginBottom: 'auto',
      marginLeft: 'auto'
    })
    
    const topResult = margin.marginTop('auto') as ICSS
    expect(topResult).toEqual({ marginTop: 'auto' })
  })

  test('should work with padding property', () => {
    const padding = spacingFactory(base, 'padding', false)
    
    expect(padding.padding(2)).toEqual({ 
      paddingTop: 16,
      paddingRight: 16,
      paddingBottom: 16,
      paddingLeft: 16
    })
    expect(padding.paddingTop(2)).toEqual({ paddingTop: 16 })
  })

  test('should work with short form padding', () => {
    const padding = spacingFactory(base, 'p', true)
    
    expect(padding.pt(2)).toEqual({ paddingTop: 16 })
    expect(padding.px(2)).toEqual({ paddingLeft: 16, paddingRight: 16 })
    expect(padding.p(2)).toEqual({ paddingLeft: 16, paddingRight: 16, paddingBottom: 16, paddingTop: 16 })
  })

  test('should handle decimal multipliers', () => {
    const margin = spacingFactory(base, property, false)
    
    const result = margin.margin(0.5) as ICSS
    expect(result).toEqual({ 
      marginTop: 4,
      marginRight: 4,
      marginBottom: 4,
      marginLeft: 4
    })
  })

  test('should handle zero values', () => {
    const margin = spacingFactory(base, property, false)
    
    const result = margin.margin(0) as ICSS
    expect(result).toEqual({ 
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0
    })
  })

  test('should return correct structure with all properties', () => {
    const margin = spacingFactory(base, property, false)
    
    // Check that all expected properties exist
    expect(margin).toHaveProperty('margin')
    expect(margin).toHaveProperty('marginTop')
    expect(margin).toHaveProperty('marginRight')
    expect(margin).toHaveProperty('marginBottom')
    expect(margin).toHaveProperty('marginLeft')
    
    // Check that they are functions
    expect(typeof margin.margin).toBe('function')
    expect(typeof margin.marginTop).toBe('function')
    expect(typeof margin.marginRight).toBe('function')
    expect(typeof margin.marginBottom).toBe('function')
    expect(typeof margin.marginLeft).toBe('function')
  })

  test('should handle edge cases with invalid numbers', () => {
    const margin = spacingFactory(base, property, false)
    
    // Should handle NaN by converting to NaN (since Number('invalid') returns NaN)
    const result = margin.margin('invalid') as ICSS
    expect(result).toEqual({ 
      marginTop: NaN,
      marginRight: NaN,
      marginBottom: NaN,
      marginLeft: NaN
    })
  })

  test('should handle empty string position for full spacing', () => {
    const margin = spacingFactory(base, property, false)
    
    // This tests the case where position is empty string
    const result = margin.margin(2) as ICSS
    expect(result).toEqual({
      marginTop: 16,
      marginRight: 16,
      marginBottom: 16,
      marginLeft: 16
    })
  })
})
