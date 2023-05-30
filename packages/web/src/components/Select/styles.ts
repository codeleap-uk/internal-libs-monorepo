import { createDefaultVariantFactory, FormTypes, includePresets, useDefaultComponentStyle } from '@codeleap/common'
import { GroupBase, StylesConfig } from 'react-select'
import { InputBaseParts } from '../InputBase'
import { SelectProps, SelectState } from './types'

export type SelectParts =
  InputBaseParts
  // | 'selectWrapper'
  // | 'wrapper'
  // | 'innerWrapper'
  // | 'inputWrapper'
  | 'label'
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
  // | 'errorText'
  | 'loadingText'
  | 'noItems'
  | 'iconsWrapper'
  | 'clearIcon'
  | 'dropdownIcon'
  | 'loadingIcon'
  | 'separatorIcon'
  | 'placeholder'

export type SelectComposition =
  | `${SelectParts}:error`
  | `${SelectParts}:disabled`
  | `${SelectParts}:focused`
  | SelectParts

const createSelectStyle = createDefaultVariantFactory<SelectComposition>()

export const SelectPresets = includePresets((styles) => createSelectStyle(() => ({ wrapper: styles })),
)



export function useSelectStyles<T, Multi extends boolean>(props: SelectProps<T, Multi>, state: SelectState){

  const {
    variants,
    styles
  }  = props

  const {
    showError
  } = state

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>(
    'u:Select',
    {
      variants,
      styles,
    },
  )


  const reactSelectStyles: StylesConfig<FormTypes.Option<T>, Multi, GroupBase<FormTypes.Option<T>>> = {
    // container: (baseStyles, state) => ({
    //   ...baseStyles,
    //   ...variantStyles.innerWrapper,
    //   ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
    //   ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
    //   ...(showError ? variantStyles['innerWrapper:error'] : {}),
    //   ...props.css,
    // }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.innerWrapper,
      ...(state.isFocused ? variantStyles['innerWrapper:focused'] : {}),
      ...(state.isDisabled ? variantStyles['innerWrapper:disabled'] : {}),
      ...(showError ? variantStyles['innerWrapper:error'] : {}),

    }),
    menuPortal: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listPortal,
      ...(showError ? variantStyles['listPortal:error'] : {}),
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.listWrapper,
      ...(showError ? variantStyles['listWrapper:error'] : {}),
    }),
    menuList: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.list,
      ...(showError ? variantStyles['list:error'] : {}),
    }),
    group: (baseStyles, state) => ({
      ...baseStyles,
      overflow: 'visible',
      ...(showError ? variantStyles['group:error'] : {}),
    }),
    indicatorSeparator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.separatorIcon,
      ...(state.isFocused ? variantStyles['separatorIcon:focused'] : {}),
      ...(state.isDisabled ? variantStyles['separatorIcon:disabled'] : {}),
      ...(showError ? variantStyles['separatorIcon:error'] : {}),
    }),
    groupHeading: (baseStyles, state) => ({
      ...baseStyles,
      ...(showError ? variantStyles['groupHeading:error'] : {}),
    }),
    clearIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.clearIcon,
      ...(state.isFocused ? variantStyles['clearIcon:focused'] : {}),
      ...(showError ? variantStyles['clearIcon:error'] : {}),
    }),
    dropdownIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.dropdownIcon,
      ...(state.isFocused ? variantStyles['dropdownIcon:focused'] : {}),
      ...(state.isDisabled ? variantStyles['dropdownIcon:disabled'] : {}),
      ...(showError ? variantStyles['dropdownIcon:error'] : {}),
    }),
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.iconsWrapper,
      ...(state.isDisabled ? variantStyles['iconsWrapper:disabled'] : {}),
      ...(showError ? variantStyles['iconsWrapper:error'] : {}),
    }),
    input: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.input,
      ...(state.isDisabled ? variantStyles['input:disabled'] : {}),
      ...(showError ? variantStyles['input:error'] : {}),
    }),
    loadingIndicator: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingIcon,
      ...(state.isFocused ? variantStyles['loadingIndicator:focused'] : {}),
      ...(state.isDisabled ? variantStyles['loadingIndicator:disabled'] : {}),
      ...(showError ? variantStyles['loadingIndicator:error'] : {}),
    }),
    loadingMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.loadingText,
      ...(showError ? variantStyles['loadingText:error'] : {}),
    }),
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValue,
      ...(state.isFocused ? variantStyles['inputMultiValue:focused'] : {}),
      ...(state.isDisabled ? variantStyles['inputMultiValue:disabled'] : {}),
      ...(showError ? variantStyles['inputMultiValue:error'] : {}),
    }),
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueLabel,
      ...(state.isFocused ? variantStyles['inputMultiValueLabel:focused'] : {}),
      ...(state.isDisabled ? variantStyles['inputMultiValueLabel:disabled'] : {}),
      ...(showError ? variantStyles['inputMultiValueLabel:error'] : {}),
    }),
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputMultiValueRemove,
    }),
    noOptionsMessage: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.noItems,
      ...(showError ? variantStyles['noItems:error'] : {}),
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.item,
      ...(state.isFocused ? variantStyles['item:focused'] : {}),
      ...(state.isDisabled ? variantStyles['item:disabled'] : {}),
      ...(showError ? variantStyles['item:error'] : {}),
    }),
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.placeholder,
      ...(state.isFocused ? variantStyles['placeholder:focused'] : {}),
      ...(state.isDisabled ? variantStyles['placeholder:disabled'] : {}),
      ...(showError ? variantStyles['placeholder:error'] : {}),
    }),
    singleValue: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValue,
      ...(state.isDisabled ? variantStyles['inputValue:disabled'] : {}),
      ...(showError ? variantStyles['inputValue:error'] : {}),
    }),
    valueContainer: (baseStyles, state) => ({
      ...baseStyles,
      ...variantStyles.inputValueWrapper,
      ...(state.isDisabled ? variantStyles['inputValueWrapper:disabled'] : {}),
      ...(showError ? variantStyles['inputValueWrapper:error'] : {}),
    }),
  }

  return {
    variantStyles,
    reactSelectStyles
  }
}