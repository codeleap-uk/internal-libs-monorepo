import { AnyFunction, IconPlaceholder } from '@codeleap/common'
import { TextInputProps } from '../TextInput'

export type SearchInputProps = {
    placeholder: string
    clearable?: boolean
    debugName: string
    clearIcon?: IconPlaceholder
    searchIcon?: IconPlaceholder
    debounce?: number
    onSearchChange: (search: string) => void
    onTypingChange?: (isTyping: boolean) => void
    onValueChange?: (search: string) => void
    onClear?: AnyFunction
    defaultValue?: string
} & Partial<TextInputProps>
