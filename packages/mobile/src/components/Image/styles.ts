import { LoadingOverlayComposition } from '../LoadingOverlay/styles'

export type ImageComposition = 'wrapper' | 'touchable' | `overlay${Capitalize<LoadingOverlayComposition>}`
