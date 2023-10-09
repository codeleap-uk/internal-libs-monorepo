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

export const ProgressCircle = (props: ProgressCircleProps) => {
  const {
    text,
    progress,
    icon,
    variants,
    styles,
    debugName,
    showProgress,
    responsiveVariants,
    children,
    ...rest
  } = props

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

  return (
    <View variants={['alignCenter']} debugName={debugName} {...rest}>
      <CircularProgressbarWithChildren
        value={progress}
        css={{
          width: wrapperSize,
          height: wrapperSize,
        }}
        styles={buildStyles({
          pathColor: variantStyles.line?.borderColor,
          trailColor: variantStyles.line?.backgroundColor,
          strokeLinecap: 'butt',
        })}
      >
        {children ??
          (icon && (
            <Icon
              name={icon}
              style={variantStyles.icon}
              debugName={`innerIcon-${debugName}`}
            />
          )) ??
          (showProgress && (
            <Text style={variantStyles.text} text={formatProgress(progress)} />
          ))}
      </CircularProgressbarWithChildren>
    </View>
  )
}
