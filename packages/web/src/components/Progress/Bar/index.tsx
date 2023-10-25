import { ProgressBarPresets } from './styles'
import { TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { Root, Indicator } from '@radix-ui/react-progress'
import { Icon, Text, View } from '../../components'
import { ProgressBarProps } from './types'
import { formatProgress as _formatProgress } from '../utils'

export * from './types'
export * from './styles'

const defaultProps: Partial<ProgressBarProps> = {
  progress: 0,
  variants: [],
  responsiveVariants: {},
  styles: {},
  textProps: {},
  progressIndicatorProps: {},
  progressRootProps: {},
  showProgress: false,
  formatProgress: _formatProgress,
}

export const ProgressBar = (props: ProgressBarProps) => {
  const allProps = {
    ...ProgressBar.defaultProps,
    ...props,
  }

  const {
    progress,
    variants,
    responsiveVariants,
    styles,
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
  } = allProps

  const variantStyles = useDefaultComponentStyle<
    'u:ProgressBar',
    typeof ProgressBarPresets
  >('u:ProgressBar', {
    variants,
    responsiveVariants,
    styles,
  })

  return (
    <View css={variantStyles.wrapper} debugName={debugName} {...rest}>
      {!TypeGuards.isNil(leftIcon) ? (
        <Icon
          name={leftIcon}
          style={{ ...variantStyles.icon, ...variantStyles.leftIcon }}
          debugName={`leftIcon-${debugName}`}
          {...leftIconProps}
        />
      ) : null}
      {TypeGuards.isString(leftText) ? (
        <Text
          text={leftText}
          css={[variantStyles.text, variantStyles.leftText]}
          {...leftTextProps}
        />
      ) : (
        leftText
      )}
      <Root
        css={variantStyles.progress}
        value={progress}
        {...progressRootProps}
      >
        <Indicator
          css={[
            variantStyles.indicator,
            { transform: `translateX(-${100 - progress}%)` },
          ]}
          {...progressIndicatorProps}
        />
      </Root>
      {TypeGuards.isString(text) || showProgress ? (
        <Text
          style={variantStyles.text}
          text={showProgress ? formatProgress(progress) : text}
          {...textProps}
        />
      ) : text}
      {!TypeGuards.isNil(rightIcon) ? (
        <Icon
          name={rightIcon}
          style={{ ...variantStyles.icon, ...variantStyles.rightIcon }}
          debugName={`rightIcon-${debugName}`}
          {...rightIconProps}
        />
      ) : null}
      {TypeGuards.isString(rightText) ? (
        <Text
          text={rightText}
          css={[variantStyles.text, variantStyles.rightText]}
          {...rightTextProps}
        />
      ) : (
        rightText
      )}
    </View>
  )
}

ProgressBar.defaultProps = defaultProps
