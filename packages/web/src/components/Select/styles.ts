import { createDefaultVariantFactory, FormTypes, includePresets, useDefaultComponentStyle } from '@codeleap/common'
import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import { InputBaseParts } from '../InputBase'
import { SelectProps } from './types'

export type SelectParts =
  InputBaseParts
  | 'container'
  | 'groupHeading'
  | 'listWrapper'
  | 'list'
  | 'listPortal'
  | 'itemWrapper'
  | 'input'
  | 'inputValue'
  | 'inputMultiValue'
  | 'inputValueWrapper'
  | 'item'
  | 'itemIcon'
  | 'itemText'
  | 'clearIcon'
  | 'dropdownIcon'
  | 'placeholder'

export type SelectUnStateParts =  
  'item:selected' 
  | 'itemText:selected' 
  | 'itemWrapper:selected'
  | 'menuPlaceholder'
  | 'menuPlaceholderIcon'
  | 'menuPlaceholderText'
  | 'menuPlaceholderNoItems'
  | 'menuPlaceholderNoItemsIcon'
  | 'menuPlaceholderNoItemsText'
  | 'menuWrapper' 
  | 'loadingIndicator'

export type SelectState = 'error' | 'focused' | 'disabled'

export type SelectComposition = SelectParts | `${SelectParts}:${SelectState}` | SelectUnStateParts

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })))

export type ComponentState = {
  error?: boolean
  focused?: boolean
  disabled?: boolean
}

export function useSelectStyles<T, Multi extends boolean>(props: SelectProps<T, Multi>, state: ComponentState) {
  const {
    variants,
    styles
  }  = props

  const {
    error,
    focused,
    disabled,
  } = state

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>(
    'u:Select',
    {
      variants,
      styles,
    },
  )

  const stylesKey = (key: SelectParts | SelectUnStateParts, _styles: CSSObjectWithLabel = {}) => ({
    ..._styles,
    ...variantStyles[key],
    ...(focused ? variantStyles[key + ':focused'] : {}),
    ...(disabled ? variantStyles[key + ':disabled'] : {}),
    ...(error ? variantStyles[key + ':error'] : {}),
  })

  const optionsStyles = (state: { isSelected: boolean }) => ({
    item: {
      ...stylesKey('item'),
      ...(state?.isSelected ? variantStyles['item:selected'] : {}),
    },
    icon: stylesKey('itemIcon'),
    text: {
      ...stylesKey('itemText'),
      ...(state?.isSelected ? variantStyles['itemText:selected'] : {}),
    },
  })

  const placeholderStyles = {
    ['empty']: {
      wrapper: stylesKey('menuPlaceholder'),
      icon: stylesKey('menuPlaceholderIcon'),
      text: stylesKey('menuPlaceholderText'),
    },
    ['noItems']: {
      wrapper: stylesKey('menuPlaceholderNoItems'),
      icon: stylesKey('menuPlaceholderNoItemsIcon'),
      text: stylesKey('menuPlaceholderNoItemsText'),
    },
  }

  const loadingStyles = {
    wrapper: stylesKey('loadingIndicator'),
  }

  const inputMultiValueStyles = {
    text: stylesKey('inputMultiValue')
  }

  const menuWrapperStyles = {
    wrapper: stylesKey('menuWrapper')
  }

  const reactSelectStyles: StylesConfig<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>> = {
    container: (baseStyles) => stylesKey('container', baseStyles),
    control: () => stylesKey('container'),
    menuPortal: (baseStyles) => stylesKey('listPortal', baseStyles),
    menu: (baseStyles) => stylesKey('listWrapper', baseStyles),
    menuList: (baseStyles) => stylesKey('list', baseStyles),
    group: () => ({}),
    indicatorSeparator: () => ({}),
    groupHeading: (baseStyles) => stylesKey('groupHeading', baseStyles),
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
    singleValue: (baseStyles) => stylesKey('inputValue', baseStyles),
    valueContainer: (baseStyles) => stylesKey('inputValueWrapper', baseStyles),
  }

  return {
    variantStyles,
    reactSelectStyles,
    optionsStyles,
    placeholderStyles,
    loadingStyles,
    inputMultiValueStyles,
    menuWrapperStyles,
  }
}
