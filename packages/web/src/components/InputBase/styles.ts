import { TypeGuards, createDefaultVariantFactory, getRenderedComponent, includePresets, useDefaultComponentStyle, useMemo, useNestedStylesByKey } from '@codeleap/common'
import { ActionIconComposition, ActionIconParts } from '../ActionIcon'
import { InputBaseProps } from './types'

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

const getIconStyles = (obj, state) => {
  return {
    icon: {
      ...obj.icon,
      ...(state.focused && obj['icon:focus']),
      ...(state.hasError && obj['icon:error']),
      ...(state.disabled && obj['icon:disabled']),
    },
    wrapper: {
      ...obj.touchableWrapper,
      ...(state.focused && obj['touchableWrapper:focus']),
      ...(state.hasError && obj['touchableWrapper:error']),
      ...(state.disabled && obj['touchableWrapper:disabled']),
    },
  }
}

export function concatStyles(unstyles: Record<number, {}>) {
  let styles = {}

  Object.values(unstyles || {}).forEach(style => {
    if (style) {
      styles = {
        ...styles,
        ...style,
      }
    }
  })

  return styles
}

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
  const _generalIconStyles = useNestedStylesByKey<ActionIconComposition>('icon', variantStyles)

  const generalIconStyles = getIconStyles(_generalIconStyles, { hasError, disabled, focused })
  const leftIconStylesCompose = getIconStyles(_leftIconStyles, { hasError, disabled, focused })
  const rightIconStylesCompose = getIconStyles(_rightIconStyles, { hasError, disabled, focused })

  const leftIconStyles = {
    icon: {
      ...generalIconStyles.icon,
      ...leftIconStylesCompose.icon,
    },
    wrapper: {
      ...generalIconStyles.wrapper,
      ...leftIconStylesCompose.wrapper,
    },
  }

  const rightIconStyles = {
    icon: {
      ...generalIconStyles.icon,
      ...rightIconStylesCompose.icon,
    },
    wrapper: {
      ...generalIconStyles.wrapper,
      ...rightIconStylesCompose.wrapper,
    },
  }

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
