import * as React from 'react'
import { ComponentVariants,
  FormTypes,
  getNestedStylesByKey,
  IconPlaceholder,
  onUpdate,
  PropsOf,
  ReactStateProps,
  TypeGuards,
  useDebounce,
  useDefaultComponentStyle,
  useMemo,
  useState,
} from '@codeleap/common'
import { ModalHeaderProps } from '../Modal'
import { TextInput, TextInputProps } from '../TextInput'
import { View, ViewProps } from '../View'
import { CustomSelectProps, Select } from '../Select'
import { AutoCompleteStyles, AutoCompleteComposition } from './styles'
import { StylesOf } from '../../types'
import { StyleSheet } from 'react-native'
import { Text } from '../Text'
import { Button } from '../Button'

export type AutoCompleteHeaderProps = ReactStateProps<'search', string> &
  Omit<PropsOf<typeof View>, 'style'|'styles'|'variants'>
& {
    label: FormTypes.Label
    searchInputProps?: Partial<TextInputProps>
    styles: ModalHeaderProps['styles'] & { searchInput?: TextInputProps['styles']; titleWrapper?:ViewProps['style']}
    debugName: string
    icon?: IconPlaceholder
    toggle: ModalHeaderProps['toggle']
    description?: React.ReactElement
  }

export const AutoCompleteHeader:React.FC<AutoCompleteHeaderProps> = (props) => {
  const { search, setSearch, icon = 'search', description = null, debugName, label, styles, toggle, searchInputProps, ...viewProps } = props

  return <View style={[styles.wrapper]} {...viewProps}>
    <View style={styles.titleWrapper}>
      <Text style={styles.title} text={label}/>
      <Button
        icon={'close' as IconPlaceholder}
        debugName={`Close Autocomplete ${debugName} button`}
        onPress={toggle} variants={['icon']}
        styles={styles.closeButton}/>
    </View>
    {
      description
    }
    <TextInput subtitle={() => null} leftIcon={{
      icon: icon as IconPlaceholder,
    }} debugName={`AutoComplete ${debugName} search input`} value={search} onChangeText={setSearch} styles={styles.searchInput} {...searchInputProps}/>
  </View>
}

export type AutoCompleteOption<T> = CustomSelectProps<T>['options'][number] & {searchTerm?: string}

export type AutoCompleteProps<
    T,
    Base extends CustomSelectProps<T> = CustomSelectProps<T>
  > = Omit<Base, 'options'| 'variants' | 'styles'> & {
    options: AutoCompleteOption<T>[]
    caseSensitive?: boolean
    debounce?: number
    headerProps?: Partial<AutoCompleteHeaderProps>
    styles?: StylesOf<AutoCompleteComposition>
    filterFn?: (search?: string, option?:AutoCompleteOption<T>) => boolean
  } & ComponentVariants<typeof AutoCompleteStyles>

export const AutoComplete = <T extends string|number = string>(props: AutoCompleteProps<T>) => {
  const {
    options,
    caseSensitive = false,
    debounce = 200,
    filterFn,
    headerProps = {},
    variants,
    styles,
    ...selectProps
  } = props

  const [search, setSearch] = useState('')
  const [debouncedSearch, resetDebounce] = useDebounce(search, debounce)
  const [filteredOptions, setFilteredOptions] = useState(options)

  const [loading, setLoading] = useState(false)
  const variantStyles = useDefaultComponentStyle<'u:AutoComplete', typeof AutoCompleteStyles>('u:AutoComplete', {
    variants,
    transform: StyleSheet.flatten,
    styles,
  })
  const serialVariants = JSON.stringify(variantStyles)
  const { searchInputStyles, closeButtonStyles } = useMemo(() => ({
    searchInputStyles: getNestedStylesByKey('searchInput', variantStyles),
    closeButtonStyles: getNestedStylesByKey('closeButton', variantStyles),

  }), [serialVariants])

  onUpdate(() => {
    setLoading(true)
    let persist = true
    setTimeout(() => {

      const newOpts = options.filter((option) => {
        if (filterFn) {
          return filterFn(debouncedSearch, option)
        }
        const { label, searchTerm, value } = option
        let term = searchTerm || (TypeGuards.isString(label) ? label : value.toString())

        if (!caseSensitive) {
          term = term.toLowerCase()
        }

        return term.includes(debouncedSearch.toLowerCase())
      })
      if (persist) {
        setFilteredOptions(newOpts)
        setTimeout(() => {
          if (persist) {
            setLoading(false)
          }
        }, debounce * 1.5)
      }

    })
    return () => {
      persist = false
      resetDebounce()
    }
  }, [debouncedSearch, caseSensitive, options.length, filterFn])
  return <Select
    styles={variantStyles}
    options={ loading ? [] : filteredOptions}
    header={
      <AutoCompleteHeader
        debugName={selectProps.debugName}
        label={selectProps.label}
        search={search}
        setSearch={setSearch}
        toggle={selectProps.toggle}
        styles={{
          wrapper: variantStyles.header,
          closeButton: closeButtonStyles,
          title: variantStyles.title,
          searchInput: searchInputStyles,
          titleWrapper: variantStyles.titleWrapper,
        }}

        {...headerProps}
      />
    }

    {...selectProps}
    listProps={{
      ...selectProps?.listProps,
      placeholder: {
        loading,
        ...selectProps?.listProps?.placeholder,
      },
    }}
  />

}
export * from './styles'
