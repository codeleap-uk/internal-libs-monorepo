/** @jsx jsx */
import { IconPlaceholder } from '@codeleap/common'
import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Icon } from '../Icon'
import { motion } from 'framer-motion'
import { CheckboxProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Checkbox = (props: CheckboxProps) => {

  const {
    inputBaseProps,
    others,
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
  } = others

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

  const _checkboxOnLeft = checkboxOnLeft ?? styles.__props?.checkboxOnLeft

  const handleChange = (e) => {
    if (disabled) return
    if (onValueChange && (e?.type === 'click' || e?.keyCode === 13 || e?.key === 'Enter')) onValueChange?.(!value)
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
      order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
    >
      <motion.div
        css={[
          styles.box,
          disabled && styles['box:disabled'],
        ]}
        initial={false}
        animate={boxAnimation}
        transition={styles['box:transition']}
        onClick={handleChange}
        onKeyDown={handleChange}
        tabIndex={0}
      >
        <motion.div
          css={[
            styles.checkmarkWrapper,
            disabled && styles['checkmarkWrapper:disabled'],
          ]}
          initial={false}
          animate={checkmarkWrapperAnimation}
          transition={styles['checkmarkWrapper:transition']}
        >
          <Icon
            debugName={debugName}
            name={checkIcon as any}
            style={[styles.checkmark, disabled && styles['checkmark:disabled']]}
          />
        </motion.div>
      </motion.div>
    </InputBase>
  )
}

Checkbox.styleRegistryName = 'Checkbox'

Checkbox.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'errorMessage',
  'description',
  'labelRow',
  'icon',
  'leftIcon',
  'rightIcon',
  'checkmarkWrapper',
  'checkmark',
  'box',
  '__props',
]

Checkbox.rootElement = 'wrapper'

Checkbox.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Checkbox as (props: StyledComponentProps<CheckboxProps, typeof styles>) => IJSX
}

Checkbox.defaultProps = {
  checkIcon: 'check' as IconPlaceholder,
} as Partial<CheckboxProps>

WebStyleRegistry.registerComponent(Checkbox)

export * from './styles'
export * from './types'
