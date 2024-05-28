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
export * from './types'

const OuterInputComponent:DatePickerModalProps['outerInputComponent'] = (props) => {
  const {
    debugName,
    toggle,
    valueLabel,
    placeholder,
    ...otherProps
  } = props

  return <TextInput
    debugName={`${debugName} outer input`}
    onPress={toggle}
    {...otherProps}
    value={TypeGuards.isString(valueLabel) ? valueLabel : ''}
    placeholder={TypeGuards.isString(placeholder) ? placeholder : ''}
  />
}

const defaultFormatDate:DatePickerModalProps['formatDate'] = (date) => {
  if (!date) return null
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
    toggle,
  } = props

  if (commitDate == 'onConfirm') {
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

  if (!showDoneButton) return null

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
  toggleOnConfirm: true,
}

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { currentTheme } = useCodeleapContext()

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
    datePickerProps,
    mode,
    label,
    commitDate,
    description,
    showDoneButton,
    style,
    minimumDate,
    maximumDate,
    initialDate,
    footerComponent,
    toggleOnConfirm,
    onConfirm: _onConfirm,
    ...modalProps
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:DatePickerModal', typeof DatePickerModalPresets>('u:DatePickerModal', {
    variants,
    styles,
    rootElement: 'inputWrapper',
    transform: StyleSheet.flatten,
  })

  const [visible, toggle] = !TypeGuards.isNil(_visible) && !!_toggle ? [_visible, _toggle] : useBooleanToggle(false)
  const [value, setValue] = [_value, onValueChange]
  //const [value, setValue] = _value && onValueChange ? [_value, onValueChange] : useState(_value ?? new Date())

  const Wrapper = isCustomModal ? ModalManager.Modal : React.Fragment

  const OuterInput = outerInputComponent
  const Footer = footerComponent

  const inputStyle = useNestedStylesByKey('input', variantStyles)
  const doneStyle = useNestedStylesByKey('doneButton', variantStyles)
  const cancelStyle = useNestedStylesByKey('cancelButton', variantStyles)
  const confirmStyle = useNestedStylesByKey('confirmButton', variantStyles)

  const formattedDate = value ? formatDate(value) : ''
  const { locale } = useI18N()

  const tempDate = useRef<Date|null>(null)

  const onConfirm = () => {
    if (commitDate == 'onConfirm' && !!tempDate.current) {
      setValue(tempDate.current)
    }

    if (isCustomModal && toggleOnConfirm) {
      toggle()
    }

    if (TypeGuards.isFunction(_onConfirm)) {
      _onConfirm?.(tempDate.current)
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
    confirmButtonProps={confirmButtonProps}
    cancelButtonProps={cancelButtonProps}
    showDoneButton={showDoneButton}
    value={value}
    debugName={debugName}
    visible={visible}
    toggle={toggle}
    onValueChange={setValue}
    valueLabel={formattedDate}
  />

  const wrapperProps = isCustomModal ? {
    title: label,
    description: description,
    debugName: `${debugName} Modal`,
    visible: visible,
    toggle: toggle,
    styles: variantStyles,
    footer: modalFooter,
    ...modalProps,
    id: null,
  } : {}

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
      {/* @ts-expect-error */}
      <Wrapper {...wrapperProps} >
        <DatePicker
          modal={!isCustomModal}
          open={visible}
          onCancel={toggle}
          date={value ?? initialDate ?? new Date()}
          onDateChange={(date) => {
            if (commitDate === 'onChange') {
              setValue(date)
              return
            }

            tempDate.current = date
          }}
          locale={locale}
          theme={currentTheme === 'dark' ? 'dark' : 'light' }
          textColor={variantStyles?.picker?.color}
          androidVariant='iosClone'
          onConfirm={setValue}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          {...datePickerProps}
          mode={mode}

        />
      </Wrapper>

    </>
  )

}

DatePickerModal.defaultProps = defaultProps
