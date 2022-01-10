import { 
  ComponentVariants,
  IconPlaceholder,

  onUpdate,

  TextInputComposition,
  TextInputStyles,
  useComponentStyle } from '@codeleap/common';
import React, { ComponentPropsWithoutRef,  forwardRef, useImperativeHandle, useRef, useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { Text } from './Text';

import { Button } from './Button';


/** @jsx jsx */
import { jsx } from '@emotion/react'
import { StylesOf } from '../types/utility';
import { Icon } from '.';

type IconProp = {name: IconPlaceholder, action?:() => void}
type MergedRef = React.LegacyRef<HTMLInputElement> & React.Ref<HTMLTextAreaElement>
type ValidateFN = (value:string) => { result: 'error' | 'success', message?: string }
type NativeProps = ComponentPropsWithoutRef<'input'> & 
ComponentPropsWithoutRef<'textarea'> 

export type TextInputProps = 
  ComponentVariants<typeof TextInputStyles> & 
  Omit<NativeProps, 'value'> &
  {
    multiline?: boolean;
    onChangeText?: (text: string) => void;
    disabled?: boolean;
    edited?: boolean;
    type?: string;
    label?:React.ReactNode
    ref?: MergedRef
    leftIcon?:IconProp
    rightIcon?:IconProp
    styles?: StylesOf<TextInputComposition>
    validate?: ValidateFN | string
    value?:string
  };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((rawprops, inputRef) => {
  const {
    onChange,
    type,
    value,
    onChangeText,
    disabled,
    edited,
    onFocus,
    onBlur,
    multiline,
    responsiveVariants,
    variants,
    label,
    leftIcon,
    rightIcon,
    styles,
    validate,
    ...props
  } = rawprops

  const [_ig, setFocus] = useState(false)
  const [editedState, setEdited] = useState(edited)
  const [error, setError] = useState<ReturnType<ValidateFN>>({
    result: 'success',
    message: '',
  })
  const input = useRef<any>(null)

  const variantStyles =useComponentStyle('TextInput', {
    variants,
    responsiveVariants,
    styles,
  })
  const InputElement = multiline ? TextareaAutosize : 'input'

  const handleBlur:TextInputProps['onBlur'] = (e) => {
    if (!editedState && value) setEdited(true)
    setFocus(false)

    if (onBlur) {
      onBlur(e)
    }
  }

  const handleFocus:TextInputProps['onFocus'] = (e) => {
    setFocus(true)
    if (onFocus) {
      onFocus(e)
    }
  }

  const handleChange = (event) => {
    const text = event.target.value
    if (onChange) onChange(event)
    if (onChangeText) onChangeText(text)
  }
  

  const leftIconStyle = {...variantStyles.icon, ...variantStyles.leftIcon }
  
  const rightIconStyle = {...variantStyles.icon, ...variantStyles.rightIcon }
  
  onUpdate(() => {

    if (validate){
      const result:ReturnType<ValidateFN> = typeof validate === 'function' ? 
        validate(input?.current?.value) : 
        {message: validate, result: 'error'}

      setError(result)
    }
  }, [value, validate])

  useImperativeHandle(inputRef, () => input.current)
  return (
    <div
      css={{...variantStyles.wrapper}}
    >
      <InputLabel label={label} style={variantStyles.label}/>

      <div css={{...variantStyles.innerWrapper}}>
  
        <InputIcon {...leftIcon} style={leftIconStyle}/>
        <InputElement
          ref={input}
          type={type || 'text'}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={4}
          {...props}
          css={variantStyles.textField}
        />
        <InputIcon {...rightIcon} style={rightIconStyle}/>
      </div>
      {
        error.result === 'error' && error.message  ?  <Text text={error.message} variants={['p2', 'marginTop:1']} css={variantStyles.error}/> : null
      }
    </div>
  )
})
export const InputIcon:React.FC<{style:any} & IconProp> = ({name, style, action}) => {
  if (!name) return null

  if (action){
  
    return <Button icon={name} onPress={() => action()}  styles={{
      icon: style,
    }} variants={['icon']}/>
  }

  return <Icon name={name} style={style}/>
}
export const InputLabel = ({label, style}) => {
  if (!label) return null

  switch (typeof label){
    case 'string':
      return <Text css={style} text={label} component={'label'}/>
    case 'object':
    
      return label
    default:
      return null
  }
}
