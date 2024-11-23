import { TypeGuards } from '@codeleap/common'
import { ActionIconParts } from '../ActionIcon'
import { InputBaseProps } from './types'
import { mergeStyles, useCompositionStyles } from '@codeleap/styles'
import { useMemo } from 'react'

type InputIcons = 'icon' | 'leftIcon' | 'rightIcon'

type IconParts = ActionIconParts

export type InputIconComposition = `${InputIcons}${Capitalize<IconParts>}`

export type InputBaseStates = 'error' | 'focus' | 'disabled' | 'typed'

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

const getIconStyles = (obj, state) => ({
  icon: mergeStyles([
    obj.icon,
    state.focused && obj['icon:focus'],
    state.hasError && obj['icon:error'],
    state.disabled && obj['icon:disabled'],
    state.hasValue && obj['icon:typed'],
  ]),
  'icon:disabled': mergeStyles([
    state.disabled && obj['icon:disabled'],
  ]),
  touchableWrapper: mergeStyles([
    obj.touchableWrapper,
    state.focused && obj['touchableWrapper:focus'],
    state.hasError && obj['touchableWrapper:error'],
    state.disabled && obj['touchableWrapper:disabled'],
    state.hasValue && obj['touchableWrapper:typed'],
  ]),
  'touchableWrapper:disabled': mergeStyles([
    state.disabled && obj['touchableWrapper:disabled'],
  ]),

})

const useIconStyles = (styles, iconStyles, states) => {
  return useMemo(() => {
    const _iconStyles = getIconStyles(iconStyles, states)

    return mergeStyles([styles, _iconStyles])
  }, [states, styles, iconStyles])
}

export const useInputBaseStyles = (props: InputBaseProps) => {
  const {
    focused,
    disabled,
    error,

    style: styles,
    hasValue,
  } = props

  const hasError = !TypeGuards.isNil(error)

  const compositionStyles = useCompositionStyles(['leftIcon', 'rightIcon', 'icon'], styles)

  const generalIconStyles = getIconStyles(compositionStyles?.icon, { hasError, disabled })

  const leftIconStyles = useIconStyles(generalIconStyles, compositionStyles?.leftIcon, {
    // @ts-expect-error
    hasError, disabled: (disabled || props?.leftIcon?.disabled), focused,
  })

  const rightIconStyles = useIconStyles(generalIconStyles, compositionStyles?.rightIcon, {
    // @ts-expect-error
    hasError, disabled: (disabled || props?.rightIcon?.disabled), focused, hasValue,
  })

  const labelStyle = [
    styles.label,
    focused && styles['label:focus'],
    hasError && styles['label:error'],
    disabled && styles['label:disabled'],
    hasValue && styles['label:typed'],
  ]

  const errorStyle = [
    styles.errorMessage,
    focused && styles['errorMessage:focus'],
    hasError && styles['errorMessage:error'],
    disabled && styles['errorMessage:disabled'],
    hasValue && styles['errorMessage:typed'],
  ]

  const descriptionStyle = [
    styles.description,
    focused && styles['description:focus'],
    hasError && styles['description:error'],
    disabled && styles['description:disabled'],
    hasValue && styles['description:typed'],
  ]

  const wrapperStyle = [
    styles.wrapper,
    focused && styles['wrapper:focus'],
    error && styles['wrapper:error'],
    disabled && styles['wrapper:disabled'],
    hasValue && styles['wrapper:typed'],
  ]

  const innerWrapperStyle = [
    styles.innerWrapper,
    focused && styles['innerWrapper:focus'],
    hasError && styles['innerWrapper:error'],
    disabled && styles['innerWrapper:disabled'],
    hasValue && styles['innerWrapper:typed'],
  ]

  const labelRowStyle = [
    styles.labelRow,
    focused && styles['labelRow:focus'],
    hasError && styles['labelRow:error'],
    disabled && styles['labelRow:disabled'],
    hasValue && styles['labelRow:typed'],
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
