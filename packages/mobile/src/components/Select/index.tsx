import { IconPlaceholder, useBooleanToggle, getNestedStylesByKey, useDefaultComponentStyle, TypeGuards } from '@codeleap/common'
import React, { useMemo } from 'react'
import { Modal, StyleSheet } from 'react-native'
import { Button } from '../Button'
import { Scroll } from '../Scroll'
import { InputLabel, TextInput } from '../TextInput'
import { Touchable } from '../Touchable'
import { AnimatedView, View } from '../View'
import { MobileSelectStyles } from './styles'
import { CustomSelectProps } from './types'

export const Select = <T extends string|number = string>(selectProps:CustomSelectProps<T>) => {
  const {
    value,
    onValueChange,
    label,
    styles = {},
    options,
    style,
    variants,
    renderItem,
    closeOnSelect = true,
    scroll = false,
    showClose = true,
    showLabelOnModal = true,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    footer,
    modalCloseIconName = 'close',
    header,
    closeButtonProps,
    modalLabel,
    textInputProps = {},
    visible = null,
    toggle = null,
    renderList,
    ...props
  } = selectProps

  const [_isModalVisible, _setModalVisibility] = useBooleanToggle(false)

  const isModalVisible = visible ?? _isModalVisible
  const setModalVisibility = toggle ?? _setModalVisibility

  const variantStyles = useDefaultComponentStyle<'u:MobileSelect', typeof MobileSelectStyles>('u:MobileSelect', {
    transform: StyleSheet.flatten,
    rootElement: 'inputWrapper',
    styles,
    variants,
  })

  const inputStyles = useMemo(
    () => getNestedStylesByKey('input', variantStyles),
    [variantStyles],
  )

  const closeButtonStyles = useMemo(
    () => getNestedStylesByKey('modalCloseButton', variantStyles),
    [variantStyles],
  )

  const ListComponent = scroll ? Scroll : View

  const close = () => setModalVisibility()
  const select = (value) => {

    onValueChange(value)
    if (closeOnSelect) {
      close()
    }
  }
  const selectedLabel:string = useMemo(() => {
    const current = options.find(o => o.value === value)

    const display = current?.label ?? placeholder

    return TypeGuards.isString(display) ? display : ''
  }, [value, placeholder, options])

  return <>
    <TextInput

      caretHidden
      value={selectedLabel}
      rightIcon={{
        name: arrowIconName as IconPlaceholder,
      }}
      editable={false}
      touchableWrapper
      wrapperProps={{
        debugName: 'Select',
        onPress: close,
      }}
      pointerEvents={'none'}
      label={label}
      debugName={'Select input'}
      styles={inputStyles}
      style={style}
      {...textInputProps}
    />
    <AnimatedView pointerEvents={'none'} transition='opacity' style={[
      {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      },
      variantStyles.backdrop,
      isModalVisible ? variantStyles['backdrop:visible'] : variantStyles['backdrop:hidden'],
    ]} />

    <Modal
      animationType='slide'
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        setModalVisibility()
      }}
      pointerEvents={isModalVisible ? 'auto' : 'none'}
    >
      <Touchable
        onPress={close}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        debugName={`Close modal`}
      />
      <View style={variantStyles.modalWrapper}>

        <View style={variantStyles.modalBox}>
          {
            (showClose || showLabelOnModal || header) && (
              <View style={variantStyles.modalHeader}>
                {
                  header ? header : <>
                    {showLabelOnModal && <InputLabel label={modalLabel || label} style={variantStyles.modalLabelText}/>}
                    {showClose && <Button
                      icon={modalCloseIconName as IconPlaceholder}
                      onPress={close}
                      styles={closeButtonStyles}
                      debugName={'Close modal'}
                      {...closeButtonProps}
                    />}
                  </>
                }
              </View>
            )
          }
          <ListComponent style={variantStyles.modalList}>
            {
              renderList ? renderList({
                ...selectProps,
                isEmpty: !options.length,

              }) : options.map((item, idx) => {
                const isSelected = value === item.value
                if (renderItem) {
                  return renderItem({
                    ...item,
                    index: idx,
                    selected: isSelected,
                    onPress: close,
                    styles: variantStyles,
                  })
                }

                return <Touchable key={idx} style={[
                  variantStyles.modalItem,
                  isSelected && variantStyles['modalItem:selected'],
                ]} onPress={() => select(item.value)} debugName={`Select ${item.value}`}>
                  <InputLabel label={item.label} style={[variantStyles.modalItemText, isSelected && variantStyles['modalItemText:selected']]}/>
                </Touchable>
              })
            }
          </ListComponent>

          {
            footer && <View style={variantStyles.modalFooter}>
              {footer}
            </View>
          }
        </View>
      </View>
    </Modal>
  </>
}

export * from './styles'
export * from './types'
