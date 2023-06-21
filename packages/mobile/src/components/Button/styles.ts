import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'
import { BadgeComposition } from '../Badge'
import { TouchableStylesGen } from '../Touchable'

export type ButtonStates = 'disabled' | 'selected'
export type ButtonParts =
| 'text'
| 'inner'
| 'wrapper'
| 'icon'
| 'leftIcon'
| 'rightIcon'
| 'loader'
| `loader${Capitalize<ActivityIndicatorComposition>}`
| `badge${Capitalize<BadgeComposition>}`

export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts

export type ButtonStylesGen<TCSS = any> = StylesOf<ButtonComposition, TCSS> & {
  feedback?: TouchableStylesGen['feedback']
  textFeedback?: TouchableStylesGen['feedback']
  wrapperFeedback?: TouchableStylesGen['feedback']
}

const createButtonStyle = createDefaultVariantFactory<ButtonComposition, ButtonStylesGen >()

export const ButtonPresets = includePresets((styles) => createButtonStyle(() => ({ wrapper: styles })))
