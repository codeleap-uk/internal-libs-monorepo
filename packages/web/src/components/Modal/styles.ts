import {
  createDefaultVariantFactory,
  includePresets,
} from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'

export type AnimatableParts = 'box' | 'backdrop'

export type ModalParts =
  | AnimatableParts
  | 'wrapper'
  | 'innerWrapper'
  | 'scrollContent'
  | 'scroll'
  | 'body'
  | 'footer'
  | 'header'
  | 'backdropTouchable'
  | 'title'
  | `closeButton${Capitalize<ActionIconComposition>}`

export type ModalComposition =
  | ModalParts
  | `${AnimatableParts}:visible`
  | `${AnimatableParts}:hidden`
  | `${AnimatableParts}:transition`

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

export const ModalPresets = includePresets((style) => createModalStyle(() => ({ body: style })))
