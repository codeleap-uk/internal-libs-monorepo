import { IconState, IconStyles, InputBaseKey, InputBaseProps, OmitDiff } from './types'

export function selectInputBaseProps<T extends Omit<InputBaseProps, 'style'>>(props: T): {
  inputBaseProps: InputBaseProps
  others: OmitDiff<T, T>
} {
  const varList:InputBaseKey[] = [
    'label',
    'error',
    'innerWrapper',
    'leftIcon',
    'rightIcon',
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
  },
})
