/** @jsx jsx */
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Icon } from '../Icon'
import { motion } from 'framer-motion'
import { CheckboxProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, AppIcon, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'
import { CheckboxParts } from './styles'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export * from './styles'
export * from './types'

export const Checkbox = (props: CheckboxProps) => {
  const {
    inputBaseProps,
    others: checkboxProps,
  } = selectInputBaseProps({
    ...Checkbox.defaultProps,
    ...props,
  })

  const {
    style,
    value,
    disabled,
    debugName,
    onValueChange,
    checkboxOnLeft,
    checkIcon,
  } = checkboxProps

  const styles = useStylesFor(Checkbox.styleRegistryName, style)

  const boxAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['box:unchecked', 'box:disabled', 'box:checked', 'box:disabled-checked', 'box:disabled-unchecked'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? styles['box:disabled-checked'] : styles['box:disabled-unchecked']
      }
      const style = value ? styles['box:checked'] : styles['box:unchecked']

      return {
        ...style,
        ...disabledStyle,
      }
    },
    dependencies: [value, disabled],
  })

  const checkmarkWrapperAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: [
      'checkmarkWrapper:unchecked',
      'checkmarkWrapper:disabled',
      'checkmarkWrapper:checked',
      'checkmarkWrapper:disabled-unchecked',
      'checkmarkWrapper:disabled-checked',
    ],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? styles['checkmarkWrapper:disabled-checked'] : styles['checkmarkWrapper:disabled-unchecked']
      }
      const style = value ? styles['checkmarkWrapper:checked'] : styles['checkmarkWrapper:unchecked']
      return {
        ...style,
        ...disabledStyle,
      }
    },
    dependencies: [value, disabled],
  })

  // @ts-expect-error __props is ICSS
  const _checkboxOnLeft = checkboxOnLeft ?? styles.__props?.checkboxOnLeft

  const handleChange = (e) => {
    const isSpaceBarClick = e?.keyCode === 32
    const isEnterKey = e?.key === 'Enter'
    const isClick = e?.type === 'click'
    if (disabled) return
    if (onValueChange && (isClick || e?.keyCode === 13 || isSpaceBarClick || isEnterKey)) onValueChange?.(!value)
  }

  const getStyles = (key: CheckboxParts) => mergeStyles([
    styles[key],
    disabled ? styles[key + ':disabled'] : null,
  ])

  return (
    <InputBase
      {...inputBaseProps}
      debugName={debugName}
      style={styles}
      order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
    >
      <motion.div
        style={getStyles('box')}
        initial={false}
        animate={boxAnimation}
        transition={styles['box:transition']}
        onClick={handleChange}
        onKeyDown={handleChange}
        tabIndex={0}
      >
        <motion.div
          style={getStyles('checkmarkWrapper')}
          initial={false}
          animate={checkmarkWrapperAnimation}
          transition={styles['checkmarkWrapper:transition']}
        >
          <Icon
            debugName={debugName}
            name={checkIcon as AppIcon}
            style={getStyles('checkmark')}
          />
        </motion.div>
      </motion.div>
    </InputBase>
  )
}

Checkbox.styleRegistryName = 'Checkbox'
Checkbox.elements = [...InputBase.elements, 'checkmarkWrapper', 'checkmark', 'box', '__props']
Checkbox.rootElement = 'wrapper'

Checkbox.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Checkbox as (props: StyledComponentProps<CheckboxProps, typeof styles>) => IJSX
}

Checkbox.defaultProps = {
  checkIcon: 'check' as AppIcon,
} as Partial<CheckboxProps>

WebStyleRegistry.registerComponent(Checkbox)
