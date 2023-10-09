import { ProgressBarPresets } from './styles'
import { useDefaultComponentStyle } from '@codeleap/common'
import { Root, Indicator } from '@radix-ui/react-progress'
import { Icon, Text, View } from '../../components'
import { ProgressBarProps } from './types'
import { formatProgress } from '../utils'

export * from './types'
export * from './styles'

export const ProgressBar = (props: ProgressBarProps) => {
  const {
    progress = 0,
    variants = [],
    responsiveVariants = {},
    styles = {},
    textProps = {},
    progressIndicatorProps = {},
    progressRootProps = {},
    showProgress = false,
    leftIcon,
    rightIcon,
    leftText,
    rightText,
    debugName,
    ...rest
  } = props

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
