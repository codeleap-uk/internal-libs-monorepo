import { Option, Options, TypeGuards } from '@codeleap/types'

export const defaultFilterFunction = <T>(search: string, options: Options<T>) => {
  if (options?.length <= 0 || !options) return options

  const filteredOptions = options.filter((option) => {
    if (TypeGuards.isString(option?.label)) {
      return option?.label?.toLowerCase().includes(search?.toLowerCase())
    }

    return option?.label === search
  })

  return filteredOptions
}

export const defaultGetLabel = <T>(optionsOrOptions: Option<T> | Options<T>): string => {
  if (TypeGuards.isArray(optionsOrOptions)) {
    if (optionsOrOptions?.length === 0 || !optionsOrOptions) return ''

    const labels = optionsOrOptions?.map(option => option?.label)?.filter(Boolean)

    return labels?.join(', ')
  } else {
    if (!optionsOrOptions) return ''

    return optionsOrOptions?.label ?? ''
  }
}
