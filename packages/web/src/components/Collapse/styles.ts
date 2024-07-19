type CollapseState = 'open' | 'hidden'

type CollapseParts = 'wrapper'

export type CollapseComposition = CollapseParts | `${CollapseParts}:${CollapseState}`
