import { ProgressBarPresets } from './styles'
import { useDefaultComponentStyle } from '@codeleap/common'
import { Root, Indicator } from '@radix-ui/react-progress'
import { Text, View } from '../../components'
import { ProgressBarProps } from './types'

export * from './types'
export * from './styles'

export const ProgressBar = (props: ProgressBarProps) => {
  const {
    progress = 0,
    text,
    variants = [],
    responsiveVariants = {},
    styles = {},
    textProps = {},
    progressIndicatorProps = {},
    progressRootProps = {},
    hideText = false,
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
    <View css={variantStyles.wrapper} {...rest}>
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
      {!hideText && <Text css={variantStyles.text} {...textProps} text={`${text ?? progress + '%'}`} />}
    </View>
  )
}
