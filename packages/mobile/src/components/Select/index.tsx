import { IconPlaceholder,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  TypeGuards,
  useNestedStylesByKey,
  useBooleanToggle,
  FormTypes
} from '@codeleap/common'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { SelectPresets } from './styles'
import { SelectProps } from './types'
import { ModalManager } from '../../utils'
import { Button } from  '../Button'
import { SearchHeader } from './SearchHeader'
export * from './styles'

export * from './styles'

const defaultFilterFunction = (search: string, options: FormTypes.Options<any>) => {
  return options.filter((option) => {
    if(TypeGuards.isString(option.label)){
      return option.label.toLowerCase().includes(search.toLowerCase())
    }

    return option.label === search
  })
}

export const Select = <T extends string|number = string, Multi extends boolean = false>(selectProps:SelectProps<T,Multi>) => {
  const {
    value,
    onValueChange,
    label,
    styles = {},
    options,
    style,
    variants,
    description,
    renderItem,
    listProps,
    debugName,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    clearIconName = 'close',
    clearable = false,
    selectedIcon = 'selectMarker',
    inputProps = {},
    hideInput = false,
    itemProps = {},
    searchable,
    loadOptions,
    multiple = false,
    closeOnSelect = !multiple,
    limit = null,
    defaultOptions = options,
    visible: _visible, 
    toggle: _toggle,
    ListHeaderComponent,
    onLoadOptionsError,
    filterItems = defaultFilterFunction,
    ...modalProps
  } = selectProps

  const [loading, setLoading] = useBooleanToggle(false)
  const [, setSearch] = useState('')

  const [visible, toggle] = TypeGuards.isBoolean(_visible) && !!_toggle ? [_visible, _toggle]  :   useBooleanToggle(false) 


  const [filteredOptions, setFilteredOptions] = useState(defaultOptions)

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>('u:Select', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const itemStyles = useNestedStylesByKey('item', variantStyles)

  const listStyles = useNestedStylesByKey('list', variantStyles)

  const inputStyles = useNestedStylesByKey('input', variantStyles)


  const close = () => toggle?.()
  
  const isValueArray = TypeGuards.isArray(value)

  const select = (selectedValue) => {

    if(multiple && isValueArray){
      
    
      if(value.includes(selectedValue)){
        const newValue = value.filter(v => v !== selectedValue)
        onValueChange(newValue as any)
      }else{
        
        if(TypeGuards.isNumber(limit) && value.length >= limit){
          return
        }

        const newValue = [...value, selectedValue]
        onValueChange(newValue as any)
      }

    }else{
      onValueChange(selectedValue)
      
    }

    if (closeOnSelect) {
      close?.()
    }

  }

  const selectedLabel:string = useMemo(() => {
    const current = options.find(o => o.value === value)

    const display = current?.label ?? placeholder

    return TypeGuards.isString(display) ? display : ''
  }, [value, placeholder, options])
  const Item = renderItem || Button

  const renderListItem = useCallback(({ item }) => {

    let selected = false

    if(multiple && isValueArray){
      selected = value?.includes(item.value)
    }else{
      selected = value === item.value
    }

    return <Item
      debugName={`${debugName} item ${item.value}`}
      selected={selected}
      text={item.label}
      item={item}
      onPress={() => select(item.value)}
      // @ts-ignore 
      icon={selectedIcon}
      // @ts-ignore 
      rightIcon={selectedIcon}
      styles={itemStyles}
      {...itemProps}
    />
  }, [value, select, multiple])

  const isEmpty = TypeGuards.isNil(value)
  const showClearIcon = !isEmpty && clearable

  const inputIcon = showClearIcon ? clearIconName : arrowIconName

  const onPressInputIcon = () => {
    if (showClearIcon) {
      onValueChange(null)
    } else {
      close?.()
    }

  }

  const onChangeSearch = async (searchValue:string) => {
    setSearch(searchValue)

    if(!!loadOptions) {
      try {
        setLoading(true)
  
        const _opts = await loadOptions(searchValue)

        setFilteredOptions(_opts)
        setTimeout(() => {
          setLoading(false)
        }, 0)
      }catch(e){
        console.error(`Error loading select options [${debugName}]`, e)
        onLoadOptionsError?.(e)
      }

      return

    }

    const _opts = filterItems(searchValue, options)

    setFilteredOptions(_opts)

  }


  const searchHeader = searchable ? <SearchHeader 
    debugName={debugName}
    onTypingChange={(isTyping) => {
      if(searchable && !!loadOptions){
        setLoading(isTyping)
      }
    }}
    debounce={!!loadOptions ? 200 : null}
    onSearchChange={onChangeSearch}
  /> : null

  const _ListHeaderComponent = useMemo(() => {
    if(ListHeaderComponent){
      return <ListHeaderComponent 
        searchComponent={searchHeader}
      />
    }    

    return searchHeader

  }, [searchable, ListHeaderComponent]) 

  return <>
    {
      !hideInput && (
        <TextInput
          
          value={selectedLabel}
          rightIcon={{
            icon: inputIcon as IconPlaceholder,
            onPress: onPressInputIcon,
          }}
          onPress={close}
          
          label={label}
          debugName={`${debugName} select input`}
          styles={inputStyles}
          style={style}
          innerWrapperProps={{
            rippleDisabled: true,
          }}
          {...inputProps}
        />
      )
    }

    <ModalManager.Modal
      title={label}
      description={description}
      {...modalProps}
      debugName={`${debugName} modal`} 
      styles={variantStyles}
      id={null}
      visible={visible}
      toggle={toggle}
      
      
    >
      <List<SelectProps<any>['options']>
        data={searchable ? filteredOptions : options}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        styles={listStyles}
        keyExtractor={(i) => i.value}
        renderItem={renderListItem}
        fakeEmpty={loading}
        separators
        {...listProps}
        ListHeaderComponent={_ListHeaderComponent}
        placeholder={{
          loading
        }}
      />
    </ModalManager.Modal>

  </>
}

export * from './styles'
export * from './types'
