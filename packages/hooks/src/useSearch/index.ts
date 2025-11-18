import { useState } from 'react'
import { useBooleanToggle } from '../useBooleanToggle'
import { useSearchParams } from './types'
import { TypeGuards } from '@codeleap/types'

/**
 * Hook that manages searchable select/autocomplete state with async loading support.
 * Handles both local filtering and remote data fetching.
 *
 * @example
 * const search = useSearch({
 *   value: 'selected-value',
 *   multiple: false,
 *   defaultOptions: [...],
 *   loadOptions: async (query) => fetchOptions(query),
 *   filterItems: (query, opts) => opts.filter(o => o.label.includes(query))
 * })
 *
 * search.onChangeSearch('query')
 * search.load()
 */
export function useSearch<T extends string|number = string, Multi extends boolean = false>(props: useSearchParams<T, Multi>) {
  const {
    value,
    multiple,
    options,
    filterItems,
    debugName,
    defaultOptions,

    loadOptions,
    onLoadOptionsError,
  } = { ...props }

  const [loading, setLoading] = useBooleanToggle(false)
  const isValueArray = TypeGuards.isArray(value) && multiple
  const [labelOptions, setLabelOptions] = useState(() => {
    if (isValueArray) {
      return defaultOptions.filter(o => value.includes(o.value))
    }

    const _option = defaultOptions.find(o => o.value === value)

    if (!_option) {
      return []
    }

    return [_option]
  })

  const [filteredOptions, setFilteredOptions] = useState(defaultOptions)
  const [, setSearchInput] = useState('')

  async function load() {
    setLoading(true)
    try {
      const options = await loadOptions('')
      setFilteredOptions(options)
    } catch (e) {
      onLoadOptionsError(e)
    }
    setLoading(false)
  }

  const onChangeSearch = async (searchValue:string) => {
    setSearchInput(searchValue)

    if (!!loadOptions) {
      setLoading(true)
      try {
        const _opts = await loadOptions(searchValue)
        setFilteredOptions(_opts)
      } catch (e) {
        console.error(`Error loading select options [${debugName}], e`)
        onLoadOptionsError?.(e)
      }
      setTimeout(() => {
        setLoading(false)
      }, 0)
      return
    }
    const _opts = filterItems(searchValue, options)
    setFilteredOptions(_opts)
  }

  return { loading, setLoading, labelOptions, setLabelOptions, filteredOptions, load, onChangeSearch }
}
