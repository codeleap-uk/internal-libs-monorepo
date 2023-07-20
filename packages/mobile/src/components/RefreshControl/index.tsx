import { ComponentVariants, StylesOf, useDefaultComponentStyle } from '@codeleap/common'
import { RefreshControl as RNRefreshControl, RefreshControlProps as RNRefreshControlProps } from 'react-native'
import { RefreshControlComposition, RefreshControlPresets } from './styles'

export type RefreshControlProps = {
  styles?: StylesOf<RefreshControlComposition>
} & RNRefreshControlProps & ComponentVariants<typeof RefreshControlPresets>

export const RefreshControl = (props:RefreshControlProps) => {
  const { variants = [], styles } = props

  const variantStyles = useDefaultComponentStyle<'u:RefreshControl', typeof RefreshControlPresets>('u:RefreshControl', {
    variants,
    styles,
  })
  return (
    <RNRefreshControl
      colors={[variantStyles.loadingAnimation?.color]}
      tintColor={variantStyles.loadingAnimation?.color}
      progressBackgroundColor={variantStyles.progressBackgroundColor?.color}
      titleColor={variantStyles.titleColor?.color}
      {...props}
    />

  )
}

export * from './styles'
