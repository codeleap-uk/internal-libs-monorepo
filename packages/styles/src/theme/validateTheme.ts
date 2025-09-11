import { Theme } from '../types/theme'

/**
 * Validates and normalizes a theme object.
 * Ensures all alternate color schemes include the same keys as `colors`,
 * and merges `baseColors` into `colors` and `alternateColors`.
 *
 * @template T extends Theme
 * @param {T} theme - The theme to validate.
 * @throws {Error} If an alternate scheme is missing a required color.
 * @returns {T & {
 *   alternateColors: Record<string, Record<string, string>>,
 *   colors: Record<string, string>
 * }} The validated theme with merged colors.
 */
export function validateTheme<T extends Theme>(theme: T) {
  const baseColors = theme.baseColors
  
  const colors = theme.colors

  const alternateColors = theme.alternateColors

  const requiredColors = Object.keys(colors)

  const mergedAlternateColors = {}
  
  if (alternateColors) {
    for (const [colorSchemeName, colorSchemeColors] of Object.entries(alternateColors)) {
      const colorSchemeColorNames = Object.keys(colorSchemeColors)

      for (const requiredColor of requiredColors) {
        if (!colorSchemeColorNames.includes(requiredColor)) {
          throw new Error(`Alternate color scheme ${colorSchemeName} is missing color ${requiredColor}`)
        }
      }

      mergedAlternateColors[colorSchemeName] = {
        ...baseColors,
        ...colorSchemeColors,
      }
    }
  }

  return {
    ...theme,
    alternateColors: mergedAlternateColors,
    colors: {
      ...baseColors,
      ...colors,
    },
  }
}
