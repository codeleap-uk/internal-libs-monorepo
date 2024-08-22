import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { TypeGuards } from '@codeleap/common'
import { ProgressCircleProps } from './types'
import { formatProgress as _formatProgress } from '../utils'
import { useMemo } from '@codeleap/common'
import { useStylesFor } from '../../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../../lib/WebStyleRegistry'
import { Text } from '../../Text'
import { Icon } from '../../Icon'
import { View } from '../../View'
import { CSSProperties } from 'react'

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

  const lineStyle = styles.line as CSSProperties

  return (
    <View debugName={debugName} {...rest} style={styles.wrapper}>
      <CircularProgressbarWithChildren
        value={progress}
        styles={buildStyles({
          pathColor: lineStyle?.borderColor,
          trailColor: lineStyle?.backgroundColor,
          strokeLinecap: 'butt',
          ...circleStyles,
        })}
        {...circleProps}
        // @ts-expect-error
        css={[styles.circle, { width: wrapperSize, height: wrapperSize }]}
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
