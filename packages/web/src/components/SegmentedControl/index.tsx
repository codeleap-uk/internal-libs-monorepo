import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import { ComponentVariants, useDefaultComponentStyle, PropsOf, IconPlaceholder, FormTypes } from '@codeleap/common'
import { SegmentedControlPresets } from './styles'
import { Text } from '../Text'
// import { Scroll } from '../Scroll'
import { Touchable } from '../Touchable'

type SegmentedContropOptions<T = string> = {label: string; value: T; icon?: IconPlaceholder}

export type SegmentedControlProps = {
  options : SegmentedContropOptions[]
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
  label?: string
  /**
    * Determine if the modal is visible
  */
  touchableProps?: Partial<PropsOf<typeof Touchable>>
}

export const SegmentedControl = (props: SegmentedControlProps) => {

  const { label, options, styles = {}, value, variants = [], onValueChange } = props

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>(
    'u:SegmentedControl',
    {
      variants, styles,
    },
  )

  console.log({ value, options })

  return (
    <View css={variantStyles.wrapper}>
      {label && <Text text={label} css={variantStyles.label} />}
      <View css={variantStyles.innerWrapper}>
        <View
          css={[variantStyles, variantStyles.controlWrapper, props?.touchableProps?.disabled && variantStyles['controlWrapper:disabled']]}
        >
          {options.map((o, idx) => (
            <SegmentedControlOption
              label={o.label}
              value={o.value}
              onPress={() => onValueChange(o.value)}
              key={idx}
              icon={o.icon}
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
