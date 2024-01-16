export const spacingVariants = [
  'Vertical',
  'Horizontal',
  'Bottom',
  'Top',
  'Left',
  'Right',
  '',
] as const

export type SpacingVariants = typeof spacingVariants[number]

export type SpacingMultiplier =
  | 'auto'
  | number
  | ''

export type Spacing =
  | `padding${SpacingVariants}:${SpacingMultiplier}`
  | `margin${SpacingVariants}:${SpacingMultiplier}`
  | `gap:${SpacingMultiplier}`
  