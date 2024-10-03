export type DotStates = '' | ':active'
export type DotParts = `touchable${DotStates}` | `dot${DotStates}`

export type PagerComposition = 'page' | 'wrapper' | 'dotsWrapper' | `dot${Capitalize<DotParts>}`
