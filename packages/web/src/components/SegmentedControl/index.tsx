import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  useMemo,
} from '@codeleap/common'
import { SegmentedControlPresets } from './styles'

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
  getItemWidth?: (item:{label: string; value: any }, idx: number, arr: {label: string; value: any }[]) => number
  /**
    * Determine if the modal is visible
  */
}

export const SegmentedControl = (props: SegmentedControlProps) => {

  const { getItemWidth, label, options, styles = {}, value, variants = [], onValueChange, RenderAnimatedView } = props

  const widthStyle = useMemo(() => {
    const sizes = options.map(getItemWidth)
    const maxWidth = sizes.sort((a, b) => b - a)[0]

    return { width: maxWidth }
  }, [options])

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>(
    'u:SegmentedControl',
    {
      variants, styles,
    },
  )

  return (
    <View css={variantStyles.wrapper}>
      <View css={variantStyles.innerWrapper}>
        <View
          // css={variantStyles}
          css={[variantStyles.selectedBubble, props?.touchableProps?.disabled && variantStyles['selectedBubble:disabled'], widthStyle]}
        >
          {options.map((o, idx) => (
            <SegmentedControlOption
              label={o.label}
              value={o.value}
              onPress={onValueChange}
              key={idx}
              style={widthStyle}
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
