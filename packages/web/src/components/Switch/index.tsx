/** @jsx jsx */
import * as React from 'react'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { SwitchProps, WebStyleRegistry, useAnimatedVariantStyles } from '../..'
import { motion } from 'framer-motion'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

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
  } = switchProps

  const styles = useStylesFor(Switch.styleRegistryName, style)

  const trackAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['track:off', 'track:disabled', 'track:on', 'track:disabled-on', 'track:disabled-off'],
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

  // @ts-expect-error @verify
  const _switchOnLeft = switchOnLeft ?? styles.__props?.switchOnLeft

  const handleChange = (e) => {
    if (disabled) return
    if (e?.type === 'click' || e?.keyCode === 13 || e?.key === 'Enter') {
      if (onValueChange) onValueChange?.(!value)
      if (onChange) onChange?.(!value)
    }
  }

  return (
    <InputBase
      {...inputBaseProps}
      debugName={debugName}
      style={{
        ...styles,
        innerWrapper: [
          styles.innerWrapper,
        ],
      }}
      order={_switchOnLeft ? reversedOrder : InputBaseDefaultOrder}
      disabled={disabled}
      noError
    >
      <motion.div
        css={[
          // @ts-expect-error @verify
          styles.track,
          // @ts-expect-error @verify
          disabled && styles['track:disabled'],
        ]}
        initial={false}
        animate={trackAnimation}
        transition={styles['track:transition']}
        onClick={handleChange}
        onKeyDown={handleChange}
        tabIndex={0}
      >
        <motion.div
          css={[
            // @ts-expect-error @verify
            styles.thumb,
            // @ts-expect-error @verify
            disabled && styles['thumb:disabled'],
          ]}
          initial={false}
          animate={thumbAnimation}
          transition={styles['thumb:transition']}
        />
      </motion.div>
    </InputBase>
  )
}

Switch.styleRegistryName = 'Switch'

Switch.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'errorMessage',
  'description',
  'labelRow',
  'icon',
  'leftIcon',
  'rightIcon',
  'track',
  'thumb',
  '__props',
]

Switch.rootElement = 'wrapper'

Switch.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Switch as (props: StyledComponentProps<SwitchProps, typeof styles>) => IJSX
}

Switch.defaultProps = {} as Partial<SwitchProps>

WebStyleRegistry.registerComponent(Switch)

export * from './styles'
export * from './types'
