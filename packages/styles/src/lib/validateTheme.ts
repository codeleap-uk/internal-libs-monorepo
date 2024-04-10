import { Theme } from '../types/theme'

export function validateTheme<T extends Theme>(theme: T) {
  const colors = theme.colors
  const requiredColors = Object.keys(colors)

  const alternateColors = theme.alternateColors
  
  if (alternateColors) {
    for (const [colorSchemeName, colorSchemeColors] of Object.entries(alternateColors)) {
      const colorSchemeColorNames = Object.keys(colorSchemeColors)

      for (const requiredColor of requiredColors) {
        if (!colorSchemeColorNames.includes(requiredColor)) {
          throw new Error(`Alternate color scheme ${colorSchemeName} is missing color ${requiredColor}`)
        }
      }
    }
  }

  return theme
}
