export type AutocompleteValue<T, Multi extends boolean = false> = Multi extends true ? T[] : T

type Options<T> = { label: any; value: T }[]

export type useSearchParams<T, Multi extends boolean = false> = {
  value: AutocompleteValue<T, Multi>
  multiple:Multi
  options: Options<T>
  filterItems: (search: string, items: Options<T>) => Options<T>
  debugName: string
  defaultOptions: Options<T>
  loadOptions: (search: string) => Promise<Options<T>>
  onLoadOptionsError: (error: any) => void
}
