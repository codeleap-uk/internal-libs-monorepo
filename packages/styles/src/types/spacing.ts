export const spacingVariants = [
  'Vertical',
  'Horizontal',
  'Bottom',
  'Top',
  'Left',
  'Right',
  '',
] as const

export const spacingShortVariants = [
  'y',
  'x',
  'b',
  't',
  'l',
  'r',
  '',
] as const

export type SpacingVariants = typeof spacingVariants[number]

export type SpacingShortVariants = typeof spacingShortVariants[number]

export type Multiplier =
  | 'auto'
  | number
  | ''

export type Spacing =
  | `padding${SpacingVariants}:${Multiplier}`
  | `margin${SpacingVariants}:${Multiplier}`
  | `p${SpacingShortVariants}:${Multiplier}`
  | `m${SpacingShortVariants}:${Multiplier}`
  | `gap:${Multiplier}`
