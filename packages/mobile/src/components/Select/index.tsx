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
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

export const Select = <T extends string | number, C extends ComponentType<any> = typeof List>(props: SelectProps<T, C>) => {
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
    label,
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
    style,
    SelectInputComponent,
  } = {
    ...Select.defaultProps,
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

  const styles = useStylesFor(Select.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['item', 'list', 'input', 'searchInput'], styles)

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
      style={compositionStyles?.searchInput}
    />
  }, [searchInputProps])

  return <>
    {hideInput ? null : (
      <SelectInputComponent
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
        label={label}
        {...inputProps}
        style={compositionStyles?.input}
      />
    )}

    <Modal {...modalProps} visible={visible} toggle={toggle} style={styles}>
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
        itemStyle={compositionStyles?.item}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        {...listProps}
        style={compositionStyles?.list}
      />
    </Modal>
  </>
}

Select.styleRegistryName = 'Select'
Select.elements = ['input', 'list', 'item', 'searchInput']
Select.rootElement = 'inputWrapper'

Select.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Select as (<T extends string | number = string, C extends ComponentType<any> = typeof List>(props: StyledComponentProps<SelectProps<T, C>, typeof styles>) => IJSX)
}

Select.defaultProps = {
  filterFn: defaultFilterFunction,
  getLabelFn: defaultGetLabel,
  searchable: true,
  multiple: false,
  ListComponent: List,
  placeholder: 'Select',
  selectIcon: 'chevrons-up-down' as AppIcon,
  clearIcon: 'x' as AppIcon,
  selectedIcon: 'check' as AppIcon,
  SelectInputComponent: SelectInput,
} as Partial<SelectBaseProps<any, any, any>>

MobileStyleRegistry.registerComponent(Select)
