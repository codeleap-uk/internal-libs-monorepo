/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  StylesOf,
  PropsOf,
  IconPlaceholder,
} from '@codeleap/common'
import { View } from '../View'
import { CheckboxPresets, CheckboxComposition } from './styles'
import { InputBase, InputBaseDefaultOrder, InputBaseProps, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Icon } from '../Icon'
import { motion } from 'framer-motion'
import { ComponentCommonProps } from '../../types/utility'

export * from './styles'

/** * Checkbox */
export type CheckboxProps = Pick<
  InputBaseProps,
  'debugName' | 'disabled' | 'label'
> & ComponentCommonProps & {
  styles?: StylesOf<CheckboxComposition>
  /** prop */
  value: boolean
  /** prop */
  onValueChange: (value: boolean) => void
  style?: PropsOf<typeof View>['style']
  /** prop */
  checkboxOnLeft?: boolean
  /** prop */
  checkIcon?: IconPlaceholder
} & ComponentVariants<typeof CheckboxPresets>

const reversedOrder = [...InputBaseDefaultOrder].reverse()

const defaultProps: Partial<CheckboxProps> = {
  checkIcon: 'check' as IconPlaceholder,
}

export const Checkbox = (props: CheckboxProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps(props)

  const {
    responsiveVariants = {},
    variants = [],
    style = {},
    styles = {},
    value,
    disabled,
    debugName,
    onValueChange,
    checkboxOnLeft,
    checkIcon,
  } = others

  const variantStyles = useDefaultComponentStyle<'u:Checkbox', typeof CheckboxPresets>('u:Checkbox', {
    responsiveVariants,
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

  const handleChange = (e) => {
    if (disabled) return
    if (onValueChange && (e?.type === 'click' || e?.keyCode === 13 || e?.key === 'Enter')) onValueChange?.(!value)
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
      onKeyDown={handleChange}
      tabIndex={0}
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
          debugName={debugName}
          name={checkIcon as any}
          css={[variantStyles.checkmark, disabled && variantStyles['checkmark:disabled']]}
          style={variantStyles.checkmark}
        />
      </motion.div>
    </motion.div>
  </InputBase>
}

Checkbox.defaultProps = defaultProps
