import { ProgressBarPresets } from './styles'
import { useDefaultComponentStyle } from '@codeleap/common'
import { Root, Indicator } from '@radix-ui/react-progress'
import { Icon, Text, View } from '../../components'
import { ProgressBarProps } from './types'
import { formatProgress } from '../utils'

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
    textProps,
    progressIndicatorProps,
    progressRootProps,
    showProgress,
    leftIcon,
    leftIconProps,
    rightIcon,
    rightIconProps,
    leftText,
    rightText,
    debugName,
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
      {leftIcon && (
        <Icon
          name={leftIcon}
          style={{ ...variantStyles.icon, ...variantStyles.leftIcon }}
          debugName={`leftIcon-${debugName}`}
          {...leftIconProps}
        />
      )}
      {leftText && (
        <Text
          text={leftText}
          css={[variantStyles.text, variantStyles.leftText]}
          {...textProps}
        />
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
      {showProgress && (
        <Text
          css={variantStyles.text}
          text={formatProgress(progress)}
          {...textProps}
        />
      )}
      {rightIcon && (
        <Icon
          name={rightIcon}
          style={{ ...variantStyles.icon, ...variantStyles.rightIcon }}
          debugName={`rightIcon-${debugName}`}
          {...rightIconProps}
        />
      )}
      {rightText && (
        <Text
          text={rightText}
          css={[variantStyles.text, variantStyles.rightText]}
          {...textProps}
        />
      )}
    </View>
  )
}

ProgressBar.defaultProps = defaultProps
