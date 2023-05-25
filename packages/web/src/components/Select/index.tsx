
import { FormTypes, useValidate, useState, useRef, TypeGuards } from '@codeleap/common'
import _Select, {  } from 'react-select'
import Async  from 'react-select/async'
import { View } from '../View'
import { Text } from '../Text'
import {  useSelectStyles} from './styles'
import { SelectProps } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'

export * from './styles'
export * from './types'



export const Select = <T extends string|number = string, Multi extends boolean = false>(props: SelectProps<T, Multi>) => {



  const {
    inputBaseProps,
    others: selectProps,
  } = selectInputBaseProps(props)

  const {
    variants, 
    validate, 
    styles, 
    debugName,
    onValueChange, 
    options, 
    value,
    loadOptions,
    multiple,
    ...otherProps
  } = selectProps

  type Option = FormTypes.Option<T>

  const { showError, error } = useValidate(value, validate)

  const [selectedOption, setSelectedOption] = useState(value)


  const {reactSelectStyles,variantStyles} = useSelectStyles(props, {
    showError
  })

  const onLoadOptions = (inputvalue, cb) => {
    if(!loadOptions) return []
    loadOptions(inputvalue).then((options) => {
      cb(options)
    })
  }

  const handleChange = (opt: Multi extends true ? Option[] : Option)   => {
    
    if(TypeGuards.isArray(opt)){
      setSelectedOption(opt)

      // @ts-expect-error
      onValueChange?.(opt.map((o) => o.value))
    }else{
      setSelectedOption(opt)

      // @ts-expect-error
      onValueChange?.(opt.value)
    }
  }


  const SelectComponent = !!loadOptions ? Async : _Select

  const reactSelectProps = {
    ...otherProps,
    styles: reactSelectStyles,
    value: selectedOption,
    onChange: handleChange,
    loadOptions: onLoadOptions,
    isMulti: multiple,
    options,

  }


  return <InputBase 
    {...inputBaseProps}
    debugName={debugName}
    innerWrapper={SelectComponent}
    innerWrapperProps={reactSelectProps}
    styles={variantStyles}
  />
}


const x = () => {
   
}