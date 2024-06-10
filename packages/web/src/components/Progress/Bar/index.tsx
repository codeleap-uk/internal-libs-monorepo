import { TypeGuards } from '@codeleap/common'
import { Root, Indicator } from '@radix-ui/react-progress'
import { Icon, Text, View } from '../../components'
import { ProgressBarProps } from './types'
import { formatProgress as _formatProgress } from '../utils'
import { WebStyleRegistry } from '../../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../../lib/hooks/useStylesFor'

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

  return (
    <View style={styles.wrapper} debugName={debugName} {...rest}>
      {!TypeGuards.isNil(leftIcon) ? (
        <Icon
          name={leftIcon}
          style={{ ...styles.icon, ...styles.leftIcon }}
          debugName={`leftIcon-${debugName}`}
          {...leftIconProps}
        />
      ) : null}
      {TypeGuards.isString(leftText) ? (
        <Text
          text={leftText}
          style={[styles.text, styles.leftText]}
          {...leftTextProps}
        />
      ) : (
        leftText
      )}
      <Root
        style={styles.progress}
        value={progress}
        {...progressRootProps}
      >
        <Indicator
          css={[
            // @ts-expect-error @verify
            styles.indicator,
            { transform: `translateX(-${100 - progress}%)` },
          ]}
          {...progressIndicatorProps}
        />
      </Root>
      {TypeGuards.isString(text) || showProgress ? (
        <Text
          style={styles.text}
          text={showProgress ? formatProgress(progress) : text}
          {...textProps}
        />
      ) : text}
      {!TypeGuards.isNil(rightIcon) ? (
        <Icon
          name={rightIcon}
          style={{ ...styles.icon, ...styles.rightIcon }}
          debugName={`rightIcon-${debugName}`}
          {...rightIconProps}
        />
      ) : null}
      {TypeGuards.isString(rightText) ? (
        <Text
          text={rightText}
          style={[styles.text, styles.rightText]}
          {...rightTextProps}
        />
      ) : (
        rightText
      )}
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
  variants: [],
  responsiveVariants: {},
  styles: {},
  textProps: {},
  progressIndicatorProps: {},
  progressRootProps: {},
  showProgress: false,
  formatProgress: _formatProgress,
} as Partial<ProgressBarProps>

WebStyleRegistry.registerComponent(ProgressBar)

export * from './types'
export * from './styles'
