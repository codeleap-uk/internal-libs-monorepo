import { createDefaultVariantFactory, FormTypes, includePresets, useDefaultComponentStyle } from '@codeleap/common'
import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import { InputBaseParts } from '../InputBase'
import { SelectProps } from './types'

export type SelectParts =
  InputBaseParts
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
  | 'item'
  | 'itemIcon'
  | 'itemText'
  | 'clearIcon'
  | 'dropdownIcon'

export type SelectUnStateParts =  
  'item:selected' 
  | 'itemText:selected'
  | 'itemIcon:selected' 
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
    ...(focused ? variantStyles[key + ':focus'] : {}),
    ...(disabled ? variantStyles[key + ':disabled'] : {}),
    ...(error ? variantStyles[key + ':error'] : {}),
  })

  const optionsStyles = (state: { isSelected: boolean }) => ({
    item: {
      ...stylesKey('item'),
      ...(state?.isSelected ? variantStyles['item:selected'] : {}),
    },
    icon: {
      ...stylesKey('itemIcon'),
      ...(state?.isSelected ? variantStyles['itemIcon:selected'] : {}),
    },
    text: {
      ...stylesKey('itemText'),
      ...(state?.isSelected ? variantStyles['itemText:selected'] : {}),
    },
  })

  const placeholderStyles = {
    ['empty']: {
      wrapper: stylesKey('listPlaceholder'),
      icon: stylesKey('listPlaceholderIcon'),
      text: stylesKey('listPlaceholderText'),
    },
    ['noItems']: {
      wrapper: stylesKey('listPlaceholderNoItems'),
      icon: stylesKey('listPlaceholderNoItemsIcon'),
      text: stylesKey('listPlaceholderNoItemsText'),
    },
  }

  const loadingStyles = {
    wrapper: stylesKey('loadingIndicator'),
  }

  const inputMultiValueStyles = {
    text: stylesKey('valueMultiple')
  }

  const menuWrapperStyles = {
    wrapper: stylesKey('itemsWrapper')
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
    variantStyles,
    reactSelectStyles,
    optionsStyles,
    placeholderStyles,
    loadingStyles,
    inputMultiValueStyles,
    menuWrapperStyles,
  }
}
