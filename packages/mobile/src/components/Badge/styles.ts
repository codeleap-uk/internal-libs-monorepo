
type BadgeParts = 'wrapper' | 'innerWrapper' | 'count'

type BadgeStates = 'disabled'

export type BadgeComposition = `${BadgeParts}:${BadgeStates}` | BadgeParts
