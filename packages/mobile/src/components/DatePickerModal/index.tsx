import React, { useRef } from 'react'
import { TypeGuards, useConditionalState, useI18N } from '@codeleap/common'
import DatePicker from 'react-native-date-picker'
import Modal from '../Modal'
import { TextInput } from '../TextInput'
import { ModalManager } from '../../utils'
import { Button } from '../Button'
import { DatePickerModalProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const OuterInputComponent: DatePickerModalProps['outerInputComponent'] = (props) => {
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

const defaultFormatDate: DatePickerModalProps['formatDate'] = (date) => {
  if (!date) return null
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const DefaultFooter: DatePickerModalProps['footerComponent'] = (props) => {
  const {
    debugName,
    commitDate,
    showDoneButton,
    confirm,
    confirmButtonProps = {},
    cancelButtonProps = {},
    toggle,
    cancelStyles,
    confirmStyles,
    doneStyles,
  } = props

  if (commitDate == 'onConfirm') {
    return <>
      <Button
        debugName={`${debugName} cancel button`}
        style={cancelStyles}
        text={`Cancel`}
        onPress={toggle}
        {...cancelButtonProps}
      />
      <Button
        debugName={`${debugName} confirm button`}
        style={confirmStyles}
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
    style={doneStyles}
  />
}

export const DatePickerModal = (props: DatePickerModalProps) => {
  const allProps = {
    ...DatePickerModal.defaultProps,
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
    outerInputComponent: OuterInput,
    footer,
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
    footerComponent: Footer,
    toggleOnConfirm,
    onConfirm: _onConfirm,
    ...modalProps
  } = allProps

  const styles = useStylesFor(DatePickerModal.styleRegistryName, style)

  const [visible, toggle] = useConditionalState(_visible, _toggle, { initialValue: false, isBooleanToggle: true })

  const [value, setValue] = [_value, onValueChange]

  const Wrapper = isCustomModal ? ModalManager.Modal : React.Fragment

  const compositionStyles = useCompositionStyles(['input', 'doneButton', 'cancelButton', 'confirmButton'], styles)

  const formattedDate = value ? formatDate(value) : ''
  const { locale } = useI18N()

  const tempDate = useRef<Date | null>(null)

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
    doneStyles={compositionStyles?.doneButton}
    cancelStyles={compositionStyles?.cancelButton}
    confirmStyles={compositionStyles?.confirmButton}
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
    style: styles,
    footer: modalFooter,
    ...modalProps,
    id: null,
  } : {}

  return (
    <>
      {!hideInput ? <OuterInput
        {...allProps}
        style={compositionStyles?.input}
        value={value}
        debugName={debugName}
        visible={visible}
        toggle={toggle}
        onValueChange={setValue}
        valueLabel={formattedDate}
      /> : null}

      <Wrapper {...wrapperProps}>
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
          // @ts-expect-error
          textColor={styles?.picker?.color}
          theme='light'
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

DatePickerModal.styleRegistryName = 'DatePickerModal'
DatePickerModal.elements = [...Modal.elements, 'input', 'picker', 'doneButton', 'confirmButton', 'cancelButton']
DatePickerModal.rootElement = 'inputWrapper'

DatePickerModal.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return DatePickerModal as (props: StyledComponentProps<DatePickerModalProps, typeof styles>) => IJSX
}

DatePickerModal.defaultProps = {
  outerInputComponent: OuterInputComponent,
  formatDate: defaultFormatDate,
  footerComponent: DefaultFooter,
  mode: 'date',
  commitDate: 'onConfirm',
  showDoneButton: true,
  isCustomModal: true,
  toggleOnConfirm: true,
} as Partial<DatePickerModalProps>

MobileStyleRegistry.registerComponent(DatePickerModal)
