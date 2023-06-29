import { StylesOf } from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'
import { InputBaseProps } from './types'

type OmitDiff<T1, T2> = {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
}

type InputBaseKey = keyof InputBaseProps

export function selectInputBaseProps<T extends InputBaseProps>(props: T): {
  inputBaseProps: InputBaseProps
  others: OmitDiff<T, T>
} {
  const varList:InputBaseKey[] = [
    'label',

    'error',
    'innerWrapper',
    'leftIcon',
    'rightIcon',
    // 'styles',
    'description',
    'wrapper',
    'children',
    'innerWrapperProps',
    'wrapperProps',
    'disabled',
  ]

  const copy = { ...props }

  const result = varList.reduce((acc, key) => {
    // @ts-ignore
    acc[key] = copy[key]

    return acc
  }, {} as InputBaseProps)

  return { inputBaseProps: result, others: copy as OmitDiff<T, T> }
}

type IconStyles = StylesOf<ActionIconComposition>

type IconState = {
  focused: boolean
  hasError: boolean
  disabled: boolean
}

export const getIconStyles = (obj: IconStyles, state: IconState) => ({
  icon: {
    ...obj.icon,
    ...(state.focused && obj['icon:focus']),
    ...(state.hasError && obj['icon:error']),
  },
  'icon:disabled': {
    ...(state.disabled && obj['icon:disabled']),
  },
  touchableWrapper: {
    ...obj.touchableWrapper,
    ...(state.focused && obj['touchableWrapper:focus']),
    ...(state.hasError && obj['touchableWrapper:error']),
  },
  'touchableWrapper:disabled': {
    ...(state.disabled && obj['touchableWrapper:disabled']),
  },
})

export function concatStyles(unstyles: Record<number, {}> = {}) {
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

export const iconStylesOf = (baseStyles: IconStyles, styles: IconStyles) => ({
  icon: {
    ...baseStyles.icon,
    ...styles.icon,
  },
  'icon:disabled': {
    ...baseStyles['icon:disabled'],
    ...styles['icon:disabled'],
  },
  touchableWrapper: {
    ...baseStyles.touchableWrapper,
    ...styles.touchableWrapper,
  },
  'touchableWrapper:disabled': {
    ...baseStyles['touchableWrapper:disabled'],
    ...styles['touchableWrapper:disabled'],
  }
})
