import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import { ComponentVariants, useDefaultComponentStyle } from '@codeleap/common'
import { SegmentedControlPresets } from './styles'
import { Text } from '../Text'

export type SegmentedControlProps = {
  options?: {label: string; value: any }[]
  /**
   * Determine if the modal is visible
  */
  value?: any
  /**
   * Determine if the modal is visible
  */
  styles?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  variants?: ComponentVariants<typeof SegmentedControlPresets>['variants']
  /**
    * Determine if the modal is visible
  */
  onValueChange?: (v: any) => void
  /**
    * Determine if the modal is visible
  */
  label?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
}

export const SegmentedControl = (props: SegmentedControlProps) => {

  const { label, options, styles = {}, value, variants = [], onValueChange } = props

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>(
    'u:SegmentedControl',
    {
      variants, styles,
    },
  )

  return (
    <View css={variantStyles.wrapper}>
      <View css={variantStyles.innerWrapper}>
        <Text label={label} />
        <View
          css={[variantStyles.selectedBubble, props?.touchableProps?.disabled && variantStyles['selectedBubble:disabled']]}
        >
          {options.map((o, idx) => (
            <SegmentedControlOption
              label={o.label}
              value={o.value}
              onPress={onValueChange}
              key={idx}
              style={styles}
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
