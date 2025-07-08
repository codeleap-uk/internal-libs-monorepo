import { InputBase, InputBaseDefaultOrder, selectInputBaseProps } from '../InputBase'
import { useAnimatedVariantStyles } from '../..'
import { Icon } from '../Icon'
import { motion } from 'framer-motion'
import { CheckboxProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, AppIcon, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { CheckboxParts } from './styles'
import { TypeGuards } from '@codeleap/types'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'

export * from './styles'
export * from './types'

const reversedOrder = [...InputBaseDefaultOrder].reverse()

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
    disabled,
    debugName,
    field,
    value,
    onValueChange,
    checkboxOnLeft,
    checkIcon,
  } = checkboxProps

  const styles = useStylesFor(Checkbox.styleRegistryName, style)

  const {
    validation,
    wrapperRef,
    inputValue,
    onInputValueChange,
  } = useInputBase(field, fields.boolean, { value, onValueChange })

  const boxAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
    animatedProperties: ['box:unchecked', 'box:disabled', 'box:checked', 'box:disabled-checked', 'box:disabled-unchecked'],
    updater: () => {
      'worklet'
      let disabledStyle = {}
      if (disabled) {
        disabledStyle = inputValue ? styles['box:disabled-checked'] : styles['box:disabled-unchecked']
      }
      const style = inputValue ? styles['box:checked'] : styles['box:unchecked']

      return {
        ...style,
        ...disabledStyle,
      }
    },
    dependencies: [inputValue, disabled],
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
        disabledStyle = inputValue ? styles['checkmarkWrapper:disabled-checked'] : styles['checkmarkWrapper:disabled-unchecked']
      }
      const style = inputValue ? styles['checkmarkWrapper:checked'] : styles['checkmarkWrapper:unchecked']
      return {
        ...style,
        ...disabledStyle,
      }
    },
    dependencies: [inputValue, disabled],
  })

  // @ts-expect-error __props is ICSS
  const _checkboxOnLeft = checkboxOnLeft ?? styles?.__props?.checkboxOnLeft

  const handleChange = (e) => {
    if (disabled) return
    if (!TypeGuards.isFunction(onInputValueChange)) return

    const isSpaceBarClick = e?.keyCode === 32
    const isEnterKey = e?.key === 'Enter'
    const isClick = e?.type === 'click'

    if (isClick || e?.keyCode === 13 || isSpaceBarClick || isEnterKey) {
      onInputValueChange?.(!inputValue)
    }
  }

  const getStyles = (key: CheckboxParts) => mergeStyles([
    styles[key],
    disabled ? styles[key + ':disabled'] : null,
  ])

  const componentStyles = {
    box: getStyles('box'),
    checkmarkWrapper: getStyles('checkmarkWrapper'),
    checkmark: getStyles('checkmark'),
  }

  const hasError = validation?.showError

  return (
    <InputBase
      {...inputBaseProps}
      ref={wrapperRef}
      error={hasError ? validation?.message : null}
      debugName={debugName}
      style={styles}
      order={_checkboxOnLeft ? reversedOrder : InputBaseDefaultOrder}
    >
      <motion.div
        style={componentStyles.box}
        initial={false}
        animate={boxAnimation}
        transition={styles['box:transition']}
        onClick={handleChange}
        onKeyDown={handleChange}
        tabIndex={0}
      >
        <motion.div
          style={componentStyles.checkmarkWrapper}
          initial={false}
          animate={checkmarkWrapperAnimation}
          transition={styles['checkmarkWrapper:transition']}
        >
          <Icon
            debugName={debugName}
            name={checkIcon as AppIcon}
            style={componentStyles.checkmark}
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
