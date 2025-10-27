export type CollapseParts = 'wrapper' | 'content'

export type CollapseStates = ':open' | ':closed' | ''

export type CollapseComposition = `${CollapseParts}${CollapseStates}`