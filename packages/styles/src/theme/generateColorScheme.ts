import { colorTools } from '../tools'
import { ColorMap } from '../types'

const lightnesses = [95, 85, 75, 60, 45, 30, 27, 21, 16, 10]

const defaultLightnessMap = Object.fromEntries(
  lightnesses.map((l, i) => {
    const step = ((i + 1) * 100).toString()
    return [step, l]
  }),
)

const alphas = [0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90]

const defaultAlphasMap = Object.fromEntries(
  alphas.map((a, i) => {
    const step = ((i + 1) * 100).toString()
    return [step, a]
  }),
)

/**
 * Generates a complete color scheme from an anchor color.
 * Creates solid variants with different lightness and transparent variants.
 * 
 * @param {string} anchorHex - Base hex color for the scheme
 * @param {string} prefix - Prefix for generated color names
 * @param {object} lightnesses - Custom lightness mapping
 * @param {object} alphas - Custom alpha mapping
 * @returns {ColorMap} Complete color scheme object
 */
export function generateColorScheme(
  anchorHex: string,
  prefix = 'primary',
  lightnesses:typeof defaultLightnessMap = defaultLightnessMap,
  alphas: typeof defaultAlphasMap = defaultAlphasMap,
): ColorMap {
  const { h, s } = colorTools.hexToHSL(anchorHex)
  const baseRGB = colorTools.hexToRGB(anchorHex)

  const scheme: ColorMap = {}

  Object.entries(lightnesses).forEach(([step, lightness]) => {
    const rgb = colorTools.hslToRGB(h, s, lightness)
    scheme[`${prefix}Solid${step}`] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.00)`
  })

  Object.entries(alphas).forEach(([step, alpha]) => {
    scheme[`${prefix}Transparent${step}`] = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, ${alpha.toFixed(2)})`
  })

  return scheme
}
