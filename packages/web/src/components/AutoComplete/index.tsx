import { View } from '../View'
import { CSSObject, keyframes } from '@emotion/react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  ActivityIndicatorStyles,
  ActivityIndicatorComposition,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'

export * from './styles'

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to{ 
        transform: rotate(360deg);
    }
`

export type ActivityIndicatorProps = {
  animating?: boolean
  hidesWhenStopped?: boolean
  styles?: StylesOf<ActivityIndicatorComposition>
  css?: CSSObject
} & ComponentVariants<typeof ActivityIndicatorStyles>

export const AutoComplete: React.FC<ActivityIndicatorProps> = (
  indicatorProps,
) => {
  const {
    animating = true,
    hidesWhenStopped = true,

    variants,
    responsiveVariants,
    styles,
    ...viewProps
  } = indicatorProps

  const variantStyles = useDefaultComponentStyle('ActivityIndicator', {
    styles,
    responsiveVariants,
    variants,
  })

  return (
    <View {...viewProps} css={[variantStyles.wrapper, (!animating && hidesWhenStopped) && { visibility: 'hidden' }]}>
      <View css={{ ...variantStyles.circle, ...variantStyles.backCircle }} />
      <View
        css={{
          ...variantStyles.circle,
          ...variantStyles.frontCircle,
          animation: `${spin} 1s infinite`,
          animationPlayState: animating ? 'running' : 'paused',
        }}
      />
    </View>
  )
}
