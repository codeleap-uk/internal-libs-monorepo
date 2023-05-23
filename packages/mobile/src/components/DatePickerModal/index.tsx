import React, { useRef } from 'react'
import { useState, useCodeleapContext, useDefaultComponentStyle, TypeGuards, useBooleanToggle, useNestedStylesByKey, useI18N } from '@codeleap/common'
import { DatePickerModalPresets } from './styles'
import DatePicker from 'react-native-date-picker'
import { TextInput } from '../TextInput'
import { ModalManager } from '../../utils'
import { Button } from '../Button'
import { StyleSheet } from 'react-native'
import { DatePickerModalProps } from './types'

export * from './styles'


const OuterInputComponent:DatePickerModalProps['outerInputComponent'] = (props) => {
  const {
    debugName,
    onValueChange,
    value,
    visible,
    toggle,
    valueLabel,
    ...otherProps
  } = props


  return <TextInput
    debugName={`${debugName} outer input`}
    value={TypeGuards.isString(valueLabel) ? valueLabel : ''}
    onPress={toggle}
    {...otherProps}
  />
}

const defaultFormatDate:DatePickerModalProps['formatDate'] = (date) => {

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const DefaultFooter:DatePickerModalProps['footerComponent'] = (props) => {
  const {
    debugName,
    commitDate,
    showDoneButton,
    styles,
    confirm,  
    confirmButtonProps = {},
    cancelButtonProps = {},
    toggle
  } = props

  if(commitDate == 'onConfirm'){
   return <>
      <Button
        debugName={`${debugName} cancel button`}
        styles={styles.cancel}
        variants={['flex']}
        text={`Cancel`}
        onPress={toggle}
        {...cancelButtonProps}
        />
      <Button
        debugName={`${debugName} confirm button`}
        variants={['flex']}
        styles={styles.confirm}
        text={`Confirm`}
        onPress={confirm}
        {...confirmButtonProps}
        />
    </> 
    

  }

  if(!showDoneButton) return null

  return <Button  
    debugName={`${debugName} done button`}
    onPress={confirm}
    text={'Done'}
    styles={styles.done}


  />
}


const defaultProps:Partial<DatePickerModalProps> = {
  outerInputComponent: OuterInputComponent,
  formatDate: defaultFormatDate,
  footerComponent: DefaultFooter,
  mode: 'date',
  commitDate: 'onConfirm',
  showDoneButton: true,
  isCustomModal: true,

}

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme, currentTheme } = useCodeleapContext()

  const allProps = {
    ...defaultProps,
    ...props,
  }

  const {
    isCustomModal,
    
    hideInput,
    visible: _visible,
    toggle: _toggle,
    value: _value,
    onValueChange,
    formatDate,
    debugName,
    cancelButtonProps = {},
    confirmButtonProps = {},
    outerInputComponent,
    footer,
    variants = [],
    styles = {},
    placeholder,
    datePickerProps,
    mode,
    label,
    commitDate ,
    description,
    showDoneButton,
    style,
    footerComponent,
    ...modalProps
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:DatePickerModal', typeof DatePickerModalPresets>('u:DatePickerModal', {
    variants,
    styles,
    rootElement: 'inputWrapper',
    transform: StyleSheet.flatten,
  })

  const [visible, toggle] = !TypeGuards.isNil(_visible) && !!_toggle ? [_visible, _toggle] : useBooleanToggle(false)
  const [value, setValue] = _value && onValueChange ? [_value, onValueChange] : useState(null)


  const Wrapper = isCustomModal ? ModalManager.Modal  :  React.Fragment

  const OuterInput = outerInputComponent
  const Footer = footerComponent

  const inputStyle = useNestedStylesByKey('input', variantStyles)
  const doneStyle = useNestedStylesByKey('doneButton', variantStyles)
  const cancelStyle = useNestedStylesByKey('cancelButton', variantStyles)
  const confirmStyle = useNestedStylesByKey('confirmButton', variantStyles)

  const formattedDate = value ? formatDate(value) : placeholder 

  const {locale} = useI18N()


  const tempDate = useRef<Date|null>(null)

  const onConfirm = () => {
    if(commitDate == 'onConfirm'){
      setValue(tempDate.current)
    }

    if(isCustomModal){
      toggle()
    }
  }

 const modalFooter = footer || <Footer 
    {...allProps}
    confirm={onConfirm}
    styles={{
      done: doneStyle,  
      cancel: cancelStyle,
      confirm: confirmStyle,
    }}
    value={value}
    debugName={debugName}
    visible={visible}
    toggle={toggle}
    onValueChange={setValue}
    valueLabel={formattedDate}
    
    
  
 />


  return (
    <>
      {!hideInput && <OuterInput
        {...allProps}
        styles={inputStyle}
        value={value}
        debugName={debugName}
        visible={visible}
        toggle={toggle}
        onValueChange={setValue}
        valueLabel={formattedDate}
        style={style}

      />}

      <Wrapper 
        title={label}
        description={description}
        {...modalProps}
        id={null}
        debugName={`${debugName} Modal`} 
        visible={visible} 
        toggle={toggle} 
        styles={variantStyles}
        footer={modalFooter}
      >
        <DatePicker 
          modal={!isCustomModal}
          open={visible}
          onCancel={toggle}
          date={value ?? new Date()}
          onDateChange={(date) => {
            if(commitDate === 'onChange'){
              setValue(date)
              return
            }

            tempDate.current = date
          }}
          locale={locale}
          theme={currentTheme ===  'dark' ? 'dark' : 'light' }
          textColor={variantStyles?.picker?.color}
          androidVariant='iosClone'
          onConfirm={onConfirm}
          {...datePickerProps}
          mode={mode}

        />
      </Wrapper>

    </>
  )

}

DatePickerModal.defaultProps = defaultProps