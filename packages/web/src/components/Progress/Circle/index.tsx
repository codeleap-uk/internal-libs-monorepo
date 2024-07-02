import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { View, Text, Icon } from '../../components'
import { TypeGuards } from '@codeleap/common'
import { ProgressCircleProps } from './types'
import { formatProgress as _formatProgress } from '../utils'
import { useMemo } from '@codeleap/common'
import { useStylesFor } from '../../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../../lib/WebStyleRegistry'

export * from './styles'
export * from './types'

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
    // @ts-expect-error icss type
    const value = styles.circle?.size ?? styles.circle?.width ?? styles.circle?.height
    return value ?? 0
  }, [styles.circle])

  return (
    <View debugName={debugName} {...rest} style={styles.wrapper}>
      <CircularProgressbarWithChildren
        value={progress}
        styles={buildStyles({
          // @ts-expect-error icss type
          pathColor: styles.line?.borderColor,
          // @ts-expect-error icss type
          trailColor: styles.line?.backgroundColor,
          strokeLinecap: 'butt',
          ...circleStyles,
        })}
        {...circleProps}
        css={{ ...styles.circle, width: wrapperSize, height: wrapperSize }}
      >
        {children}

        {!TypeGuards.isNil(icon) ? (
          <Icon
            name={icon}
            debugName={`innerIcon-${debugName}`}
            {...iconProps}
            style={styles.icon}
          />
        ) : null}

        {TypeGuards.isString(text) || showProgress ? (
          <Text
            text={showProgress ? formatProgress(progress) : String(text)}
            {...textProps}
            style={styles.text}
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
  showProgress: false,
  formatProgress: _formatProgress,
  size: null,
} as Partial<ProgressCircleProps>

WebStyleRegistry.registerComponent(ProgressCircle)
