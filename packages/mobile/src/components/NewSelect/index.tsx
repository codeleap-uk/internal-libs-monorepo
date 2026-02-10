import { SelectInput } from './components/Input'
import { Modal } from '../Modal'
import { useCallback, useConditionalState } from '@codeleap/hooks'
import { useSelectSearch } from './hooks/useSelectSearch'
import { SearchInput } from '../SearchInput'
import { defaultFilterFunction, defaultGetLabel } from './defaults'
import { SelectList } from './components/SelectList'
import { fields, SelectableField } from '@codeleap/form'
import { useInputBase } from '../InputBase'
import { SelectBaseProps, SelectProps } from './types'
import { ComponentType } from 'react'
import { List } from '../List'
import { AppIcon } from '@codeleap/styles'

export const NewSelect = <T extends string | number, C extends ComponentType<any> = typeof List>(props: SelectProps<T, C>) => {
  const {
    options: providedOptions,
    value,
    onValueChange,
    searchable,
    multiple,
    limit,
    getLabelFn,
    filterFn,
    loadOptionsFn,
    onLoadOptionsError,
    onSelect,
    field,
    ListComponent,
    visible: providedVisible,
    toggle: providedToggle,
    disabled,
    placeholder,
    modalProps,
    inputProps,
    searchInputProps,
    listProps,
    hideInput,
    closeOnSelect,
    selectIcon,
    clearIcon,
    clearable,
    renderItem,
  } = {
    ...NewSelect.defaultProps,
    ...props,
  }

  const {
    inputValue,
    onInputValueChange,
  } = useInputBase(
    field,
    fields.selectable as () => SelectableField<T, any>,
    { value, onValueChange },
  )

  const [visible, toggle] = useConditionalState(
    providedVisible,
    providedToggle,
    { isBooleanToggle: true, initialValue: false },
  )

  const selectSearch = useSelectSearch({
    options: providedOptions,
    filterFn,
    loadOptionsFn,
    onLoadOptionsError,
  })

  const options = searchable ? selectSearch.filteredOptions : providedOptions

  const onSelectOption: SelectProps<T, C>['onSelect'] = useCallback((option) => {
    if (closeOnSelect) toggle(false)
    onSelect?.(option)
  }, [closeOnSelect, onSelect])

  const ListHeader = useCallback(() => {
    if (!searchable) return null

    return <SearchInput
      debugName={'select:search'}
      debounce={selectSearch.isAsync ? 800 : null}
      onSearchChange={selectSearch.onSearch}
      placeholder='Search'
      onTypingChange={(isTyping) => {
        if (selectSearch?.isAsync) {
          selectSearch.onChangeLoading(isTyping)
        }
      }}
      {...searchInputProps}
    />
  }, [searchInputProps])

  return <>
    {hideInput ? null : (
      <SelectInput
        options={options}
        value={inputValue}
        onValueChange={onInputValueChange}
        toggle={toggle}
        getLabelFn={getLabelFn}
        disabled={disabled}
        placeholder={placeholder}
        multiple={multiple}
        clearIcon={clearIcon}
        selectIcon={selectIcon}
        clearable={clearable}
        {...inputProps}
      />
    )}

    <Modal {...modalProps} visible={visible} toggle={toggle}>
      <SelectList
        options={options}
        value={inputValue}
        onValueChange={onInputValueChange}
        fakeEmpty={selectSearch.loading}
        placeholder={{ loading: selectSearch?.loading }}
        ListHeaderComponent={ListHeader}
        limit={limit}
        multiple={multiple}
        Component={ListComponent}
        onSelect={onSelectOption}
        renderItem={renderItem}
        {...listProps}
      />
    </Modal>
  </>
}

NewSelect.defaultProps = {
  filterFn: defaultFilterFunction,
  getLabelFn: defaultGetLabel,
  searchable: true,
  multiple: false,
  ListComponent: List,
  placeholder: 'Select',
  selectIcon: 'chevrons-up-down' as AppIcon,
  clearIcon: 'x' as AppIcon,
  selectedIcon: 'check' as AppIcon,
} as Partial<SelectBaseProps<any, any, any>>
