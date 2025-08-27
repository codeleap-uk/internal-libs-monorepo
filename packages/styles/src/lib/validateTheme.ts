import { Theme } from '../types/theme'

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
