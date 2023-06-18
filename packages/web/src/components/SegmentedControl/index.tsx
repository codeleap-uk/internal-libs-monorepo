import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import { ComponentVariants, useDefaultComponentStyle, PropsOf, IconPlaceholder, StylesOf } from '@codeleap/common'
import { SegmentedControlPresets } from './styles'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'

type SegmentedContropOptions<T = string> = {label: string; value: T; icon?: IconPlaceholder}

export type SegmentedControlProps<T = string> = {

  /** options that the segmented control will receive */
  options : SegmentedContropOptions[]

  /** the value of the segmented control */
  value?: T

  /**  all styles from the segmented control */
  styles?: StylesOf<SegmentedControlComposition>

  /**  all styles from the segmented control */
  style: PropsOf<typeof View>['style']

  /** all variants of the segmented control */
  variants?: ComponentVariants<typeof SegmentedControlPresets > & {}

  /**  prop to control when te value of the segmented control changes */
  onValueChange?: (v: any) => void

  /** label that will be shown above the segmented control */
  label?: string

  /** * all the touchable props */
  touchableProps?: Partial<PropsOf<typeof Touchable>>
}

export const SegmentedControl = (props: SegmentedControlProps) => {

  const { label, options, styles = {}, value, variants = [], onValueChange, style, ...rest } = props

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>(
    'u:SegmentedControl',
    {
      variants, styles,
    },
  )

  const controlWrapperStyles = [variantStyles.controlWrapper, props?.touchableProps?.disabled && variantStyles['controlWrapper:disabled']]

  return (
    <View css={[variantStyles.wrapper, style]} {...rest}>
      {label && <Text text={label} css={variantStyles.label} />}
      <View css={variantStyles.innerWrapper}>
        <View
          css={controlWrapperStyles}
        >
          {options.map((o, idx) => (
            <SegmentedControlOption
              label={o.label}
              value={o.value}
              onPress={() => onValueChange(o.value)}
              key={idx}
              icon={o.icon}
              selected={value === o.value}
              variantStyles={variantStyles}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

export * from './styles'
