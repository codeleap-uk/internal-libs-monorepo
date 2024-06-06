import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import { View, Text, Icon } from '../../components'
import { TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { ProgressCirclePresets } from './styles'
import { ProgressCircleProps } from './types'
import { formatProgress as _formatProgress } from '../utils'
import { useMemo } from '@codeleap/common'

export * from './styles'
export * from './types'

const defaultProps: Partial<ProgressCircleProps> = {
  progress: 0,
  variants: [],
  responsiveVariants: {},
  styles: {},
  showProgress: false,
  formatProgress: _formatProgress,
  size: null,
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
    circleProps,
    children,
    formatProgress,
    circleStyles,
    textProps,
    size: propSize,
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

  const wrapperSize = useMemo(() => {
    if (TypeGuards.isNumber(propSize)) return propSize
    const { size, width, height } = variantStyles.circle
    const value = size ?? width ?? height
    return value ?? 0
  }, [variantStyles.circle])

  return (
    <View debugName={debugName} style={variantStyles.wrapper} {...rest}>
      <CircularProgressbarWithChildren
        value={progress}
        css={[
          variantStyles.circle,
          { width: wrapperSize, height: wrapperSize },
        ]}
        styles={buildStyles({
          pathColor: variantStyles.line?.borderColor,
          trailColor: variantStyles.line?.backgroundColor,
          strokeLinecap: 'butt',
          ...circleStyles,
        })}
        {...circleProps}
      >
        {children}
        {!TypeGuards.isNil(icon) ? (
          <Icon
            name={icon}
            style={variantStyles.icon}
            debugName={`innerIcon-${debugName}`}
            {...iconProps}
          />
        ) : null}
        {TypeGuards.isString(text) || showProgress ? (
          <Text
            style={variantStyles.text}
            text={showProgress ? formatProgress(progress) : String(text)}
            {...textProps}
          />
        ) : text}
      </CircularProgressbarWithChildren>
    </View>
  )
}

ProgressCircle.defaultProps = defaultProps
