/* eslint-disable max-len */
import React, { useCallback } from 'react'
import { ActionIcon, Collapse, ColorPickerPresets, View } from '../components'
import { HexColorPicker } from 'react-colorful'
import { useBooleanToggle, useDefaultComponentStyle, useState } from '@codeleap/common'
import { ColorPickerProps, ColorTypes } from './types'

export * from './styles'
export * from './types'

const defaultProps = {
  pickerComponent: (props) => <HexColorPicker {...props}/>,
  icon: 'edit',
  clearIcon: 'trash',
  confirmIcon: 'check',
  showFooter: true,
}

export const ColorPicker = (props: ColorPickerProps) => {
  const {
    isPlain = false,
    initialColor,
    showFooter,
    icon,
    clearIcon,
    confirmIcon,
    variants = [],
    styles = {},
    responsiveVariants = {},
    onConfirm,
    onClear,
    closeOnConfirm = true,
    pickerComponent: PickerComponent,
    openPickerComponent: OpenPickerComponent,
    footerComponent: FooterComponent = null,
    openPickerProps,
  } = props
  const [visible, toggle] = useBooleanToggle(false)
  const [color, setColor] = useState<ColorTypes>(initialColor)

  const variantStyles = useDefaultComponentStyle<'u:ColorPicker', typeof ColorPickerPresets>('u:ColorPicker', {
    variants,
    styles,
    responsiveVariants,
  })

  const handleConfirmation = useCallback(() => {
    onConfirm?.(color)
    closeOnConfirm && toggle(false)
  }, [color])

  const handleClear = useCallback(() => {
    setColor(initialColor)
    onClear?.()
  }, [initialColor])

  const Footer = useCallback(() => (
    <View style={variantStyles.footerWrapper}>
      <ActionIcon debugName='ColorPicker footer trash' name={clearIcon} onPress={handleClear} styles={variantStyles.footerButton} />
      <ActionIcon debugName='ColorPicker footer check' name={confirmIcon} onPress={handleConfirmation} styles={variantStyles.footerButton} />
    </View>
  ), [clearIcon, confirmIcon, handleClear, handleConfirmation])

  // Dragging to change the color in any other way does not seem to work for some reason.
  const picker = <View style={variantStyles.picker}><PickerComponent color={color} onChange={setColor} /></View>

  const _footer = !!showFooter && FooterComponent ? <FooterComponent color={color} handleConfirmation={handleConfirmation} handleClear={handleClear}/> : <Footer/>
  const openColorPickerBtn = !!OpenPickerComponent ? <OpenPickerComponent color={color} visible={visible} toggle={toggle}/> : <ActionIcon onPress={toggle} icon={icon} {...openPickerProps}/>

  return (
    <View style={variantStyles.wrapper}>
      {isPlain ? picker : (
        <>
          {openColorPickerBtn}
          <Collapse
            open={visible}
            styles={{ wrapper: [
              variantStyles.dropdown,
              visible && variantStyles['dropdown:open'],
            ] }}
          >
            <View style={variantStyles.dropdownInnerWrapper}>
              {picker}
              {_footer}
            </View>
          </Collapse>
        </>
      )}
    </View>
  )
}

ColorPicker.defaultProps = defaultProps
