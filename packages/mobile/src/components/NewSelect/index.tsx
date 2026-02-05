import { SelectInput } from './components/Input'
import { Modal } from '../Modal'
import { useBooleanToggle, useCallback } from '@codeleap/hooks'
import { useSelectSearch } from './hooks/useSelectSearch'
import { SearchInput } from '../SearchInput'
import { defaultFilterFunction, defaultGetLabel } from './defaults'
import { SelectList } from './components/SelectList'
import { fields, SelectableField } from '@codeleap/form'
import { useInputBase } from '../InputBase'
import { SelectBaseProps, SelectProps } from './types'

export const NewSelect = <T extends string | number>(props: SelectProps<T>) => {
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
    field,
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

  const [visible, toggle] = useBooleanToggle(false)

  const selectSearch = useSelectSearch({
    options: providedOptions,
    filterFn,
    loadOptionsFn,
    onLoadOptionsError,
  })

  const options = searchable ? selectSearch.filteredOptions : providedOptions

  const ListHeader = useCallback(() => {
    if (!searchable) return null

    return <SearchInput
      debugName={''}
      debounce={selectSearch.isAsync ? 800 : null}
      onSearchChange={selectSearch.onSearch}
      placeholder='Search'
      onTypingChange={(isTyping) => {
        if (selectSearch?.isAsync) {
          selectSearch.onChangeLoading(isTyping)
        }
      }}
    />
  }, [])

  return <>
    <SelectInput
      options={options}
      value={inputValue}
      onPress={() => toggle()}
      getLabelFn={getLabelFn}
    />

    <Modal visible={visible} toggle={toggle}>
      <SelectList
        options={options}
        value={inputValue}
        onValueChange={onInputValueChange}
        fakeEmpty={selectSearch.loading}
        placeholder={{ loading: selectSearch?.loading }}
        ListHeaderComponent={ListHeader}
        limit={limit}
        multiple={multiple}
      />
    </Modal>
  </>
}

NewSelect.defaultProps = {
  filterFn: defaultFilterFunction,
  getLabelFn: defaultGetLabel,
  searchable: true,
  multiple: false,
} as Partial<SelectBaseProps<any, any>>
