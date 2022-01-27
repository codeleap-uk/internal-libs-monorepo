import * as React from 'react'
import { 
    ComponentVariants,
    FormTypes,
    IconPlaceholder,
  
    onUpdate,
  
    TextInputComposition,
    TextInputStyles,
    useBooleanToggle,
    useComponentStyle } from '@codeleap/common';
  import { ComponentPropsWithoutRef,  forwardRef, useImperativeHandle, useRef, useState } from 'react'
  import { Text } from './Text';
  import { View  } from './View';
  import { Button } from './Button';
  import { StylesOf } from '../types/utility';
  import { Icon } from '.';
  import {NativeSyntheticEvent, TextInput as NativeTextInput, TextInputChangeEventData} from 'react-native'
  import { useLogStyles } from '../utils/styles';
  type IconProp = {name: IconPlaceholder, action?:() => void}

  type NativeProps = ComponentPropsWithoutRef<typeof NativeTextInput>
  
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
      
      leftIcon?:IconProp
      rightIcon?:IconProp
      styles?: StylesOf<TextInputComposition>
      validate?: FormTypes.ValidatorFunction | string
      value?:string
      password?:boolean
      visibilityToggle?: boolean
    };
  
  export const TextInput = forwardRef<NativeTextInput, TextInputProps>((rawprops, inputRef) => {
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
      password,
      visibilityToggle,
      ...props
    } = rawprops
  
    const [_ig, setFocus] = useState(false)
    const [editedState, setEdited] = useState(edited)
    const [error, setError] = useState<ReturnType<FormTypes.ValidatorFunction>>({
      valid: true,
      message: '',
    })
    const input = useRef<any>(null)
    const [textIsVisible, setTextVisible] = useBooleanToggle(false)
    const variantStyles =useComponentStyle('TextInput', {
      variants,
      responsiveVariants,
      styles,
    })
    const InputElement = NativeTextInput
  
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
  
    const handleChange = (event:NativeSyntheticEvent<TextInputChangeEventData>) => {
      const text = event.nativeEvent.text
  
      if (onChange) onChange(event)
      if (onChangeText) onChangeText(text)
    }
    
  
  
    
    onUpdate(() => {
  
      
      const result = typeof validate === 'function' ? 
        validate(input?.current?.value) : 
        {message: validate, valid: false}
      setError(result)
     
     
    }, [value, validate])
  
    useImperativeHandle(inputRef, () => input.current)
  
    const showError = (!error.valid  && error.message)
  
  
    const leftIconStyle = {
      ...variantStyles.icon,
      ...(showError ? variantStyles['icon:error'] : {} ),
      ...variantStyles.leftIcon, 
      ...(showError ? variantStyles['leftIcon:error'] : {} ),
    }
    
    const rightIconStyle = {
      ...variantStyles.icon,
      ...(showError ? variantStyles['icon:error'] : {} ),
      ...variantStyles.rightIcon, 
      ...(showError ? variantStyles['rightIcon:error'] : {} ),
    }
    
    const logStyles = useLogStyles()
    function getStyles(key:TextInputComposition){
     const requestedStyles = [variantStyles[key], showError ? variantStyles[key + ':error'] : {}]
     logStyles(`TextInput ${label}/${key}`, requestedStyles)
      return requestedStyles
    }

    
    return (
      <View
        style={getStyles('wrapper')}
      >
        <InputLabel label={label} style={getStyles('label')}/>
  
        <View style={getStyles('innerWrapper')}>
  
    
          <InputIcon {...leftIcon} style={leftIconStyle}/>
          <InputElement
            ref={input}
            secureTextEntry={false}
            onChange={handleChange}
            value={value}
            editable={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
            style={getStyles('textField')}
          />
          {
            visibilityToggle ? 
              <InputIcon  name={
                  (textIsVisible ? 'input-visiblity:visible' : 'input-visiblity:hidden') as IconPlaceholder
              } action={() => setTextVisible()} style={rightIconStyle}/>
              :
              <InputIcon {...rightIcon} style={rightIconStyle}/>
          }
        </View>
        
        <FormError message={error.message} style={{
          ...variantStyles.error,
         
        }}/>
          
        
      </View>
    )
  })
  
  const FormError = ({message, ...props}) => {
    
    if (['number', 'string', 'undefined'].includes(typeof message)){
      return  <Text text={`${message||' '}`} variants={['p2', 'marginTop:1']} {...props}/> 
    }
    return message
  }
  export const InputIcon:React.FC<{style:any} & IconProp> = ({name, style, action}) => {
    if (!name) return null
  
    if (action){
    
    //   return <Button icon={name} onPress={() => action()}  styles={{
    //     icon: style,
    //   }} variants={['icon']}/>
        return null
    }
  
    return <Icon name={name} style={style}/>
  }
  export const InputLabel = ({label, style}) => {
    if (!label) return null
    
    switch (typeof label){
      case 'string':
        return <Text variants={['p2']} style={style} text={label}/>
      case 'object':
      
        return label
      default:
        return null
    }
  }
  