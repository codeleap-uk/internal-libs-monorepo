import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import { View, Text, Icon } from '../../components'
import { TypeGuards } from '@codeleap/common'
import { ProgressCircleProps } from './types'
import { formatProgress as _formatProgress } from '../utils'
import { useMemo } from '@codeleap/common'
import { useStylesFor } from '../../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../../lib'

export const ProgressCircle = (props: ProgressCircleProps) => {

  const {
    text,
    progress,
    icon,
    iconProps,
    debugName,
    showProgress,
    circleProps,
    children,
    formatProgress,
    circleStyles,
    style,
    textProps,
    size: propSize,
    ...rest
  } = {
    ...ProgressCircle.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ProgressCircle.styleRegistryName, style)

  const wrapperSize = useMemo(() => {
    if (TypeGuards.isNumber(propSize)) return propSize
    const { size, width, height } = styles.circle
    const value = size ?? width ?? height
    return value ?? 0
  }, [styles.circle])

  return (
    <View debugName={debugName} style={styles.wrapper} {...rest}>
      <CircularProgressbarWithChildren
        value={progress}
        css={[
          styles.circle,
          { width: wrapperSize, height: wrapperSize },
        ]}
        styles={buildStyles({
          pathColor: styles.line?.borderColor,
          trailColor: styles.line?.backgroundColor,
          strokeLinecap: 'butt',
          ...circleStyles,
        })}
        {...circleProps}
      >
        {children}
        {!TypeGuards.isNil(icon) ? (
          <Icon
            name={icon}
            style={styles.icon}
            debugName={`innerIcon-${debugName}`}
            {...iconProps}
          />
        ) : null}
        {TypeGuards.isString(text) || showProgress ? (
          <Text
            style={styles.text}
            text={showProgress ? formatProgress(progress) : String(text)}
            {...textProps}
          />
        ) : text}
      </CircularProgressbarWithChildren>
    </View>
  )
}

ProgressCircle.styleRegistryName = 'ProgressCircle'
ProgressCircle.elements = ['wrapper', 'line', 'circle', 'text', 'icon', 'text']
ProgressCircle.rootElement = 'wrapper'

ProgressCircle.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ProgressCircle as (props: StyledComponentProps<ProgressCircleProps, typeof styles>) => IJSX
}

ProgressCircle.defaultProps = {
  progress: 0,
  variants: [],
  responsiveVariants: {},
  styles: {},
  showProgress: false,
  formatProgress: _formatProgress,
  size: null,
} as Partial<ProgressCircleProps>

WebStyleRegistry.registerComponent(ProgressCircle)

export * from './styles'
export * from './types'
