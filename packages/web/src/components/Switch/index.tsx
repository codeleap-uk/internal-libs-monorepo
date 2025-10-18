import React from 'react'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../../lib'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { motion } from 'motion/react'
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { SwitchProps } from './types'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

export * from './styles'
export * from './types'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Switch = (props: SwitchProps) => {
  const {
    inputBaseProps,
    others: switchProps,
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
    onChange,
    switchOnLeft,
    field,
  } = switchProps

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

  // @ts-expect-error icss type
  const _switchOnLeft = switchOnLeft ?? styles.__props?.switchOnLeft

  const thumbStyles = mergeStyles([styles.thumb, disabled && styles['thumb:disabled']])
  const trackStyles = mergeStyles([styles.track, disabled && styles['track:disabled']])

  const handleChange = (e) => {
    if (disabled) return
    if (e?.type === 'click' || e?.keyCode === 13 || e?.key === 'Enter') {
      onInputValueChange?.(!inputValue)
      if (onChange) onChange?.(!inputValue)
    }
  }

  return (
    <InputBase
      {...inputBaseProps}
      ref={wrapperRef}
      debugName={debugName}
      style={styles}
      order={_switchOnLeft ? reversedOrder : InputBaseDefaultOrder}
      disabled={disabled}
      noError
    >
      <motion.div
        style={trackStyles}
        initial={false}
        animate={trackAnimation}
        transition={styles['track:transition']}
        onClick={handleChange}
        onKeyDown={handleChange}
        tabIndex={0}
      >
        <motion.div
          style={thumbStyles}
          initial={false}
          animate={thumbAnimation}
          transition={styles['thumb:transition']}
        />
      </motion.div>
    </InputBase>
  )
}

Switch.styleRegistryName = 'Switch'
Switch.elements = [...InputBase.elements, 'track', 'thumb', '__props']
Switch.rootElement = 'wrapper'

Switch.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Switch as (props: StyledComponentProps<SwitchProps, typeof styles>) => IJSX
}

Switch.defaultProps = {} as Partial<SwitchProps>

WebStyleRegistry.registerComponent(Switch)
