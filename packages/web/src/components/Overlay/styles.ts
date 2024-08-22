
type OverlayState = 'visible'

type OverlayParts = 'wrapper'

export type OverlayComposition = OverlayParts | `${OverlayParts}:${OverlayState}`
