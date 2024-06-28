import { TypeGuards } from '@codeleap/common'
import { Root, Indicator } from '@radix-ui/react-progress'
import { Icon, Text, View } from '../../components'
import { ProgressBarProps } from './types'
import { formatProgress as _formatProgress } from '../utils'
import { WebStyleRegistry } from '../../../lib'
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../../lib/hooks/useStylesFor'

export * from './types'
export * from './styles'

export const ProgressBar = (props: ProgressBarProps) => {
  const {
    progress,
    style,
    debugName,
    formatProgress,
    progressIndicatorProps,
    progressRootProps,
    showProgress,
    leftIcon,
    leftIconProps,
    rightIcon,
    rightIconProps,
    text,
    textProps,
    leftText,
    leftTextProps,
    rightText,
    rightTextProps,
    ...rest
  } = {
    ...ProgressBar.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ProgressBar.styleRegistryName, style)

  const leftIconStyles = mergeStyles([styles.icon, styles.leftIcon])
  const rightIconStyles = mergeStyles([styles.icon, styles.rightIcon])

  const leftTextStyles = mergeStyles([styles.text, styles.leftText])
  const rightTextStyles = mergeStyles([styles.text, styles.rightText])

  return (
    <View debugName={debugName} {...rest} style={styles.wrapper}>
      {!TypeGuards.isNil(leftIcon) ? (
        <Icon
          name={leftIcon}
          debugName={`leftIcon-${debugName}`}
          {...leftIconProps}
          style={leftIconStyles}
        />
      ) : null}
      {TypeGuards.isString(leftText) ? (
        <Text
          text={leftText}
          {...leftTextProps}
          style={leftTextStyles}
        />
      ) : leftText}

      <Root
        value={progress}
        {...progressRootProps}
        style={styles.progress}
      >
        <Indicator {...progressIndicatorProps} style={{ ...styles.indicator, transform: `translateX(-${100 - progress}%)` }} />
      </Root>

      {TypeGuards.isString(text) || showProgress ? (
        <Text
          text={showProgress ? formatProgress(progress) : text}
          {...textProps}
          style={styles.text}
        />
      ) : text}

      {!TypeGuards.isNil(rightIcon) ? (
        <Icon
          name={rightIcon}
          debugName={`rightIcon-${debugName}`}
          {...rightIconProps}
          style={rightIconStyles}
        />
      ) : null}
      {TypeGuards.isString(rightText) ? (
        <Text
          text={rightText}
          {...rightTextProps}
          style={rightTextStyles}
        />
      ) : rightText}
    </View>
  )
}

ProgressBar.styleRegistryName = 'ProgressBar'
ProgressBar.elements = ['wrapper', 'progress', 'indicator', 'text', 'icon', 'leftIcon', 'leftText', 'rightIcon', 'rightText']
ProgressBar.rootElement = 'wrapper'

ProgressBar.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ProgressBar as (props: StyledComponentProps<ProgressBarProps, typeof styles>) => IJSX
}

ProgressBar.defaultProps = {
  progress: 0,
  showProgress: false,
  formatProgress: _formatProgress,
} as Partial<ProgressBarProps>

WebStyleRegistry.registerComponent(ProgressBar)
