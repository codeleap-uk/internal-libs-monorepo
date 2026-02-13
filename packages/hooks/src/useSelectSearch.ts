import { Options, TypeGuards } from '@codeleap/types'
import { deepEqual } from '@codeleap/utils'
import { useCallback, useState } from 'react'

export type UseSelectSearchParams<T> = {
  options?: Options<T>
  filterFn?: (search: string, options: Options<T>) => Options<T>
  loadOptionsFn?: (search: string) => Promise<Options<T>>
  onLoadOptionsError?: (err: Error) => void
}

/**
 * Hook for managing search and filtering of selectable options. Supports both synchronous filtering and asynchronous loading.
 *
 * @example
 * const search = useSelectSearch({
 *   options: allOptions,
 *   filterFn: (term, opts) => opts.filter(o => o.label.includes(term))
 * })
 *
 * @example
 * const search = useSelectSearch({
 *   loadOptionsFn: async (term) => fetchOptions(term)
 * })
 */
export const useSelectSearch = <T>(params: UseSelectSearchParams<T>) => {
  const {
    filterFn,
    loadOptionsFn,
    onLoadOptionsError,
    options,
  } = params

  const [loading, setLoading] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)

  const onFilterOptions = useCallback((newOptions: Options<T>) => {
    setFilteredOptions(prevOptions => {
      return deepEqual(prevOptions, newOptions) ? prevOptions : newOptions
    })
  }, [])

  const onSearch = useCallback(async (search: string) => {
    if (TypeGuards.isFunction(loadOptionsFn)) {
      try {
        setLoading(true)
        const loadedOptions = await loadOptionsFn(search)
        onFilterOptions(loadedOptions)
      } catch (err) {
        onLoadOptionsError?.(err)
      } finally {
        setLoading(false)
      }
    } else if (TypeGuards.isFunction(filterFn)) {
      const newOptions = filterFn(search, options)
      onFilterOptions(newOptions)
    }
  }, [filterFn, loadOptionsFn, onLoadOptionsError, onFilterOptions, options])

  return {
    loading,
    onSearch,
    filteredOptions,
    onChangeLoading: setLoading,
    isAsync: TypeGuards.isFunction(loadOptionsFn),
    onResetFilteredOptions: () => onFilterOptions(options),
  }
}
