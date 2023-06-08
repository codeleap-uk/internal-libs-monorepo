import { useState } from 'react'
import { FormTypes } from '..'
import { TypeGuards, useBooleanToggle } from '../..'
import { useSearchParams } from './types'

export function useSearch<T extends string|number = string, Multi extends boolean = false>(props: useSearchParams<T, Multi>) {
  const {
    value,
    multiple,
    options,
    filterItems,
    debugName,
    defaultOptions,
    visible: _visible,
    toggle: _toggle,
    loadOptions,
    onLoadOptionsError,
  } = { ...props }

  const [loading, setLoading] = useBooleanToggle(false)
  const isValueArray = TypeGuards.isArray(value) && multiple
  const [labelOptions, setLabelOptions] = useState<FormTypes.Options<T>>(() => {
    if (isValueArray) {
      return defaultOptions.filter(o => value.includes(o.value))
    }

    const _option = defaultOptions.find(o => o.value === value)

    if (!_option) {
      return []
    }

    return [_option]
  })

  const [visible, toggle] = TypeGuards.isBoolean(_visible) && !!_toggle ? [_visible, _toggle] : useBooleanToggle(false)
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

  return { loading, setLoading, labelOptions, setLabelOptions, visible, toggle, filteredOptions, load, onChangeSearch }
}
