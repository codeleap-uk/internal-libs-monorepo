import React, { useMemo, useRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { useConditionalState } from '@codeleap/hooks'
import DatePicker from 'react-native-date-picker'
import { Modal } from '../Modal'
import { TextInput } from '../TextInput'
import { Button } from '../Button'
import { DatePickerModalProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { DateField, fields } from '@codeleap/form'
import { useInputBase } from '../InputBase/useInputBase'

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

const defaultFormatDate: DatePickerModalProps['formatDate'] = (_date) => {
  if (!_date) return null
  const date = new Date(_date)
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
    field,
    isCustomModal,
    hideInput,
    visible: _visible,
    toggle: _toggle,
    formatDate,
    debugName,
    cancelButtonProps = {},
    confirmButtonProps = {},
    outerInputComponent: OuterInput,
    datePickerProps,
    mode,
    label,
    commitDate,
    description,
    showDoneButton,
    style,
    minimumDate,
    maximumDate,
    initialDate = minimumDate,
    footerComponent: Footer,
    toggleOnConfirm,
    onConfirm: _onConfirm,
    value,
    onValueChange,
    locale,
    ...modalProps
  } = allProps

  const styles = useStylesFor(DatePickerModal.styleRegistryName, style)

  const [visible, toggle] = useConditionalState(_visible, _toggle, { initialValue: false, isBooleanToggle: true })

  const {
    inputValue,
    onInputValueChange,
  } = useInputBase(field, fields.date, { value, onValueChange })

  const Wrapper = isCustomModal ? Modal : React.Fragment

  const compositionStyles = useCompositionStyles(['input', 'doneButton', 'cancelButton', 'confirmButton'], styles)

  const formattedDate = inputValue ? formatDate(inputValue) : ''

  const tempDate = useRef<Date | null>(initialDate instanceof Date ? initialDate : new Date(initialDate))

  const onConfirm = () => {
    if (commitDate == 'onConfirm' && !!tempDate.current) {
      onInputValueChange(tempDate.current)
    }

    if (isCustomModal && toggleOnConfirm) {
      toggle()
    }

    if (TypeGuards.isFunction(_onConfirm)) {
      _onConfirm?.(tempDate.current)
    }
  }

  const modalFooter = <Footer
    {...allProps}
    confirm={onConfirm}
    doneStyles={compositionStyles?.doneButton}
    cancelStyles={compositionStyles?.cancelButton}
    confirmStyles={compositionStyles?.confirmButton}
    confirmButtonProps={confirmButtonProps}
    cancelButtonProps={cancelButtonProps}
    showDoneButton={showDoneButton}
    debugName={debugName}
    visible={visible}
    toggle={toggle}
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

  const date = useMemo(() => {
    const newValue = inputValue ?? initialDate
    return newValue instanceof Date ? newValue : new Date(newValue)
  }, [inputValue, initialDate])

  return (
    <>
      {!hideInput ? <OuterInput
        {...allProps}
        style={compositionStyles?.input}
        value={inputValue}
        debugName={debugName}
        visible={visible}
        toggle={toggle}
        onValueChange={onInputValueChange}
        valueLabel={formattedDate}
      /> : null}

      <Wrapper {...wrapperProps}>
        <DatePicker
          modal={!isCustomModal}
          open={visible}
          onCancel={toggle}
          date={date}
          onDateChange={(currentDate) => {
            tempDate.current = currentDate

            if (commitDate === 'onChange') {
              onInputValueChange(currentDate)
            }
          }}
          locale={locale}
          // @ts-expect-error
          textColor={styles?.picker?.color}
          theme='light'
          androidVariant='iosClone'
          onConfirm={onInputValueChange}
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
