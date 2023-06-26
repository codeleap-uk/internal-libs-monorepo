import { TypeGuards, createDefaultVariantFactory, includePresets, useDefaultComponentStyle, useNestedStylesByKey } from '@codeleap/common'
import { ActionIconComposition, ActionIconParts } from '../ActionIcon'
import { InputBaseProps } from './types'
import { concatStyles, getIconStyles, iconStylesOf } from './utils'

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

const createTextInputBaseComposition = createDefaultVariantFactory<InputBaseComposition>()

export const InputBasePresets = includePresets((styles) => createTextInputBaseComposition(() => ({ wrapper: styles })))

export const useInputBaseStyles = (props: InputBaseProps) => {
  const {
    focused,
    disabled,
    error,
    styles,
  } = props

  const hasError = !TypeGuards.isNil(error)

  const variantStyles = useDefaultComponentStyle<'u:InputBase', typeof InputBasePresets>('u:InputBase', {
    rootElement: 'wrapper',
    styles,
  })

  const _leftIconStyles = useNestedStylesByKey<ActionIconComposition>('leftIcon', variantStyles)
  const _rightIconStyles = useNestedStylesByKey<ActionIconComposition>('rightIcon', variantStyles)
  const _baseIconStyles = useNestedStylesByKey<ActionIconComposition>('icon', variantStyles)

  const baseIconStyles = getIconStyles(_baseIconStyles, { hasError, disabled, focused })

  const leftIconStylesCompose = getIconStyles(_leftIconStyles, { 
    hasError, 
    disabled: disabled || props?.leftIcon?.disabled, 
    focused 
  })

  const rightIconStylesCompose = getIconStyles(_rightIconStyles, { 
    hasError, 
    disabled: disabled || props?.rightIcon?.disabled,
    focused 
  })

  const leftIconStyles = iconStylesOf(baseIconStyles, leftIconStylesCompose)
  const rightIconStyles = iconStylesOf(baseIconStyles, rightIconStylesCompose)

  const labelStyle = [
    variantStyles.label,
    focused && variantStyles['label:focus'],
    hasError && variantStyles['label:error'],
    disabled && variantStyles['label:disabled'],
  ]

  const errorStyle = [
    variantStyles.errorMessage,
    focused && variantStyles['errorMessage:focus'],
    hasError && variantStyles['errorMessage:error'],
    disabled && variantStyles['errorMessage:disabled'],
  ]

  const descriptionStyle = [
    variantStyles.description,
    focused && variantStyles['description:focus'],
    hasError && variantStyles['description:error'],
    disabled && variantStyles['description:disabled'],
  ]

  const wrapperStyle = [
    variantStyles.wrapper,
    focused && variantStyles['wrapper:focus'],
    error && variantStyles['wrapper:error'],
    disabled && variantStyles['wrapper:disabled'],
  ]

  const innerWrapperStyle = [
    concatStyles(variantStyles.innerWrapper),
    focused && variantStyles['innerWrapper:focus'],
    hasError && variantStyles['innerWrapper:error'],
    disabled && variantStyles['innerWrapper:disabled'],
  ]

  const labelRowStyle = [
    variantStyles.labelRow,
    focused && variantStyles['labelRow:focus'],
    hasError && variantStyles['labelRow:error'],
    disabled && variantStyles['labelRow:disabled'],
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
