import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ButtonStates = 'disabled' | 'selected'

export type ButtonParts =
  | 'wrapper'
  | 'text'
  | 'icon'
  | 'leftIcon'
  | 'rightIcon'

export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

export const ButtonPresets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))
