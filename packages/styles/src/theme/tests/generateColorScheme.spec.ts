import { describe, expect, test } from 'bun:test'
import { generateColorScheme } from '../generateColorScheme'
import { colorTools } from '../../tools'

describe('generateColorScheme', () => {
  test('should generate solid and transparent variants from anchor color', () => {
    const result = generateColorScheme('#4080c0', 'primary')

    expect(Object.keys(result)).toHaveLength(20)

    for (let i = 1; i <= 10; i++) {
      const step = i * 100
      expect(result).toHaveProperty(`primarySolid${step}`)
      expect(result[`primarySolid${step}`]).toMatch(/^rgba\(\d+, \d+, \d+, 1\.00\)$/)
    }

    for (let i = 1; i <= 10; i++) {
      const step = i * 100
      expect(result).toHaveProperty(`primaryTransparent${step}`)
      expect(result[`primaryTransparent${step}`]).toMatch(/^rgba\(\d+, \d+, \d+, 0\.\d{2}\)$/)
    }
  })

  test('should use custom prefix', () => {
    const result = generateColorScheme('#4080c0', 'accent')

    expect(result).toHaveProperty('accentSolid100')
    expect(result).toHaveProperty('accentTransparent100')
    expect(result).not.toHaveProperty('primarySolid100')
  })

  test('should use custom lightness and alpha mappings', () => {
    const customLightnesses = { '100': 90, '200': 80 }
    const customAlphas = { '100': 0.1, '200': 0.2 }

    const result = generateColorScheme('#4080c0', 'primary', customLightnesses, customAlphas)

    expect(Object.keys(result)).toHaveLength(4)
    expect(result).toHaveProperty('primarySolid100')
    expect(result).toHaveProperty('primarySolid200')
    expect(result).toHaveProperty('primaryTransparent100')
    expect(result).toHaveProperty('primaryTransparent200')
  })

  test('should generate correct color values for known input', () => {
    const result = generateColorScheme('#ff0000', 'red') // Vermelho puro

    const hsl = colorTools.hexToHSL('#ff0000')
    expect(hsl.h).toBe(0)
    expect(hsl.s).toBe(100)

    const solidColor = result['redSolid100']
    expect(solidColor).toMatch(/^rgba\(\d+, \d+, \d+, 1\.00\)$/)
  })

  test('should handle edge cases with black color', () => {
    const result = generateColorScheme('#000000', 'black')

    for (let i = 1; i <= 10; i++) {
      const step = i * 100
      const color = result[`blackSolid${step}`]
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 1\.00\)$/)

      const [r, g, b] = color.match(/\d+/g)!.map(Number)

      expect(r).toBe(g)
      expect(g).toBe(b)
    }
  })

  test('should handle edge cases with white color', () => {
    const result = generateColorScheme('#ffffff', 'white')

    for (let i = 1; i <= 10; i++) {
      const step = i * 100
      const color = result[`whiteSolid${step}`]
      expect(color).toMatch(/^rgba\(\d+, \d+, \d+, 1\.00\)$/)

      const [r, g, b] = color.match(/\d+/g)!.map(Number)

      expect(r).toBe(g)
      expect(g).toBe(b)
    }
  })

  test('should generate alpha values in correct order', () => {
    const result = generateColorScheme('#4080c0', 'test')

    const alphaValues = []
    for (let i = 1; i <= 10; i++) {
      const step = i * 100
      const color = result[`testTransparent${step}`]
      const alpha = parseFloat(color.match(/[\d.]+\)$/)?.[0]?.replace(')', '') || '0')
      alphaValues.push(alpha)
    }

    for (let i = 0; i < alphaValues.length - 1; i++) {
      expect(alphaValues[i]).toBeLessThan(alphaValues[i + 1])
    }
  })

  test('should generate lightness values in correct order', () => {
    const result = generateColorScheme('#4080c0', 'test')

    const lightnessValues = []
    for (let i = 1; i <= 10; i++) {
      const step = i * 100
      const color = result[`testSolid${step}`]
      const [r, g, b] = color.match(/\d+/g)!.map(Number)
      const hsl = colorTools.rgbToHSL({ r, g, b })
      lightnessValues.push(hsl.l)
    }

    for (let i = 0; i < lightnessValues.length - 1; i++) {
      expect(lightnessValues[i]).toBeGreaterThan(lightnessValues[i + 1])
    }
  })
})
