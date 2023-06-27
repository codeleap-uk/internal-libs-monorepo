/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  StylesOf,
  PropsOf,
} from '@codeleap/common'
import { View } from '../View'
import { CheckboxPresets, CheckboxComposition } from './styles'
import { InputBase, InputBaseDefaultOrder, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Icon } from '../Icon'
import { motion } from 'framer-motion'

export * from './styles'

export type CheckboxProps = Pick<
  InputBaseProps,
  'debugName' | 'disabled' | 'label'
> & {
  variants?: ComponentVariants<typeof CheckboxPresets>['variants']
  styles?: StylesOf<CheckboxComposition>
  value: boolean
  onValueChange: (value: boolean) => void
  style?: PropsOf<typeof View>['style']
  checkboxOnLeft?: boolean
}

const reversedOrder = [...InputBaseDefaultOrder].reverse()

export const Checkbox = (props: CheckboxProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(props)

  const {
    variants = [],
    style = {},
    styles = {},
    value,
    disabled,
    debugName,
    onValueChange,
    checkboxOnLeft,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:Checkbox', typeof CheckboxPresets>('u:Checkbox', {
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const boxAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: ['box:unchecked', 'box:disabled', 'box:checked', 'box:disabled-checked', 'box:disabled-unchecked'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = value ? variantStyles['box:disabled-checked'] : variantStyles['box:disabled-unchecked']
      }
      const style = value ? variantStyles['box:checked'] : variantStyles['box:unchecked']

      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const checkmarkWrapperAnimation = useAnimatedVariantStyles({
    variantStyles,
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
        disabledStyle = value ? variantStyles['checkmarkWrapper:disabled-checked'] : variantStyles['checkmarkWrapper:disabled-unchecked']
      }
      const style = value ? variantStyles['checkmarkWrapper:checked'] : variantStyles['checkmarkWrapper:unchecked']
      return {
        ...style,
        ...disabledStyle,
      }

    },
    dependencies: [value, disabled],
  })

  const _checkboxOnLeft = checkboxOnLeft ?? variantStyles.__props?.checkboxOnLeft

  const handleChange = () => {
    if (disabled) return
    if (onValueChange) onValueChange?.(!value)
  }

  return <InputBase
    {...inputBaseProps}
    debugName={debugName}
    styles={{
      ...variantStyles,
      innerWrapper: [
        variantStyles.innerWrapper,
      ],
    }}
    order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
    style={style}
  >
    <motion.div
      css={[
        variantStyles.box,
        disabled && variantStyles['box:disabled'],
      ]}
      initial={false}
      animate={boxAnimation}
      transition={variantStyles['box:transition']}
      onClick={handleChange}
    >
      <motion.div
        css={[
          variantStyles.checkmarkWrapper,
          disabled && variantStyles['checkmarkWrapper:disabled'],
        ]}
        initial={false}
        animate={checkmarkWrapperAnimation}
        transition={variantStyles['checkmarkWrapper:transition']}
      >
        <Icon
          name={'checkbox-checkmark' as any}
          css={[variantStyles.checkmark, disabled && variantStyles['checkmark:disabled']]}
        />
      </motion.div>
    </motion.div>
  </InputBase>
}
