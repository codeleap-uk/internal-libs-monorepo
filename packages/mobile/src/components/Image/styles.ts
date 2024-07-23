import { LoadingOverlayComposition } from '../LoadingOverlay'

export type ImageComposition = 'wrapper' | 'touchable' | `overlay${Capitalize<LoadingOverlayComposition>}`
