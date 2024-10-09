export type DotStates = '' | ':active'
export type DotParts = 'wrapper' | `touchable${DotStates}` | `dot${DotStates}`

export type PagerComposition = 'carousel' | 'wrapper' | 'innerWrapper' | `dot${Capitalize<DotParts>}`
