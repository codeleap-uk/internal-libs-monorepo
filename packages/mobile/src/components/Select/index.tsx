import {  IconPlaceholder, useBooleanToggle, getNestedStylesByKey, useComponentStyle } from '@codeleap/common'
import React, { useMemo } from 'react'
import { Modal, StyleSheet } from 'react-native'
import { Button } from '../Button'
import { Scroll } from '../Scroll'
import { Text } from '../Text'
import {  InputLabel, TextInput } from '../TextInput'
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
    scroll = true,
    showClose = true,
    showLabelOnModal = true,
    placeholder = 'Select',
    arrowIconName = 'selectArrow',
    footer,
    modalCloseIconName = 'close',
    header,
    closeButtonProps,
    modalLabel,
    ...props
  } = selectProps

  const [isModalVisible, setModalVisibility] = useBooleanToggle(false)

  const variantStyles = useComponentStyle<'u:MobileSelect', typeof MobileSelectStyles>('u:MobileSelect', {
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
    if (closeOnSelect){
      close()
    }
  }

  const selectedLabel = useMemo(() => {
    const current = options.find(o => o.value === value)
    return current?.label ?? placeholder
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
      innerWrapperProps={{
        onPress: close,
      }}
      label={label}
      styles={inputStyles}
      style={style}
      {...props}
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
      pointerEvents={isModalVisible ? 'auto': 'none'}
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
      />
      <View style={variantStyles.modalWrapper}>
       
        <View style={variantStyles.modalBox}>
          {
            (showClose || showLabelOnModal || header) && (
              <View style={variantStyles.modalHeader}>
                {
                  header ? header :  <>
                    {showLabelOnModal && <InputLabel label={modalLabel || label} style={variantStyles.modalLabelText}/>}
                    {showClose && <Button 
                      icon={modalCloseIconName as IconPlaceholder} 
                      onPress={close} 
                      styles={closeButtonStyles}
                      {...closeButtonProps}
                    />}
                  </>
                }
              </View>
            )
          }
          <ListComponent style={variantStyles.modalList}>
            {
              options.map((item, idx) => {
                const isSelected = value === item.value

                if (renderItem) {
                  return renderItem({
                    ...item,
                    selected: isSelected,
                    onPress: close,
                    styles: variantStyles,
                
                  }) 
                }

                return <Touchable key={idx} style={[
                  variantStyles.modalItem, 
                  isSelected && variantStyles['modalItem:selected'],
                ]} onPress={() => select(item.value)}>
                  <Text text={item.label} style={variantStyles.modalItemText}/>
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
