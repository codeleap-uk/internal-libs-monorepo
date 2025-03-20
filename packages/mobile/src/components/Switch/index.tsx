import React from 'react'
import { View } from '../View'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Touchable } from '../Touchable'
import { SwitchProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

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
    disabled,
    debugName,
    switchOnLeft,
    field,
    forceError,
    value,
    onValueChange,
  } = others

  const styles = useStylesFor(Switch.styleRegistryName, style)

  const {
    validation,
    wrapperRef,
    inputValue,
    onInputValueChange,
  } = useInputBase<boolean>(field, fields.boolean, { value, onValueChange })

  const trackAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['track:off', 'track:disabled', 'track:on', 'track:disabled-on', 'track:disabled-off'],
    transition: styles['track:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = inputValue ? styles['track:disabled-on'] : styles['track:disabled-off']
      }
      const style = inputValue ? styles['track:on'] : styles['track:off']

      return {
        ...style,
        ...disabledStyle,
      }
    },
    dependencies: [inputValue, disabled],
  })

  const thumbAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['thumb:off', 'thumb:disabled', 'thumb:on', 'thumb:disabled-off', 'thumb:disabled-on'],
    transition: styles['thumb:transition'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = inputValue ? styles['thumb:disabled-on'] : styles['thumb:disabled-off']
      }
      const style = inputValue ? styles['thumb:on'] : styles['thumb:off']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [inputValue, disabled],
  })

  // @ts-expect-error
  const _switchOnLeft = switchOnLeft ?? styles?.__props?.switchOnLeft

  const hasError = validation?.showError || forceError

  return <InputBase
    {...inputBaseProps}
    ref={wrapperRef}
    debugName={debugName}
    wrapper={Touchable}
    error={hasError ? validation?.message || forceError : null}
    style={styles}
    wrapperProps={{
      onPress: () => onInputValueChange(!inputValue),
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

Switch.defaultProps = {} as Partial<SwitchProps>

MobileStyleRegistry.registerComponent(Switch)
