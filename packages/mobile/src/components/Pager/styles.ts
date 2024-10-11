export type DotStates = '' | 'active'

export type DotParts = 'wrapper' | `touchable` | `dot`

export type DotComposition = DotParts | `${DotParts}:${DotStates}`

export type PagerComposition = 'carousel' | 'wrapper' | 'footerWrapper' | `dot${Capitalize<DotParts>}`
