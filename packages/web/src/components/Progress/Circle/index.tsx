import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import { View, Text, Icon } from '../../components'
import { useDefaultComponentStyle } from '@codeleap/common'
import { ProgressCirclePresets } from './styles'
import { ProgressCircleProps } from './types'
import { formatProgress } from '../utils'

export * from './styles'
export * from './types'

const defaultProps: Partial<ProgressCircleProps> = {
  progress: 0,
  variants: [],
  responsiveVariants: {},
  styles: {},
  showProgress: false,
}

export const ProgressCircle = (props: ProgressCircleProps) => {
  const allProps = {
    ...ProgressCircle.defaultProps,
    ...props,
  }

  const {
    text,
    progress,
    icon,
    iconProps,
    variants,
    styles,
    debugName,
    showProgress,
    responsiveVariants,
    children,
    ...rest
  } = allProps

  const variantStyles = useDefaultComponentStyle<
    'u:ProgressCircle',
    typeof ProgressCirclePresets
  >('u:ProgressCircle', {
    variants,
    responsiveVariants,
    styles,
    rootElement: 'wrapper',
  })

  const wrapperSize =
    variantStyles.circle?.size ??
    variantStyles.circle?.width ??
    variantStyles.circle?.height ??
    0

  const InnerIcon = () => (
    <Icon
      name={icon}
      style={variantStyles.icon}
      debugName={`innerIcon-${debugName}`}
      {...iconProps}
    />
  )

  const _Text = () => (
    <Text style={variantStyles.text} text={showProgress ? formatProgress(progress) : text} />
  )

  return (
    <View debugName={debugName} {...rest}>
      <CircularProgressbarWithChildren
        value={progress}
        css={{
          ...variantStyles.circle,
          width: wrapperSize,
          height: wrapperSize,
        }}
        styles={buildStyles({
          pathColor: variantStyles.line?.borderColor,
          trailColor: variantStyles.line?.backgroundColor,
          strokeLinecap: 'butt',
        })}
      >
        {children ?? (icon && <InnerIcon />) ?? <_Text />}
      </CircularProgressbarWithChildren>
    </View>
  )
}

ProgressCircle.defaultProps = defaultProps
