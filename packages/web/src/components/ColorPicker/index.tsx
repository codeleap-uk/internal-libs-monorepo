/* eslint-disable max-len */
import React, { useCallback } from 'react'
import { ActionIcon, Collapse, IconProps, View } from '../components'
import { HexColorPicker } from 'react-colorful'
import { useBooleanToggle, useState } from '@codeleap/common'
import { ColorPickerProps, ColorTypes } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export const ColorPickerCP = (props: ColorPickerProps) => {

  const {
    isPlain,
    initialColor,
    showFooter,
    icon,
    style,
    clearIcon,
    confirmIcon,
    onConfirm,
    onClear,
    closeOnConfirm,
    pickerComponent: PickerComponent,
    openPickerComponent: OpenPickerComponent,
    footerComponent: FooterComponent,
    openPickerProps,
  } = {
    ...ColorPickerCP.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ColorPickerCP.styleRegistryName, style)

  const [visible, toggle] = useBooleanToggle(false)
  const [color, setColor] = useState<ColorTypes>(initialColor)

  const handleConfirmation = useCallback(() => {
    onConfirm?.(color)
    closeOnConfirm && toggle(false)
  }, [color])

  const handleClear = useCallback(() => {
    setColor(initialColor)
    onClear?.()
  }, [initialColor])

  const Footer = useCallback(() => (
    <View style={styles.footerWrapper}>
      <ActionIcon
        debugName='ColorPicker footer trash'
        name={clearIcon}
        onPress={handleClear}
        style={styles.clearIcon}
      />
      <ActionIcon
        debugName='ColorPicker footer check'
        name={confirmIcon}
        onPress={handleConfirmation}
        style={styles.confirmIcon}
      />
    </View>
  ), [clearIcon, confirmIcon, handleClear, handleConfirmation])

  // Dragging to change the color in any other way does not seem to work for some reason.
  const picker = <View style={styles.picker}><PickerComponent color={color} onChange={setColor} /></View>

  const _footer = !!showFooter && FooterComponent ? <FooterComponent color={color} handleConfirmation={handleConfirmation} handleClear={handleClear}/> : <Footer/>
  const openColorPickerBtn = !!OpenPickerComponent ? <OpenPickerComponent color={color} visible={visible} toggle={toggle}/> : <ActionIcon onPress={toggle} icon={icon} {...openPickerProps}/>

  return (
    <View style={styles.wrapper}>
      {isPlain ? picker : (
        <>
          {openColorPickerBtn}
          <Collapse
            open={visible}
            style={{
              wrapper: [
                styles.dropdown,
                visible && styles['dropdown:open'],
              ] }}
          >
            <View style={styles.dropdownInnerWrapper}>
              {picker}
              {_footer}
            </View>
          </Collapse>
        </>
      )}
    </View>
  )
}

ColorPickerCP.styleRegistryName = 'ColorPicker'

ColorPickerCP.elements = [
  'wrapper',
  'picker',
  'dropdown',
  'dropdownInnerWrapper',
  'footerWrapper',
  'clearIcon',
  'confirmIcon',
]

ColorPickerCP.rootElement = 'wrapper'

ColorPickerCP.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ColorPickerCP as (props: StyledComponentProps<ColorPickerProps, typeof styles>) => IJSX
}

ColorPickerCP.defaultProps = {
  pickerComponent: (props) => <HexColorPicker {...props}/>,
  footerComponent: null,
  icon: 'edit' as IconProps['name'],
  clearIcon: 'trash' as IconProps['name'],
  confirmIcon: 'check' as IconProps['name'],
  showFooter: true,
  isPlain: false,
  closeOnConfirm: true,
} as Partial<ColorPickerProps>

WebStyleRegistry.registerComponent(ColorPickerCP)

export const ColorPicker = React.memo(ColorPickerCP)

export * from './styles'
export * from './types'

