import { TypeGuards } from '@codeleap/common'
import { useNestedStylesByKey } from '@codeleap/styles'
import { ActionIconParts } from '../ActionIcon'
import { UseInputBaseStyles } from './types'
import { concatStyles, getIconStyles, iconStylesOf } from './utils'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

type InputIcons = 'icon' | 'leftIcon' | 'rightIcon'

type IconParts = ActionIconParts

export type InputIconComposition = `${InputIcons}${Capitalize<IconParts>}`

export type InputBaseStates = 'error' | 'focus' | 'disabled'

export type InputBaseParts =
  'wrapper' |
  'innerWrapper' |
  'label' |
  'errorMessage' |
  'description' |
  'labelRow'|
  InputIconComposition

export type IconLessInputBaseParts = Exclude<InputBaseParts, InputIconComposition>

export type InputBaseComposition = `${InputBaseParts}:${InputBaseStates}` | InputBaseParts

export const useInputBaseStyles = (props: UseInputBaseStyles) => {
  const {
    focused,
    disabled,
    error,
    style,
  } = props

  const styles = useStylesFor(props?.styleRegistryName, style)

  const hasError = !TypeGuards.isNil(error)

  const _leftIconStyles = useNestedStylesByKey('leftIcon', styles)
  const _rightIconStyles = useNestedStylesByKey('rightIcon', styles)
  const _baseIconStyles = useNestedStylesByKey('icon', styles)

  const baseIconStyles = getIconStyles(_baseIconStyles, { hasError, disabled, focused })

  const leftIconStylesCompose = getIconStyles(_leftIconStyles, {
    hasError,
    disabled: disabled || props?.leftIcon?.disabled,
    focused,
  })

  const rightIconStylesCompose = getIconStyles(_rightIconStyles, {
    hasError,
    disabled: disabled || props?.rightIcon?.disabled,
    focused,
  })

  const leftIconStyles = iconStylesOf(baseIconStyles, leftIconStylesCompose)
  const rightIconStyles = iconStylesOf(baseIconStyles, rightIconStylesCompose)

  const labelStyle = [
    styles.label,
    focused && styles['label:focus'],
    hasError && styles['label:error'],
    disabled && styles['label:disabled'],
  ]

  const errorStyle = [
    styles.errorMessage,
    focused && styles['errorMessage:focus'],
    hasError && styles['errorMessage:error'],
    disabled && styles['errorMessage:disabled'],
  ]

  const descriptionStyle = [
    styles.description,
    focused && styles['description:focus'],
    hasError && styles['description:error'],
    disabled && styles['description:disabled'],
  ]

  const wrapperStyle = [
    styles.wrapper,
    focused && styles['wrapper:focus'],
    error && styles['wrapper:error'],
    disabled && styles['wrapper:disabled'],
  ]

  const innerWrapperStyle = [
    // @ts-expect-error @verify
    concatStyles(styles.innerWrapper),
    focused && styles['innerWrapper:focus'],
    hasError && styles['innerWrapper:error'],
    disabled && styles['innerWrapper:disabled'],
  ]

  const labelRowStyle = [
    styles.labelRow,
    focused && styles['labelRow:focus'],
    hasError && styles['labelRow:error'],
    disabled && styles['labelRow:disabled'],
  ]

  return {
    wrapperStyle,
    innerWrapperStyle,
    leftIconStyles,
    rightIconStyles,
    labelStyle,
    errorStyle,
    descriptionStyle,
    labelRowStyle,
  }
}
