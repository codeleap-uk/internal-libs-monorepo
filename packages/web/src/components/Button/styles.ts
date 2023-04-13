import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { LoadingOverlayComposition } from '../LoadingOverlay'

export type ButtonStates = 'disabled'
export type ButtonParts =
| 'text'
| 'inner'
| 'wrapper'
| 'icon'
| 'leftIcon'
| 'rightIcon'
| `loading${Capitalize<LoadingOverlayComposition>}`
| 'badgeText'
| 'badgeWrapper'

export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts



const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

export const ButtonPresets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))
