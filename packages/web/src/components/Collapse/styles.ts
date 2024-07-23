type CollapseState = 'open' | 'closed'

type CollapseParts = 'wrapper'

export type CollapseComposition = CollapseParts | `${CollapseParts}:${CollapseState}`
