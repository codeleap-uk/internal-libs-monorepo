import { TypeGuards } from "@codeleap/common"
import { ActionIconParts } from "../ActionIcon"
import { InputBaseProps } from "./types"
import { getNestedStylesByKey, mergeStyles } from '@codeleap/styles'

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

const getIconStyles = (obj, state) => {
  return {
    icon: mergeStyles([
      obj.icon, 
      state.focused && obj['icon:focus'],
      state.hasError && obj['icon:error'], 
      state.disabled && obj['icon:disabled']
    ]),
    'icon:disabled': mergeStyles([
      state.disabled && obj['icon:disabled']
    ]),
    touchableWrapper: mergeStyles([
      obj.touchableWrapper, 
      state.focused && obj['touchableWrapper:focus'],
      state.hasError && obj['touchableWrapper:error'], 
      state.disabled && obj['touchableWrapper:disabled']
    ]),
    'touchableWrapper:disabled': mergeStyles([
      state.disabled && obj['touchableWrapper:disabled']
    ])
  }
}

export const useInputBaseStyles = (props: InputBaseProps) => {
  const {
    focused,
    disabled,
    error,
    style: styles,
  } = props

  const hasError = !TypeGuards.isNil(error)

  const _leftIconStyles = getNestedStylesByKey<any>('leftIcon', styles)
  const _rightIconStyles = getNestedStylesByKey<any>('rightIcon', styles)
  const _generalIconStyles = getNestedStylesByKey<any>('icon', styles)

  const generalIconStyles = getIconStyles(_generalIconStyles, { hasError, disabled })

  const leftIconStyles = mergeStyles([
    generalIconStyles, 
    // @ts-expect-error
    getIconStyles(_leftIconStyles, { hasError, disabled: disabled || props?.leftIcon?.disabled, focused })
  ])

  const rightIconStyles = mergeStyles([
    generalIconStyles,
    // @ts-expect-error
    getIconStyles(_rightIconStyles, { hasError, disabled: disabled || props?.rightIcon?.disabled, focused })
  ])

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
    styles.innerWrapper,
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
    labelRowStyle
 }
}