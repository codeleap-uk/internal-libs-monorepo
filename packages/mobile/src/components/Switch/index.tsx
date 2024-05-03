import React from 'react'
import { View } from '../View'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Touchable } from '../Touchable'
import { SwitchProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Switch = (props: SwitchProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...Switch.defaultProps,
    ...props,
  })

  const {
    style,
    value,
    disabled,
    debugName,
    onValueChange,
    switchOnLeft,
  } = others

  const styles = MobileStyleRegistry.current.styleFor(Switch.styleRegistryName, style)

  const trackAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['track:off', 'track:disabled', 'track:on', 'track:disabled-on', 'track:disabled-off'],
    transition: styles['track:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? styles['track:disabled-on'] : styles['track:disabled-off']
      }
      const style = value ? styles['track:on'] : styles['track:off']

      return {
        ...style,
        ...disabledStyle,
      }
    },
    dependencies: [value, disabled],
  })

  const thumbAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['thumb:off', 'thumb:disabled', 'thumb:on', 'thumb:disabled-off', 'thumb:disabled-on'],
    transition: styles['thumb:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? styles['thumb:disabled-on'] : styles['thumb:disabled-off']
      }
      const style = value ? styles['thumb:on'] : styles['thumb:off']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  // @ts-expect-error
  const _switchOnLeft = switchOnLeft ?? styles?.__props?.switchOnLeft

  return <InputBase
    {...inputBaseProps}
    debugName={debugName}
    wrapper={Touchable}
    style={styles}
    wrapperProps={{
      onPress: () => {
        onValueChange(!value)
      },
      disabled,
      rippleDisabled: true,
    }}
    order={_switchOnLeft ? reversedOrder : InputBaseDefaultOrder}
    disabled={disabled}
  >
    <View
      animated
      animatedStyle={trackAnimation}
      style={[
        styles?.track,
        disabled && styles['track:disabled'],
      ]}
    >
      <View
        animated
        animatedStyle={thumbAnimation}
        style={[
          styles?.thumb,
          disabled && styles['thumb:disabled'],
        ]}
      />
    </View>
  </InputBase>
}

Switch.styleRegistryName = 'Switch'
Switch.elements = [...InputBase.elements, 'track', 'thumb']
Switch.rootElement = 'wrapper'

Switch.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Switch as (props: StyledComponentProps<SwitchProps, typeof styles>) => IJSX
}

Switch.defaultProps = {}

MobileStyleRegistry.registerComponent(Switch)
