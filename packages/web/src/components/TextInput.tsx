import { CommonVariantObject, ComponentVariants, TextInputStyles, useComponentStyle } from '@codeleap/common';
import React, { useRef, useState } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { Text } from './Text';


/** @jsx jsx */
import { jsx } from '@emotion/react'


export type TextInputProps<V extends CommonVariantObject<any, any> = typeof TextInputStyles> = ComponentVariants<V> & {
  multiline?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: () => void;
  rows?: number;
  value?: string;
  edited?: boolean;
  type?: string;
  label?:React.ReactNode
};

export const TextInput: React.FC<TextInputProps> = (rawprops) => {
  const {
    onChange,
    type,
    value,
    onChangeText,
    disabled,
    inputRef,
    edited,
    onKeyDown,
    onFocus,
    onBlur,
    multiline,
    responsiveVariants,
    variants,
    label,
    ...props
  } = rawprops

  const [_ig, setFocus] = useState(false)
  const [editedState, setEdited] = useState(edited)

  const input = useRef(null)
  const styles =useComponentStyle('TextInput', {
    variants,
    responsiveVariants,
    rootElement: 'wrapper',
  })
  const InputElement = multiline ? TextareaAutosize : 'input'

  const handleBlur = () => {
    if (!editedState && value) setEdited(true)
    setFocus(false)

    if (onBlur) {
      onBlur()
    }
  }

  const handleFocus = () => {
    setFocus(true)
    if (onFocus) {
      onFocus()
    }
  }

  const handleChange = (event) => {
    const text = event.target.value
    if (onChange) onChange(event)
    if (onChangeText) onChangeText(text)
  }

  return (
    <div
      css={{...styles.wrapper}}
    >
      <InputLabel label={label} style={styles.label}/>

      <div css={{...styles.innerWrapper}}>

        <InputElement
          ref={inputRef || input}
          type={type || 'text'}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          onFocus={() => handleFocus()}
          onKeyDown={onKeyDown}
          onBlur={handleBlur}
          rows={4}
          {...props}
          css={{...styles.textField}}
        />
      </div>
    </div>
  )
}

export const InputLabel = ({label, style}) => {
  if (!label) return null

  switch (typeof label){
    case 'string':
      return <Text style={style} text={label} component={'label'}/>
    case 'object':
    
      return label
    default:
      return null
  }
}
