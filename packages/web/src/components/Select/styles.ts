import { capitalize, FormTypes } from '@codeleap/common'
import { useNestedStylesByKey } from '@codeleap/styles'
import { CSSInterpolation } from '@emotion/css'
import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import { ButtonParts as _ButtonParts } from '../Button'
import { InputBaseParts } from '../InputBase'
import { SelectProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

type ButtonParts = _ButtonParts

export type ItemParts = `item${Capitalize<ButtonParts>}`

export type SelectParts =
  InputBaseParts
  | ItemParts
  | 'listPortal'
  | 'listHeader'
  | 'listWrapper'
  | 'list'
  | 'inputContainer'
  | 'input'
  | 'placeholder'
  | 'value'
  | 'valueMultiple'
  | 'valueWrapper'
  | 'clearIcon'
  | 'dropdownIcon'

type ItemState = 'focused' | 'selected' | 'selectedFocused'

export type SelectStatefulParts =
  `${ItemParts}:${ItemState}`
  | 'listPlaceholder'
  | 'listPlaceholderIcon'
  | 'listPlaceholderText'
  | 'listPlaceholderNoItems'
  | 'listPlaceholderNoItemsIcon'
  | 'listPlaceholderNoItemsText'
  | 'itemsWrapper'
  | 'loadingIndicator'
  | 'innerWrapper:searchable'

export type SelectState = 'error' | 'focus' | 'disabled'

export type SelectComposition = SelectParts | `${SelectParts}:${SelectState}` | SelectStatefulParts

export type ComponentState = {
  error?: boolean
  focused?: boolean
  disabled?: boolean
}

export type OptionState = {
  isSelected: boolean
  isFocused: boolean
  baseStyles: SelectProps['itemProps']['style']
}

export function useSelectStyles<T, Multi extends boolean>(props: SelectProps<T, Multi>, state: ComponentState) {

  const {
    style,
  } = props

  const {
    error,
    focused,
    disabled,
  } = state

  const styles = useStylesFor(props?.styleRegistryName, style)

  const stylesKey = (key: SelectParts | SelectStatefulParts, _styles: CSSObjectWithLabel = {}) => ({
    ..._styles,
    ...styles[key],
    ...(focused ? styles[key + ':focus'] : {}),
    ...(disabled ? styles[key + ':disabled'] : {}),
    ...(error ? styles[key + ':error'] : {}),
  })

  const optionNestedStyles = useNestedStylesByKey('item', styles)

  const optionStyleKey = (
    key: ButtonParts | `${ButtonParts}:${ItemState}`,
    state: OptionState,
  ) => {
    return {
      ...stylesKey(`item${capitalize(key)}` as any),
      ...(state?.isSelected ? optionNestedStyles[`${key}:selected`] : {}),
      ...(state?.isFocused ? optionNestedStyles[`${key}:focused`] : {}),
      ...(state?.isFocused && state?.isSelected ? optionNestedStyles[`${key}:selectedFocused`] : {}),
      ...(state.baseStyles?.[key] as React.CSSProperties),
    }
  }

  const optionsStyles = (state: OptionState): Record<ButtonParts, CSSInterpolation> => ({
    wrapper: optionStyleKey('wrapper', state),
    rightIcon: optionStyleKey('rightIcon', state),
    text: optionStyleKey('text', state),
    leftIcon: optionStyleKey('leftIcon', state),
    icon: optionStyleKey('icon', state),
    loaderWrapper: optionStyleKey('loaderWrapper', state),
  })

  const placeholderStyles = {
    empty: {
      wrapper: stylesKey('listPlaceholder'),
      icon: stylesKey('listPlaceholderIcon'),
      text: stylesKey('listPlaceholderText'),
    },
    noItems: {
      wrapper: stylesKey('listPlaceholderNoItems'),
      icon: stylesKey('listPlaceholderNoItemsIcon'),
      text: stylesKey('listPlaceholderNoItemsText'),
    },
  }

  const loadingStyles = {
    wrapper: stylesKey('loadingIndicator'),
  }

  const inputMultiValueStyles = {
    text: stylesKey('valueMultiple'),
  }

  const menuWrapperStyles = {
    wrapper: stylesKey('itemsWrapper'),
  }

  const reactSelectStyles: StylesConfig<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>> = {
    container: (baseStyles) => stylesKey('inputContainer', baseStyles),
    control: () => stylesKey('inputContainer'),
    menuPortal: (baseStyles) => stylesKey('listPortal', baseStyles),
    menu: (baseStyles) => stylesKey('listWrapper', baseStyles),
    menuList: (baseStyles) => stylesKey('list', baseStyles),
    group: () => ({}),
    indicatorSeparator: () => ({}),
    groupHeading: (baseStyles) => stylesKey('listHeader', baseStyles),
    clearIndicator: () => ({
      ...stylesKey('iconIcon'),
      ...stylesKey('clearIcon'),
    }),
    dropdownIndicator: () => ({
      ...stylesKey('iconIcon'),
      ...stylesKey('dropdownIcon'),
    }),
    indicatorsContainer: (baseStyles) => baseStyles,
    input: (baseStyles) => stylesKey('input', baseStyles),
    loadingIndicator: () => ({}),
    loadingMessage: () => ({}),
    multiValue: () => ({}),
    multiValueLabel: () => ({}),
    noOptionsMessage: () => ({}),
    option: () => ({}),
    placeholder: () => stylesKey('placeholder'),
    singleValue: (baseStyles) => stylesKey('value', baseStyles),
    valueContainer: (baseStyles) => stylesKey('valueWrapper', baseStyles),
  }

  return {
    styles,
    reactSelectStyles,
    optionsStyles,
    placeholderStyles,
    loadingStyles,
    inputMultiValueStyles,
    menuWrapperStyles,
  }
}
