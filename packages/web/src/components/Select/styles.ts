import { createDefaultVariantFactory, FormTypes, includePresets, useDefaultComponentStyle } from '@codeleap/common'
import { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select'
import { InputBaseParts } from '../InputBase'
import { SelectProps } from './types'

export type SelectParts =
  InputBaseParts
  | 'container'
  | 'control'
  | 'group'
  | 'groupHeading'
  | 'listWrapper'
  | 'listWrapper'
  | 'list'
  | 'listPortal'
  | 'itemWrapper'
  | 'input'
  | 'inputValue'
  | 'inputMultiValue'
  | 'inputMultiValueRemove'
  | 'inputMultiValueLabel'
  | 'inputValueWrapper'
  | 'itemWrapper:selected'
  | 'item'
  | 'loadingText'
  | 'noItems'
  | 'iconsWrapper'
  | 'clearIcon'
  | 'dropdownIcon'
  | 'loadingIcon'
  | 'separatorIcon'
  | 'placeholder'

export type SelectState = 'error' | 'focused' | 'disabled'

export type SelectComposition = SelectParts | `${SelectParts}:${SelectState}`

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

  const stylesKey = (key: SelectParts, _styles: CSSObjectWithLabel = {}) => ({
    ..._styles,
    ...variantStyles[key],
    ...(focused ? variantStyles[key + ':focused'] : {}),
    ...(disabled ? variantStyles[key + ':disabled'] : {}),
    ...(error ? variantStyles[key + ':error'] : {}),
  })

  const reactSelectStyles: StylesConfig<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>> = {
    container: (baseStyles) => stylesKey('container', baseStyles),
    control: () => stylesKey('container'),
    menuPortal: (baseStyles) => stylesKey('listPortal', baseStyles),
    menu: (baseStyles) => stylesKey('listWrapper', baseStyles),
    menuList: (baseStyles) => stylesKey('list', baseStyles),
    group: (baseStyles) => stylesKey('group', baseStyles),
    indicatorSeparator: (baseStyles) => stylesKey('separatorIcon', baseStyles),
    groupHeading: (baseStyles) => stylesKey('groupHeading', baseStyles),
    clearIndicator: () => ({
      ...stylesKey('iconIcon'),
      ...stylesKey('clearIcon'),
    }),
    dropdownIndicator: () => ({
      ...stylesKey('iconIcon'),
      ...stylesKey('dropdownIcon'),
    }),
    indicatorsContainer: (baseStyles) => stylesKey('iconsWrapper', baseStyles),
    input: (baseStyles) => stylesKey('input', baseStyles),
    loadingIndicator: (baseStyles) => stylesKey('loadingIcon', baseStyles),
    loadingMessage: (baseStyles) => stylesKey('loadingText', baseStyles),
    multiValue: (baseStyles) => stylesKey('inputMultiValue', baseStyles),
    multiValueLabel: (baseStyles) => stylesKey('inputMultiValueLabel', baseStyles),
    multiValueRemove: (baseStyles) => stylesKey('inputMultiValueRemove', baseStyles),
    noOptionsMessage: (baseStyles) => stylesKey('noItems', baseStyles),
    option: (baseStyles) => stylesKey('item', baseStyles),
    placeholder: (baseStyles) => stylesKey('placeholder', baseStyles),
    singleValue: (baseStyles) => stylesKey('inputValue', baseStyles),
    valueContainer: (baseStyles) => stylesKey('inputValueWrapper', baseStyles),
  }

  return {
    variantStyles,
    reactSelectStyles
  }
}
