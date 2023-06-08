import { FormTypes } from '..'

export type AutocompleteValue<T, Multi extends boolean = false> = Multi extends true ? T[] : T

export type useSearchParams<T, Multi extends boolean = false> = {
  value: AutocompleteValue<T, Multi>
  multiple:Multi
  options: FormTypes.Options<T>
  filterItems: (search: string, items: FormTypes.Options<T>) => FormTypes.Options<T>
  debugName: string
  defaultOptions: FormTypes.Options<T>
  visible: boolean
  toggle: () => void
  loadOptions: (search: string) => Promise<FormTypes.Options<T>>
  onLoadOptionsError: (error: any) => void
}
