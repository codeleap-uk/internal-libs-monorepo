import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'

export type AnimatableParts = 'box' | 'backdrop' | 'wrapper'

export type ModalParts =
  | AnimatableParts
  | 'body'
  | 'footer'
  | 'header'
  | 'title'
  | 'innerWrapper'
  | 'backdropPressable'
  | 'description'
  | 'titleWrapper'
  | `closeButton${Capitalize<ActionIconComposition>}`

export type ModalComposition =
  | ModalParts
  | `${AnimatableParts}:visible`
  | `${AnimatableParts}:hidden`

const createModalStyle = createDefaultVariantFactory<ModalComposition>()

export const ModalPresets = includePresets((style) => createModalStyle(() => ({ body: style })))
