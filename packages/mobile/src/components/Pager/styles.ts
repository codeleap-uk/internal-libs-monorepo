export type DotStates = '' | ':active'
export type DotParts = 'wrapper' | `touchable${DotStates}` | `dot${DotStates}`

export type PagerComposition = 'page' | 'wrapper' | 'innerWrapper' | `dot${Capitalize<DotParts>}`
