import { IconPlaceholder,
  useDefaultComponentStyle,
  TypeGuards,
  useNestedStylesByKey,
  useBooleanToggle,
  FormTypes,
  onMount,
  onUpdate,
  usePrevious
} from '@codeleap/common'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { List } from '../List'
import { TextInput } from '../TextInput'
import { SelectPresets } from './styles'
import { SelectProps, ValueBoundSelectProps } from './types'
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

const OuterInput:ValueBoundSelectProps<any, boolean>['outerInputComponent'] = (props) => {
  const {
    currentValueLabel,
    debugName,
    clearIcon,
    label,
    toggle,
    styles,
    style
  } = props

  return  <TextInput
    value={TypeGuards.isString(currentValueLabel) ?  currentValueLabel : ''}
    rightIcon={clearIcon}
    onPress={() => toggle()}
    label={label}
    debugName={debugName}
    styles={styles}
    style={style}
    innerWrapperProps={{
      rippleDisabled: true,
    }}
 
  />
}

const defaultProps:Partial<SelectProps<any, boolean>> = {
  getLabel(option){

    console.log('option', option)
    if(TypeGuards.isArray(option)){

      if(option.length === 0) return null
      
      return option.map(o => o.label).join(', ')
    
    }else{
      if(!option) return null
      return option?.label
    }
  },
  outerInputComponent: OuterInput,
}



export const Select = <T extends string|number = string, Multi extends boolean = false>(selectProps:SelectProps<T,Multi>) => {
  const allProps =  {
    ...defaultProps,
    ...selectProps
  }
  const {
    value,
    onValueChange,
    label,
    styles = {},
    options = [],
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
    loadOptionsOnMount = defaultOptions.length === 0,
    loadOptionsOnOpen = false,
    filterItems = defaultFilterFunction,
    getLabel,
    searchInputProps,
    outerInputComponent,
    ...modalProps
  } = allProps

  const [loading, setLoading] = useBooleanToggle(false)
  const [, setSearch] = useState('')
  const isValueArray = TypeGuards.isArray(value) &&  multiple

  const [labelOptions,setLabelOptions] = useState<FormTypes.Options<T>>(() => {
    if( isValueArray){
      return defaultOptions.filter(o => value.includes(o.value))
    }

    const _option = defaultOptions.find(o => o.value === value)

    if(!_option){
      return []
    }

    return [_option]
  })

  
  const currentValueLabel = useMemo(() => {
    const _options = (multiple ? labelOptions : labelOptions?.[0] ) as Multi extends true  ? FormTypes.Options<T> : FormTypes.Options<T>[number]
    
    const label = getLabel(
      _options,
    ) || placeholder

    return label
  }, [labelOptions])

  const [visible, toggle] = TypeGuards.isBoolean(_visible) && !!_toggle ? [_visible, _toggle]  :   useBooleanToggle(false) 


  const [filteredOptions, setFilteredOptions] = useState(defaultOptions)

  async function load(){
    setLoading(true)
    try{
      const options = await loadOptions('')
      setFilteredOptions(options)
    }catch(e){
      onLoadOptionsError(e)
    }
    setLoading(false)
  }

  onMount(() => {
    if(loadOptionsOnMount && !!loadOptions){
      load()
    }
  })

  const prevVisible = usePrevious(visible)

  onUpdate(() => {
    if(visible && !prevVisible && loadOptionsOnOpen && !!loadOptions){
      load()
    }
  }, [visible, prevVisible])

  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>('u:Select', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const itemStyles = useNestedStylesByKey('item', variantStyles)

  const listStyles = useNestedStylesByKey('list', variantStyles)

  const inputStyles = useNestedStylesByKey('input', variantStyles)
  
  const searchInputStyles = useNestedStylesByKey('searchInput', variantStyles)

  const currentOptions = searchable ? filteredOptions : defaultOptions

  const close = () => toggle?.()
  

  const select = (selectedValue) => {

    let newValue = null

    let newOption = null
    let removedIndex = null

    if(multiple && isValueArray){
      
    
      if(value.includes(selectedValue)){
        removedIndex = value.findIndex(v => v === selectedValue)
        
        newValue = value.filter((v, i) => i !== removedIndex)
        
      }else{
        
        if(TypeGuards.isNumber(limit) && value.length >= limit){
          return
        }
        
        newOption = currentOptions.find(o => o.value === selectedValue)

        newValue = [...value, selectedValue]
      }
      
    }else{
      newValue = selectedValue
      newOption = currentOptions.find(o => o.value === selectedValue)
    }
    
    onValueChange(newValue)

    if(isValueArray){
      if(removedIndex !== null){
        const newOptions = [...labelOptions]
        newOptions.splice(removedIndex, 1)
        setLabelOptions(newOptions)
      }else{
        setLabelOptions([...labelOptions, newOption])
      }
    }else{
      setLabelOptions([newOption])
    }
    


    if (closeOnSelect) {
      close?.()
    }

  }


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
      setLoading(true)
      try {
  
        const _opts = await loadOptions(searchValue)

        setFilteredOptions(_opts)
      }catch(e){
        console.error(`Error loading select options [${debugName}]`, e)
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


  const searchHeader = searchable ? <SearchHeader 
    debugName={debugName}
    onTypingChange={(isTyping) => {
      if(searchable && !!loadOptions){
        setLoading(isTyping)
      }
    }}
    debounce={!!loadOptions ? 200 : null}
    onSearchChange={onChangeSearch}
    styles={searchInputStyles}
    {...searchInputProps}
  /> : null

  const _ListHeaderComponent = useMemo(() => {
    if(ListHeaderComponent){
      return <ListHeaderComponent 
        searchComponent={searchHeader}
      />
    }    

    return searchHeader

  }, [searchable, ListHeaderComponent]) 


  const Input = outerInputComponent


  return <>
    {
      !hideInput && (
        // @ts-ignore
        <Input
          
          clearIcon={{
            icon: inputIcon as IconPlaceholder,
            onPress: onPressInputIcon,
          }}
          onPress={close}
          currentValueLabel={currentValueLabel}
          
          debugName={`${debugName} select input`}
          styles={inputStyles}
          style={style}
          {...allProps}
          {...inputProps}
          visible={visible}
          toggle={toggle}
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


Select.defaultProps = defaultProps