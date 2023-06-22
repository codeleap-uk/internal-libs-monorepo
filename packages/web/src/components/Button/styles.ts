import { ActivityIndicatorComposition, createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { LoadingOverlayComposition } from '../LoadingOverlay'

export type ButtonStates = 'disabled' | 'selected'
export type ButtonParts =
| 'text'
| 'inner'
| 'wrapper'
| 'icon'
| 'leftIcon'
| 'rightIcon'
| `loading${Capitalize<LoadingOverlayComposition>}`
| 'loader'
| `loader${Capitalize<ActivityIndicatorComposition>}`
| 'badgeText'
| 'badgeWrapper'

export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

export const ButtonPresets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))
