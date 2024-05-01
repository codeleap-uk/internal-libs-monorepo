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
  | 'description'
  | 'titleWrapper'
  | `closeButton${Capitalize<ActionIconComposition>}`
  | 'topSpacing'

export type ModalComposition =
  | ModalParts
  | `${AnimatableParts}:visible`
  | `${AnimatableParts}:hidden`
  | `${AnimatableParts}:transition`
