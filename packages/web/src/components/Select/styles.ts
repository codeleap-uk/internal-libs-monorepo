import { createDefaultVariantFactory, FormTypes, includePresets, useDefaultComponentStyle } from '@codeleap/common'
import { GroupBase, StylesConfig } from 'react-select'
import { InputBaseParts } from '../InputBase'
import { SelectProps } from './types'

export type SelectParts =
  InputBaseParts
  | 'container'
  | 'control'
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

  const reactSelectStyles: StylesConfig<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>> = {
    container: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.container,
      ...(focused ? variantStyles['container:focused'] : {}),
      ...(disabled ? variantStyles['container:disabled'] : {}),
      ...(error ? variantStyles['container:error'] : {}),
    }),
    control: (baseStyles, state) => ({
      ...variantStyles.container,
      ...(focused ? variantStyles['control:focused'] : {}),
      ...(disabled ? variantStyles['control:disabled'] : {}),
      ...(error ? variantStyles['control:error'] : {}),
    }),
    menuPortal: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listPortal,
      ...(error ? variantStyles['listPortal:error'] : {}),
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listWrapper,
      ...(error ? variantStyles['listWrapper:error'] : {}),
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.list,
      ...(error ? variantStyles['list:error'] : {}),
    }),
    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      ...(error ? variantStyles['group:error'] : {}),
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.separatorIcon,
      ...(focused ? variantStyles['separatorIcon:focused'] : {}),
      ...(disabled ? variantStyles['separatorIcon:disabled'] : {}),
      ...(error ? variantStyles['separatorIcon:error'] : {}),
    }),
    groupHeading: (baseStyles, state) => ({
      ...baseStyles,
      ...(error ? variantStyles['groupHeading:error'] : {}),
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.clearIcon,
      ...(focused ? variantStyles['clearIcon:focused'] : {}),
      ...(error ? variantStyles['clearIcon:error'] : {}),
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.dropdownIcon,
      ...(focused ? variantStyles['dropdownIcon:focused'] : {}),
      ...(disabled ? variantStyles['dropdownIcon:disabled'] : {}),
      ...(error ? variantStyles['dropdownIcon:error'] : {}),
    }),
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.iconsWrapper,
      ...(disabled ? variantStyles['iconsWrapper:disabled'] : {}),
      ...(error ? variantStyles['iconsWrapper:error'] : {}),
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.input,
      ...(disabled ? variantStyles['input:disabled'] : {}),
      ...(error ? variantStyles['input:error'] : {}),
    }),
    loadingIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingIcon,
      ...(focused ? variantStyles['loadingIndicator:focused'] : {}),
      ...(disabled ? variantStyles['loadingIndicator:disabled'] : {}),
      ...(error ? variantStyles['loadingIndicator:error'] : {}),
    }),
    loadingMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingText,
      ...(error ? variantStyles['loadingText:error'] : {}),
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValue,
      ...(focused ? variantStyles['inputMultiValue:focused'] : {}),
      ...(disabled ? variantStyles['inputMultiValue:disabled'] : {}),
      ...(error ? variantStyles['inputMultiValue:error'] : {}),
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueLabel,
      ...(focused ? variantStyles['inputMultiValueLabel:focused'] : {}),
      ...(disabled ? variantStyles['inputMultiValueLabel:disabled'] : {}),
      ...(error ? variantStyles['inputMultiValueLabel:error'] : {}),
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueRemove,
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.noItems,
      ...(error ? variantStyles['noItems:error'] : {}),
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.item,
      ...(focused ? variantStyles['item:focused'] : {}),
      ...(disabled ? variantStyles['item:disabled'] : {}),
      ...(error ? variantStyles['item:error'] : {}),
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.placeholder,
      ...(focused ? variantStyles['placeholder:focused'] : {}),
      ...(disabled ? variantStyles['placeholder:disabled'] : {}),
      ...(error ? variantStyles['placeholder:error'] : {}),
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValue,
      ...(disabled ? variantStyles['inputValue:disabled'] : {}),
      ...(error ? variantStyles['inputValue:error'] : {}),
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValueWrapper,
      ...(disabled ? variantStyles['inputValueWrapper:disabled'] : {}),
      ...(error ? variantStyles['inputValueWrapper:error'] : {}),
    }),
  }

  return {
    variantStyles,
    reactSelectStyles
  }
}
