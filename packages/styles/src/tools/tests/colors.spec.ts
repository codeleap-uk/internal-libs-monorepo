import { test, expect, describe } from 'bun:test'
import { 
  hexToHSL, 
  hslToHex, 
  hexToRGB, 
  hslToRGB, 
  getLuminance,
  getTextColor 
} from '../colors'

describe('colors', () => {
  describe('hexToHSL', () => {
    test('should convert red hex to HSL', () => {
      const result = hexToHSL('#ff0000')
      expect(result).toEqual({ h: 0, s: 100, l: 50 })
    })

    test('should convert green hex to HSL', () => {
      const result = hexToHSL('#00ff00')
      expect(result).toEqual({ h: 120, s: 100, l: 50 })
    })

    test('should convert blue hex to HSL', () => {
      const result = hexToHSL('#0000ff')
      expect(result).toEqual({ h: 240, s: 100, l: 50 })
    })

    test('should convert white to HSL', () => {
      const result = hexToHSL('#ffffff')
      expect(result).toEqual({ h: 0, s: 0, l: 100 })
    })

    test('should convert black to HSL', () => {
      const result = hexToHSL('#000000')
      expect(result).toEqual({ h: 0, s: 0, l: 0 })
    })

    test('should handle custom colors', () => {
      const result = hexToHSL('#ff5733')
      expect(result.h).toBeGreaterThanOrEqual(0)
      expect(result.h).toBeLessThanOrEqual(360)
      expect(result.s).toBeGreaterThanOrEqual(0)
      expect(result.s).toBeLessThanOrEqual(100)
      expect(result.l).toBeGreaterThanOrEqual(0)
      expect(result.l).toBeLessThanOrEqual(100)
    })
  })

  describe('hslToHex', () => {
    test('should convert HSL to red hex', () => {
      const result = hslToHex(0, 100, 50)
      expect(result).toBe('#ff0000')
    })

    test('should convert HSL to green hex', () => {
      const result = hslToHex(120, 100, 50)
      expect(result).toBe('#00ff00')
    })

    test('should convert HSL to blue hex', () => {
      const result = hslToHex(240, 100, 50)
      expect(result).toBe('#0000ff')
    })

    test('should convert HSL to white hex', () => {
      const result = hslToHex(0, 0, 100)
      expect(result).toBe('#ffffff')
    })

    test('should convert HSL to black hex', () => {
      const result = hslToHex(0, 0, 0)
      expect(result).toBe('#000000')
    })
  })

  describe('hexToRGB', () => {
    test('should convert red hex to RGB', () => {
      const result = hexToRGB('#ff0000')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    test('should convert green hex to RGB', () => {
      const result = hexToRGB('#00ff00')
      expect(result).toEqual({ r: 0, g: 255, b: 0 })
    })

    test('should convert blue hex to RGB', () => {
      const result = hexToRGB('#0000ff')
      expect(result).toEqual({ r: 0, g: 0, b: 255 })
    })

    test('should convert white hex to RGB', () => {
      const result = hexToRGB('#ffffff')
      expect(result).toEqual({ r: 255, g: 255, b: 255 })
    })

    test('should convert black hex to RGB', () => {
      const result = hexToRGB('#000000')
      expect(result).toEqual({ r: 0, g: 0, b: 0 })
    })
  })

  describe('hslToRGB', () => {
    test('should convert red HSL to RGB', () => {
      const result = hslToRGB(0, 100, 50)
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    test('should convert green HSL to RGB', () => {
      const result = hslToRGB(120, 100, 50)
      expect(result).toEqual({ r: 0, g: 255, b: 0 })
    })

    test('should convert blue HSL to RGB', () => {
      const result = hslToRGB(240, 100, 50)
      expect(result).toEqual({ r: 0, g: 0, b: 255 })
    })

    test('should convert white HSL to RGB', () => {
      const result = hslToRGB(0, 0, 100)
      expect(result).toEqual({ r: 255, g: 255, b: 255 })
    })

    test('should convert black HSL to RGB', () => {
      const result = hslToRGB(0, 0, 0)
      expect(result).toEqual({ r: 0, g: 0, b: 0 })
    })
  })

  describe('conversion roundtrip', () => {
    test('hex -> HSL -> hex should maintain color integrity', () => {
      const originalHex = '#ff5733'
      const hsl = hexToHSL(originalHex)
      const backToHex = hslToHex(hsl.h, hsl.s, hsl.l)
      
      // Allow for small rounding differences in conversion
      const original = hexToRGB(originalHex)
      const converted = hexToRGB(backToHex)
      
      expect(Math.abs(original.r - converted.r)).toBeLessThanOrEqual(1)
      expect(Math.abs(original.g - converted.g)).toBeLessThanOrEqual(1)
      expect(Math.abs(original.b - converted.b)).toBeLessThanOrEqual(1)
    })

    test('should work with primary colors (exact conversion)', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000']
      
      colors.forEach(hex => {
        const hsl = hexToHSL(hex)
        const backToHex = hslToHex(hsl.h, hsl.s, hsl.l)
        expect(backToHex).toBe(hex)
      })
    })
  })

  describe('getLuminance', () => {
    test('should return 1 for white', () => {
      const luminance = getLuminance({ r: 255, g: 255, b: 255 })
      expect(luminance).toBeCloseTo(1, 2)
    })

    test('should return 0 for black', () => {
      const luminance = getLuminance({ r: 0, g: 0, b: 0 })
      expect(luminance).toBeCloseTo(0, 2)
    })

    test('should return values between 0 and 1', () => {
      const colors = [
        { r: 255, g: 0, b: 0 },    // Red
        { r: 0, g: 255, b: 0 },    // Green
        { r: 0, g: 0, b: 255 },    // Blue
        { r: 128, g: 128, b: 128 } // Gray
      ]

      colors.forEach(color => {
        const luminance = getLuminance(color)
        expect(luminance).toBeGreaterThanOrEqual(0)
        expect(luminance).toBeLessThanOrEqual(1)
      })
    })

    test('should calculate different values for different colors', () => {
      const red = getLuminance({ r: 255, g: 0, b: 0 })
      const green = getLuminance({ r: 0, g: 255, b: 0 })
      const blue = getLuminance({ r: 0, g: 0, b: 255 })

      expect(red).not.toBe(green)
      expect(green).not.toBe(blue)
      expect(red).not.toBe(blue)
    })
  })

  describe('getTextColor', () => {
    test('should return dark text for light backgrounds', () => {
      const textColor = getTextColor('#ffffff') // White background
      expect(textColor).toBe('black')
    })

    test('should return light text for dark backgrounds', () => {
      const textColor = getTextColor('#000000') // Black background
      expect(textColor).toBe('white')
    })

    test('should use custom colors when provided', () => {
      const textColor = getTextColor('#ffffff', '#333333', '#f0f0f0')
      expect(textColor).toBe('#333333')
    })

    test('should handle medium brightness colors', () => {
      const lightGray = getTextColor('#cccccc')
      const darkGray = getTextColor('#333333')
      
      expect(lightGray).toBe('black')
      expect(darkGray).toBe('white')
    })

    test('should be consistent with luminance calculations', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      
      colors.forEach(hex => {
        const rgb = hexToRGB(hex)
        const luminance = getLuminance(rgb)
        const textColor = getTextColor(hex)
        
        if (luminance > 0.5) {
          expect(textColor).toBe('black')
        } else {
          expect(textColor).toBe('white')
        }
      })
    })
  })
})