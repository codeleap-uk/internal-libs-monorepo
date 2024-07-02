import React, { useCallback } from 'react'
import { ActionIcon, Collapse, View } from '../components'
import { HexColorPicker } from 'react-colorful'
import { TypeGuards, useBooleanToggle, useState } from '@codeleap/common'
import { ColorPickerProps, ColorTypes, ColorPickerFooterProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

const DefaultFooter = (props: ColorPickerFooterProps) => {
  const { styles, clearIcon, handleClear, confirmIcon, handleConfirmation } = props

  return (
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
  )
}

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

  const handleConfirmation = useCallback((color: ColorTypes) => {
    onConfirm?.(color)
    if (closeOnConfirm) toggle(false)
  }, [])

  const handleClear = useCallback((initialColor: ColorTypes) => {
    setColor(initialColor)
    if (TypeGuards.isFunction(onClear)) onClear?.()
  }, [])

  // Dragging to change the color in any other way does not seem to work for some reason.
  const picker = <View style={styles.picker}><PickerComponent color={color} onChange={setColor} /></View>

  const openColorPickerBtn = !!OpenPickerComponent ? <OpenPickerComponent color={color} visible={visible} toggle={toggle} /> : <ActionIcon onPress={toggle} icon={icon} {...openPickerProps} />

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
              ]
            }}
          >
            <View style={styles.dropdownInnerWrapper}>
              {picker}

              {showFooter ? (
                <FooterComponent
                  color={color}
                  handleConfirmation={() => handleConfirmation(color)}
                  handleClear={() => handleClear(initialColor)}
                  styles={styles}
                  clearIcon={clearIcon}
                  confirmIcon={confirmIcon}
                />
              ) : null}
            </View>
          </Collapse>
        </>
      )}
    </View>
  )
}

ColorPickerCP.styleRegistryName = 'ColorPicker'
ColorPickerCP.elements = ['wrapper', 'picker', 'dropdown', 'dropdownInnerWrapper', 'footerWrapper', 'clearIcon', 'confirmIcon']
ColorPickerCP.rootElement = 'wrapper'

ColorPickerCP.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ColorPickerCP as (props: StyledComponentProps<ColorPickerProps, typeof styles>) => IJSX
}

ColorPickerCP.defaultProps = {
  pickerComponent: (props) => <HexColorPicker {...props} />,
  footerComponent: DefaultFooter,
  icon: 'edit' as AppIcon,
  clearIcon: 'trash' as AppIcon,
  confirmIcon: 'check' as AppIcon,
  showFooter: true,
  isPlain: false,
  closeOnConfirm: true,
} as Partial<ColorPickerProps>

WebStyleRegistry.registerComponent(ColorPickerCP)

export const ColorPicker = React.memo(ColorPickerCP)
